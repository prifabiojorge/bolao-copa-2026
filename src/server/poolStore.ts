import "server-only";

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { cloneInitialPool } from "@/features/bolao/data/initialPool";
import type { OrchestratorEvent, OrchestratorOutcome } from "@/features/bolao/domain/orchestrator";
import { runPoolEvent } from "@/features/bolao/domain/orchestrator";
import type { Pool } from "@/features/bolao/domain/types";
import { getSupabaseClient } from "./supabaseClient";

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

let writeQueue = Promise.resolve();

export function getServerNow() {
  return process.env.BOLAO_NOW ? new Date(process.env.BOLAO_NOW) : new Date();
}

// ---------------------------------------------------------------------------
// File-based persistence (local dev & tests)
// ---------------------------------------------------------------------------

const dataFilePath = join(process.cwd(), "data", "bolao-state.json");

async function ensureDataFile() {
  try {
    await readFile(dataFilePath, "utf8");
  } catch {
    await mkdir(dirname(dataFilePath), { recursive: true });
    await writePoolFile(cloneInitialPool());
  }
}

async function readPoolFile(): Promise<Pool> {
  await ensureDataFile();
  const raw = await readFile(dataFilePath, "utf8");
  return JSON.parse(raw) as Pool;
}

async function writePoolFile(pool: Pool): Promise<void> {
  const tmpPath = `${dataFilePath}.tmp`;
  await mkdir(dirname(dataFilePath), { recursive: true });
  await writeFile(tmpPath, JSON.stringify(pool, null, 2), "utf8");
  await rename(tmpPath, dataFilePath);
}

// ---------------------------------------------------------------------------
// Supabase persistence (production)
// ---------------------------------------------------------------------------

const SUPABASE_TABLE = "bolao_state";
const SINGLETON_ID = 1;

async function readPoolSupabase(): Promise<Pool> {
  const supabase = getSupabaseClient()!;

  const { data, error } = await supabase
    .from(SUPABASE_TABLE)
    .select("state")
    .eq("id", SINGLETON_ID)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase read error: ${error.message}`);
  }

  if (!data) {
    // First run: seed the database with initialPool
    const initial = cloneInitialPool();
    await writePoolSupabase(initial);
    return initial;
  }

  return data.state as Pool;
}

async function writePoolSupabase(pool: Pool): Promise<void> {
  const supabase = getSupabaseClient()!;

  const { error } = await supabase
    .from(SUPABASE_TABLE)
    .upsert(
      { id: SINGLETON_ID, state: pool, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );

  if (error) {
    throw new Error(`Supabase write error: ${error.message}`);
  }
}

// ---------------------------------------------------------------------------
// Public API (unchanged interface)
// ---------------------------------------------------------------------------

function useSupabase(): boolean {
  return getSupabaseClient() !== null;
}

export async function readPool(): Promise<Pool> {
  return useSupabase() ? readPoolSupabase() : readPoolFile();
}

export async function writePool(pool: Pool): Promise<void> {
  return useSupabase() ? writePoolSupabase(pool) : writePoolFile(pool);
}

export async function mutatePool(event: OrchestratorEvent): Promise<OrchestratorOutcome> {
  const result = writeQueue.then(async () => {
    const currentPool = await readPool();
    const outcome = runPoolEvent(currentPool, event, getServerNow());

    if (outcome.accepted) {
      await writePool(outcome.pool);
    }

    return outcome;
  });

  writeQueue = result.then(
    () => undefined,
    () => undefined
  );

  return result;
}

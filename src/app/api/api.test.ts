import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as getPool } from "./pool/route";
import { POST as postGuess } from "./guesses/route";
import { POST as loginAdmin } from "./admin/login/route";
import { POST as postPayment } from "./admin/payments/route";
import { seedPool } from "../../features/bolao/data/initialPool";

let originalDataFile: string | null = null;
const dataFilePath = join(process.cwd(), "data", "bolao-state.json");

function jsonRequest(url: string, body: unknown, cookie?: string) {
  return new NextRequest(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {})
    },
    body: JSON.stringify(body)
  });
}

describe("bolao api routes", () => {
  beforeEach(async () => {
    try {
      originalDataFile = await readFile(dataFilePath, "utf8");
    } catch {
      originalDataFile = null;
    }

    await rm(dataFilePath, { force: true });
    await mkdir(dirname(dataFilePath), { recursive: true });
    await writeFile(dataFilePath, JSON.stringify(seedPool, null, 2), "utf8");

    process.env.ADMIN_PIN = "2026";
    process.env.SESSION_SECRET = "test-session-secret";
    process.env.BOLAO_NOW = "2026-06-13T12:00:00-03:00";
  });

  afterEach(async () => {
    delete process.env.ADMIN_PIN;
    delete process.env.SESSION_SECRET;
    delete process.env.BOLAO_NOW;

    if (originalDataFile) {
      await mkdir(dirname(dataFilePath), { recursive: true });
      await writeFile(dataFilePath, originalDataFile, "utf8");
    } else {
      await rm(dataFilePath, { force: true });
    }
  });

  it("returns public pool state without login", async () => {
    const response = await getPool();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.pool.guesses).toHaveLength(8);
  });

  it("registers an apostador guess as pending", async () => {
    const response = await postGuess(
      jsonRequest("http://localhost/api/guesses", {
        participantName: "Lia",
        homeScore: 1,
        awayScore: 0
      })
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.accepted).toBe(true);
    expect(body.pool.guesses.at(-1)).toMatchObject({
      participantName: "Lia",
      paymentStatus: "pending"
    });
  });

  it("rejects admin payment updates without a session cookie", async () => {
    const response = await postPayment(
      jsonRequest("http://localhost/api/admin/payments", {
        guessId: "guess-003",
        paymentStatus: "paid"
      })
    );

    expect(response.status).toBe(401);
  });

  it("allows payment updates after PIN login", async () => {
    const loginResponse = await loginAdmin(
      jsonRequest("http://localhost/api/admin/login", {
        pin: "2026"
      })
    );
    const cookie = loginResponse.headers.get("set-cookie")?.split(";")[0];

    expect(loginResponse.status).toBe(200);
    expect(cookie).toContain("bolao_admin_session=");

    const paymentResponse = await postPayment(
      jsonRequest(
        "http://localhost/api/admin/payments",
        {
          guessId: "guess-003",
          paymentStatus: "paid"
        },
        cookie
      )
    );
    const body = await paymentResponse.json();

    expect(paymentResponse.status).toBe(200);
    expect(body.accepted).toBe(true);
    expect(body.pool.guesses.find((guess: { id: string }) => guess.id === "guess-003")).toMatchObject({
      paymentStatus: "paid"
    });
  });
});

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cloneInitialPool } from "../data/initialPool";
import { calculateLedger, calculatePrizeDistribution } from "../domain/rules";
import type { GuessDraft, PaymentStatus, Pool } from "../domain/types";

export interface ApiMessage {
  accepted: boolean;
  message: string;
}

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "same-origin",
    body: JSON.stringify(body)
  });

  return readJson<T>(response);
}

export function usePoolApi() {
  const [pool, setPool] = useState<Pool>(() => cloneInitialPool());
  const [serverNow, setServerNow] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState<ApiMessage | null>(null);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/pool", {
      cache: "no-store",
      credentials: "same-origin"
    });
    const data = await readJson<{ pool: Pool; serverNow: string }>(response);
    setPool(data.pool);
    setServerNow(data.serverNow);
    setLoaded(true);
    return data.pool;
  }, []);

  useEffect(() => {
    const refreshQuietly = () => {
      void refresh().catch(() => {
        setLoaded(true);
      });
    };

    refreshQuietly();
    const interval = window.setInterval(() => {
      refreshQuietly();
    }, 7000);

    return () => window.clearInterval(interval);
  }, [refresh]);

  async function registerGuess(draft: GuessDraft) {
    const outcome = await postJson<ApiMessage & { pool?: Pool }>("/api/guesses", draft);
    setMessage(outcome);

    if (outcome.pool) {
      setPool(outcome.pool);
    }

    return outcome;
  }

  async function login(pin: string) {
    const outcome = await postJson<ApiMessage>("/api/admin/login", { pin });
    setMessage(outcome);

    if (outcome.accepted) {
      await refresh();
    }

    return outcome;
  }

  async function setPayment(guessId: string, paymentStatus: PaymentStatus) {
    const outcome = await postJson<ApiMessage & { pool?: Pool }>("/api/admin/payments", {
      guessId,
      paymentStatus
    });
    setMessage(outcome);

    if (outcome.pool) {
      setPool(outcome.pool);
    }

    return outcome;
  }

  async function publishResult(homeScore: number, awayScore: number) {
    const outcome = await postJson<ApiMessage & { pool?: Pool }>("/api/admin/result", {
      homeScore,
      awayScore
    });
    setMessage(outcome);

    if (outcome.pool) {
      setPool(outcome.pool);
    }

    return outcome;
  }

  async function resetPool() {
    const outcome = await postJson<ApiMessage & { pool?: Pool }>("/api/admin/reset", {});
    setMessage(outcome);

    if (outcome.pool) {
      setPool(outcome.pool);
    }

    return outcome;
  }

  const ledger = useMemo(() => calculateLedger(pool), [pool]);
  const prizeDistribution = useMemo(() => calculatePrizeDistribution(pool), [pool]);
  const locked = useMemo(() => {
    const referenceDate = serverNow ? new Date(serverNow) : new Date();
    return referenceDate >= new Date(pool.rules.lockAt);
  }, [pool.rules.lockAt, serverNow]);

  return {
    ledger,
    loaded,
    locked,
    login,
    message,
    pool,
    prizeDistribution,
    publishResult,
    refresh,
    registerGuess,
    resetPool,
    setMessage,
    setPayment
  };
}

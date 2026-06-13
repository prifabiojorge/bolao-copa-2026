import { describe, expect, it } from "vitest";
import { cloneInitialPool } from "../data/initialPool";
import {
  calculateLedger,
  calculatePrizeDistribution,
  validateGuessDraft,
  calculatePrizeOutcome
} from "./rules";
import { runPoolEvent } from "./orchestrator";

describe("bolao rules", () => {
  it("calculates gross, organizer fee and prize from paid guesses", () => {
    const pool = cloneInitialPool();
    const ledger = calculateLedger(pool);

    expect(ledger.paidGuesses).toHaveLength(3);
    expect(ledger.pendingGuesses).toHaveLength(5);
    expect(ledger.grossCents).toBe(3000);
    expect(ledger.organizerFeeCents).toBe(600);
    expect(ledger.prizePoolCents).toBe(2400);
  });

  it("rejects more than two draw guesses for the same participant", () => {
    const pool = cloneInitialPool();
    pool.guesses.push(
      {
        id: "draw-1",
        order: 9,
        participantName: "Ana",
        homeScore: 1,
        awayScore: 1,
        paymentStatus: "pending",
        createdAt: "2026-06-13T10:00:00-03:00",
        updatedAt: "2026-06-13T10:00:00-03:00",
        source: "manual"
      },
      {
        id: "draw-2",
        order: 10,
        participantName: "ana",
        homeScore: 2,
        awayScore: 2,
        paymentStatus: "pending",
        createdAt: "2026-06-13T10:02:00-03:00",
        updatedAt: "2026-06-13T10:02:00-03:00",
        source: "manual"
      }
    );

    const result = validateGuessDraft(
      pool,
      {
        participantName: "Ana",
        homeScore: 0,
        awayScore: 0
      },
      new Date("2026-06-13T12:00:00-03:00")
    );

    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toContain("2 palpites de empate");
  });

  it("ignores pending guesses when distributing prizes", () => {
    const pool = cloneInitialPool();
    pool.officialResult = {
      homeScore: 2,
      awayScore: 1,
      publishedAt: "2026-06-13T21:00:00-03:00"
    };

    const distribution = calculatePrizeDistribution(pool);

    expect(distribution).toHaveLength(1);
    expect(distribution[0].guess.participantName).toBe("Ozeas");
    expect(distribution[0].amountCents).toBe(2400);
  });

  it("locks new guesses after the match deadline", () => {
    const pool = cloneInitialPool();

    const result = validateGuessDraft(
      pool,
      {
        participantName: "Lia",
        homeScore: 1,
        awayScore: 0
      },
      new Date("2026-06-13T19:00:01-03:00")
    );

    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toContain("fechado");
  });

  it("resets the pool through the orchestrator", () => {
    const pool = cloneInitialPool();
    pool.guesses = [];

    const outcome = runPoolEvent(
      pool,
      {
        type: "RESET_POOL",
        actor: "Teste"
      },
      new Date("2026-06-13T12:00:00-03:00")
    );

    expect(outcome.accepted).toBe(true);
    expect(outcome.pool.guesses).toHaveLength(8);
    expect(outcome.pool.auditLogs[0].action).toBe("Bolao restaurado");
  });

  describe("calculatePrizeOutcome", () => {
    it("returns awaiting_result if there is no official result yet", () => {
      const pool = cloneInitialPool();
      // Ensure no official result
      delete pool.officialResult;

      const outcome = calculatePrizeOutcome(pool);
      expect(outcome.scenario).toBe("awaiting_result");
      expect(outcome.winners).toHaveLength(0);
      expect(outcome.grossCents).toBe(3000); // 3 paid guesses * 1000
      expect(outcome.organizerCommissionCents).toBe(600); // 20% fee
      expect(outcome.prizePoolCents).toBe(2400);
      expect(outcome.unclaimedPrizeCents).toBe(0);
      expect(outcome.organizerTotalCents).toBe(600);
    });

    it("returns no_paid_guesses if there are no paid guesses in the pool", () => {
      const pool = cloneInitialPool();
      pool.guesses = pool.guesses.map(g => ({ ...g, paymentStatus: "pending" }));
      pool.officialResult = { homeScore: 2, awayScore: 1, publishedAt: "2026-06-13T21:00:00Z" };

      const outcome = calculatePrizeOutcome(pool);
      expect(outcome.scenario).toBe("no_paid_guesses");
      expect(outcome.winners).toHaveLength(0);
      expect(outcome.grossCents).toBe(0);
      expect(outcome.organizerTotalCents).toBe(0);
    });

    it("returns no_winners if no paid guess matches the official result", () => {
      const pool = cloneInitialPool();
      // Placar oficial is 5x5, which nobody guessed
      pool.officialResult = { homeScore: 5, awayScore: 5, publishedAt: "2026-06-13T21:00:00Z" };

      const outcome = calculatePrizeOutcome(pool);
      expect(outcome.scenario).toBe("no_winners");
      expect(outcome.winners).toHaveLength(0);
      expect(outcome.grossCents).toBe(3000);
      expect(outcome.organizerCommissionCents).toBe(600);
      expect(outcome.prizePoolCents).toBe(2400);
      expect(outcome.unclaimedPrizeCents).toBe(2400); // Unclaimed goes to bank
      expect(outcome.organizerTotalCents).toBe(3000); // Commission + Unclaimed
    });

    it("returns winners_found when one or more paid guesses match", () => {
      const pool = cloneInitialPool();
      // Placar is 2x1 (Ozeas has a paid guess of 2x1)
      pool.officialResult = { homeScore: 2, awayScore: 1, publishedAt: "2026-06-13T21:00:00Z" };

      const outcome = calculatePrizeOutcome(pool);
      expect(outcome.scenario).toBe("winners_found");
      expect(outcome.winners).toHaveLength(1);
      expect(outcome.winners[0].guess.participantName).toBe("Ozeas");
      expect(outcome.winners[0].amountCents).toBe(2400);
      expect(outcome.grossCents).toBe(3000);
      expect(outcome.organizerCommissionCents).toBe(600);
      expect(outcome.prizePoolCents).toBe(2400);
      expect(outcome.unclaimedPrizeCents).toBe(0);
      expect(outcome.organizerTotalCents).toBe(600);
    });
  });
});

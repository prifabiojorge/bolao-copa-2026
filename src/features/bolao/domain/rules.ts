import type { Guess, GuessDraft, Ledger, Pool, PrizeAllocation, PrizeOutcome } from "./types";

export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency"
});

export function formatCents(cents: number) {
  return currencyFormatter.format(cents / 100);
}

export function normalizeParticipantName(name: string) {
  return name
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR");
}

export function isDraw(score: Pick<Guess, "homeScore" | "awayScore">) {
  return score.homeScore === score.awayScore;
}

export function calculateLedger(pool: Pool): Ledger {
  const paidGuesses = pool.guesses.filter((guess) => guess.paymentStatus === "paid");
  const pendingGuesses = pool.guesses.filter((guess) => guess.paymentStatus === "pending");
  const grossCents = paidGuesses.length * pool.rules.stakeCents;
  const organizerFeeCents = Math.round(grossCents * pool.rules.organizerFeeRate);

  return {
    paidGuesses,
    pendingGuesses,
    grossCents,
    organizerFeeCents,
    prizePoolCents: grossCents - organizerFeeCents
  };
}

export function validateGuessDraft(pool: Pool, draft: GuessDraft, now = new Date()) {
  const errors: string[] = [];
  const lockAt = new Date(pool.rules.lockAt);
  const normalizedName = normalizeParticipantName(draft.participantName);

  if (now >= lockAt) {
    errors.push("O bolao ja foi fechado no horario definido.");
  }

  if (!normalizedName) {
    errors.push("Informe o nome do participante.");
  }

  if (!Number.isInteger(draft.homeScore) || draft.homeScore < 0 || draft.homeScore > 20) {
    errors.push("O placar do Brasil precisa ser um numero inteiro entre 0 e 20.");
  }

  if (!Number.isInteger(draft.awayScore) || draft.awayScore < 0 || draft.awayScore > 20) {
    errors.push("O placar do Marrocos precisa ser um numero inteiro entre 0 e 20.");
  }

  if (draft.homeScore === draft.awayScore && normalizedName) {
    const existingDraws = pool.guesses.filter(
      (guess) =>
        normalizeParticipantName(guess.participantName) === normalizedName && isDraw(guess)
    ).length;

    if (existingDraws >= pool.rules.maxDrawGuessesPerParticipant) {
      errors.push(
        `Este participante ja tem ${pool.rules.maxDrawGuessesPerParticipant} palpites de empate.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function getExactWinners(pool: Pool) {
  if (!pool.officialResult) {
    return [];
  }

  return pool.guesses.filter(
    (guess) =>
      guess.paymentStatus === "paid" &&
      guess.homeScore === pool.officialResult?.homeScore &&
      guess.awayScore === pool.officialResult?.awayScore
  );
}

export function calculatePrizeDistribution(pool: Pool): PrizeAllocation[] {
  const winners = getExactWinners(pool);

  if (winners.length === 0) {
    return [];
  }

  const ledger = calculateLedger(pool);
  const baseAmount = Math.floor(ledger.prizePoolCents / winners.length);
  const remainder = ledger.prizePoolCents % winners.length;

  return winners.map((guess, index) => ({
    guess,
    amountCents: baseAmount + (index < remainder ? 1 : 0)
  }));
}

export function calculatePrizeOutcome(pool: Pool): PrizeOutcome {
  const ledger = calculateLedger(pool);

  if (!pool.officialResult) {
    return {
      scenario: "awaiting_result",
      label: "Aguardando resultado oficial",
      winners: [],
      grossCents: ledger.grossCents,
      organizerCommissionCents: ledger.organizerFeeCents,
      prizePoolCents: ledger.prizePoolCents,
      unclaimedPrizeCents: 0,
      organizerTotalCents: ledger.organizerFeeCents
    };
  }

  if (ledger.paidGuesses.length === 0) {
    return {
      scenario: "no_paid_guesses",
      label: "Nenhum palpite pago registrado",
      winners: [],
      grossCents: 0,
      organizerCommissionCents: 0,
      prizePoolCents: 0,
      unclaimedPrizeCents: 0,
      organizerTotalCents: 0
    };
  }

  const winners = getExactWinners(pool);

  if (winners.length === 0) {
    return {
      scenario: "no_winners",
      label: "Acumulado! Ninguém acertou o placar oficial",
      winners: [],
      grossCents: ledger.grossCents,
      organizerCommissionCents: ledger.organizerFeeCents,
      prizePoolCents: ledger.prizePoolCents,
      unclaimedPrizeCents: ledger.prizePoolCents,
      organizerTotalCents: ledger.grossCents
    };
  }

  const baseAmount = Math.floor(ledger.prizePoolCents / winners.length);
  const remainder = ledger.prizePoolCents % winners.length;
  const allocations: PrizeAllocation[] = winners.map((guess, index) => ({
    guess,
    amountCents: baseAmount + (index < remainder ? 1 : 0)
  }));

  const label = winners.length === 1 
    ? "Ganhador encontrou o placar exato!" 
    : `${winners.length} ganhadores dividiram o prêmio!`;

  return {
    scenario: "winners_found",
    label,
    winners: allocations,
    grossCents: ledger.grossCents,
    organizerCommissionCents: ledger.organizerFeeCents,
    prizePoolCents: ledger.prizePoolCents,
    unclaimedPrizeCents: 0,
    organizerTotalCents: ledger.organizerFeeCents
  };
}

export function formatKickoff(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Fortaleza"
  }).format(new Date(isoDate));
}

export type PaymentStatus = "paid" | "pending";
export type GuessSource = "seed" | "manual";

export interface MatchInfo {
  homeTeam: "Brasil";
  awayTeam: "Marrocos";
  homeFlag: string;
  awayFlag: string;
  kickoffAt: string;
  timezone: "America/Fortaleza";
  venue: string;
}

export interface RuleSet {
  stakeCents: number;
  organizerFeeRate: number;
  maxDrawGuessesPerParticipant: number;
  lockAt: string;
  paidOnlyCompetes: boolean;
}

export interface Guess {
  id: string;
  order: number;
  participantName: string;
  homeScore: number;
  awayScore: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  source: GuessSource;
}

export interface OfficialResult {
  homeScore: number;
  awayScore: number;
  publishedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  summary: string;
}

export interface Pool {
  id: string;
  title: string;
  responsibleName: string;
  match: MatchInfo;
  rules: RuleSet;
  guesses: Guess[];
  auditLogs: AuditLog[];
  officialResult?: OfficialResult;
}

export interface GuessDraft {
  participantName: string;
  homeScore: number;
  awayScore: number;
}

export interface Ledger {
  paidGuesses: Guess[];
  pendingGuesses: Guess[];
  grossCents: number;
  organizerFeeCents: number;
  prizePoolCents: number;
}

export interface PrizeAllocation {
  guess: Guess;
  amountCents: number;
}

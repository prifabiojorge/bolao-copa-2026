import type { Pool } from "../domain/types";

const kickoffAt = "2026-06-13T19:00:00-03:00";

export const initialPool: Pool = {
  id: "bolao-brasil-marrocos-2026",
  title: "Bolao da Copa 2026 - Brasil x Marrocos",
  responsibleName: "Responsavel do bolao",
  match: {
    homeTeam: "Brasil",
    awayTeam: "Marrocos",
    homeFlag: "BRA",
    awayFlag: "MAR",
    kickoffAt,
    timezone: "America/Fortaleza",
    venue: "New York/New Jersey Stadium"
  },
  rules: {
    stakeCents: 1000,
    organizerFeeRate: 0.2,
    maxDrawGuessesPerParticipant: 2,
    lockAt: kickoffAt,
    paidOnlyCompetes: true
  },
  guesses: [
    {
      id: "guess-001",
      order: 1,
      participantName: "Yra",
      homeScore: 2,
      awayScore: 0,
      paymentStatus: "paid",
      createdAt: "2026-06-13T09:01:00-03:00",
      updatedAt: "2026-06-13T09:04:00-03:00",
      source: "seed"
    },
    {
      id: "guess-002",
      order: 2,
      participantName: "Ozeas",
      homeScore: 2,
      awayScore: 1,
      paymentStatus: "paid",
      createdAt: "2026-06-13T09:06:00-03:00",
      updatedAt: "2026-06-13T09:08:00-03:00",
      source: "seed"
    },
    {
      id: "guess-003",
      order: 3,
      participantName: "Paulo",
      homeScore: 2,
      awayScore: 1,
      paymentStatus: "pending",
      createdAt: "2026-06-13T09:11:00-03:00",
      updatedAt: "2026-06-13T09:11:00-03:00",
      source: "seed"
    },
    {
      id: "guess-004",
      order: 4,
      participantName: "Claudio",
      homeScore: 3,
      awayScore: 1,
      paymentStatus: "pending",
      createdAt: "2026-06-13T09:18:00-03:00",
      updatedAt: "2026-06-13T09:18:00-03:00",
      source: "seed"
    },
    {
      id: "guess-005",
      order: 5,
      participantName: "Sergio",
      homeScore: 2,
      awayScore: 0,
      paymentStatus: "pending",
      createdAt: "2026-06-13T09:24:00-03:00",
      updatedAt: "2026-06-13T09:24:00-03:00",
      source: "seed"
    },
    {
      id: "guess-006",
      order: 6,
      participantName: "Saba",
      homeScore: 3,
      awayScore: 0,
      paymentStatus: "pending",
      createdAt: "2026-06-13T09:32:00-03:00",
      updatedAt: "2026-06-13T09:32:00-03:00",
      source: "seed"
    },
    {
      id: "guess-007",
      order: 7,
      participantName: "Veronica",
      homeScore: 4,
      awayScore: 2,
      paymentStatus: "pending",
      createdAt: "2026-06-13T09:40:00-03:00",
      updatedAt: "2026-06-13T09:40:00-03:00",
      source: "seed"
    },
    {
      id: "guess-008",
      order: 8,
      participantName: "Clodo",
      homeScore: 3,
      awayScore: 0,
      paymentStatus: "paid",
      createdAt: "2026-06-13T09:48:00-03:00",
      updatedAt: "2026-06-13T09:53:00-03:00",
      source: "seed"
    }
  ],
  auditLogs: [
    {
      id: "audit-seed-003",
      timestamp: "2026-06-13T09:53:00-03:00",
      actor: "Importacao inicial",
      action: "Pagamento confirmado",
      summary: "Clodo marcado como pago."
    },
    {
      id: "audit-seed-002",
      timestamp: "2026-06-13T09:08:00-03:00",
      actor: "Importacao inicial",
      action: "Pagamento confirmado",
      summary: "Ozeas marcado como pago."
    },
    {
      id: "audit-seed-001",
      timestamp: "2026-06-13T09:04:00-03:00",
      actor: "Importacao inicial",
      action: "Pagamento confirmado",
      summary: "Yra marcado como pago."
    }
  ]
};

export function cloneInitialPool() {
  return JSON.parse(JSON.stringify(initialPool)) as Pool;
}

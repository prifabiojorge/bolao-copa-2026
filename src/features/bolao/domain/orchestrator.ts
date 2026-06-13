import type { AuditLog, Guess, GuessDraft, PaymentStatus, Pool } from "./types";
import { cloneInitialPool } from "../data/initialPool";
import { validateGuessDraft } from "./rules";

type RegisterGuessEvent = {
  type: "REGISTER_GUESS";
  actor: string;
  payload: GuessDraft;
};

type SetPaymentEvent = {
  type: "SET_PAYMENT";
  actor: string;
  payload: {
    guessId: string;
    paymentStatus: PaymentStatus;
  };
};

type PublishResultEvent = {
  type: "PUBLISH_RESULT";
  actor: string;
  payload: {
    homeScore: number;
    awayScore: number;
  };
};

type ResetPoolEvent = {
  type: "RESET_POOL";
  actor: string;
};

export type OrchestratorEvent =
  | RegisterGuessEvent
  | SetPaymentEvent
  | PublishResultEvent
  | ResetPoolEvent;

export interface OrchestratorOutcome {
  accepted: boolean;
  message: string;
  pool: Pool;
}

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function audit(actor: string, action: string, summary: string, timestamp: string): AuditLog {
  return {
    id: createId("audit"),
    timestamp,
    actor,
    action,
    summary
  };
}

function appendAudit(pool: Pool, entry: AuditLog): Pool {
  return {
    ...pool,
    auditLogs: [entry, ...pool.auditLogs].slice(0, 80)
  };
}

export function runPoolEvent(
  pool: Pool,
  event: OrchestratorEvent,
  now = new Date()
): OrchestratorOutcome {
  const timestamp = now.toISOString();

  if (event.type === "RESET_POOL") {
    const nextPool = appendAudit(
      cloneInitialPool(),
      audit(
        event.actor,
        "Bolao restaurado",
        "Dados restaurados para a lista inicial informada pelo responsavel.",
        timestamp
      )
    );

    return {
      accepted: true,
      message: "Bolao restaurado para os dados iniciais.",
      pool: nextPool
    };
  }

  if (event.type === "REGISTER_GUESS") {
    const validation = validateGuessDraft(pool, event.payload, now);

    if (!validation.valid) {
      return {
        accepted: false,
        message: validation.errors.join(" "),
        pool
      };
    }

    const nextOrder = Math.max(0, ...pool.guesses.map((guess) => guess.order)) + 1;
    const guess: Guess = {
      id: createId("guess"),
      order: nextOrder,
      participantName: event.payload.participantName.trim(),
      homeScore: event.payload.homeScore,
      awayScore: event.payload.awayScore,
      paymentStatus: "pending",
      createdAt: timestamp,
      updatedAt: timestamp,
      source: "manual"
    };

    const nextPool: Pool = {
      ...pool,
      guesses: [...pool.guesses, guess]
    };

    return {
      accepted: true,
      message: "Palpite registrado como pendente de pagamento.",
      pool: appendAudit(
        nextPool,
        audit(
          event.actor,
          "Palpite registrado",
          `${guess.participantName}: Brasil ${guess.homeScore} x ${guess.awayScore} Marrocos`,
          timestamp
        )
      )
    };
  }

  if (event.type === "SET_PAYMENT") {
    const target = pool.guesses.find((guess) => guess.id === event.payload.guessId);

    if (!target) {
      return {
        accepted: false,
        message: "Palpite nao encontrado.",
        pool
      };
    }

    const guesses = pool.guesses.map((guess) =>
      guess.id === event.payload.guessId
        ? {
            ...guess,
            paymentStatus: event.payload.paymentStatus,
            updatedAt: timestamp
          }
        : guess
    );

    const nextPool = appendAudit(
      {
        ...pool,
        guesses
      },
      audit(
        event.actor,
        event.payload.paymentStatus === "paid" ? "Pagamento confirmado" : "Pagamento reaberto",
        `${target.participantName}: status alterado para ${event.payload.paymentStatus}.`,
        timestamp
      )
    );

    return {
      accepted: true,
      message:
        event.payload.paymentStatus === "paid"
          ? "Pagamento confirmado e incluido no premio."
          : "Pagamento voltou para pendente.",
      pool: nextPool
    };
  }

  const resultErrors: string[] = [];

  if (!Number.isInteger(event.payload.homeScore) || event.payload.homeScore < 0) {
    resultErrors.push("Resultado do Brasil invalido.");
  }

  if (!Number.isInteger(event.payload.awayScore) || event.payload.awayScore < 0) {
    resultErrors.push("Resultado do Marrocos invalido.");
  }

  if (resultErrors.length > 0) {
    return {
      accepted: false,
      message: resultErrors.join(" "),
      pool
    };
  }

  const nextPool = appendAudit(
    {
      ...pool,
      officialResult: {
        homeScore: event.payload.homeScore,
        awayScore: event.payload.awayScore,
        publishedAt: timestamp
      }
    },
    audit(
      event.actor,
      "Resultado publicado",
      `Resultado oficial: Brasil ${event.payload.homeScore} x ${event.payload.awayScore} Marrocos.`,
      timestamp
    )
  );

  return {
    accepted: true,
    message: "Resultado publicado e ranking recalculado.",
    pool: nextPool
  };
}

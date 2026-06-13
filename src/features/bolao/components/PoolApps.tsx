"use client";

import {
  Activity,
  AlertTriangle,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Copy,
  Download,
  Eye,
  FileJson,
  GitBranch,
  Landmark,
  Link as LinkIcon,
  LockKeyhole,
  ReceiptText,
  RotateCcw,
  Save,
  ShieldCheck,
  Trophy,
  Unlock,
  UserPlus,
  Award,
  TrendingUp,
  UserCheck,
  Coins,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { harnessArchitecture } from "../domain/architect";
import { formatCents, formatKickoff } from "../domain/rules";
import type { ApiMessage } from "../hooks/usePoolApi";
import { usePoolApi } from "../hooks/usePoolApi";
import type { Guess, Pool } from "../domain/types";

function downloadTextFile(fileName: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function poolToCsv(pool: Pool) {
  const header = ["ordem", "nome", "brasil", "marrocos", "pagamento", "criado_em"];
  const rows = pool.guesses.map((guess) => [
    guess.order,
    guess.participantName,
    guess.homeScore,
    guess.awayScore,
    guess.paymentStatus === "paid" ? "pago" : "pendente",
    guess.createdAt
  ]);

  return [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

function useVisualViewportWidth() {
  useEffect(() => {
    const syncVisualWidth = () => {
      const width = window.visualViewport?.width ?? window.innerWidth;
      document.documentElement.style.setProperty("--visual-width", `${Math.floor(width)}px`);
    };

    syncVisualWidth();
    window.addEventListener("resize", syncVisualWidth);
    window.visualViewport?.addEventListener("resize", syncVisualWidth);

    return () => {
      window.removeEventListener("resize", syncVisualWidth);
      window.visualViewport?.removeEventListener("resize", syncVisualWidth);
    };
  }, []);
}

function Topbar({ mode }: { mode: "admin" | "apostador" }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <div className="brand-mark">BC</div>
          <div>
            <p className="brand-title">Bolao da Copa 2026</p>
            <p className="brand-subtitle">
              {mode === "admin" ? "Ambiente do administrador" : "Ambiente do apostador"}
            </p>
          </div>
        </div>
        {mode === "admin" ? (
          <nav className="topbar-actions" aria-label="Ambientes">
            <Link className="nav-link" href="/apostador">
              Apostador
            </Link>
            <Link className="nav-link active" href="/admin">
              Admin
            </Link>
          </nav>
        ) : null}
      </div>
    </header>
  );
}

function MessageBox({ message }: { message: ApiMessage | null }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`message ${message.accepted ? "ok" : "bad"}`}>
      {message.accepted ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />} {message.message}
    </div>
  );
}

function StatCard({
  icon,
  label,
  note,
  value
}: {
  icon: React.ReactNode;
  label: string;
  note: string;
  value: string;
}) {
  return (
    <section className="stat">
      <div className="stat-icon">{icon}</div>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      <div className="stat-note">{note}</div>
    </section>
  );
}

function PaymentChip({ guess }: { guess: Guess }) {
  const paid = guess.paymentStatus === "paid";

  return (
    <span className={`payment-chip ${paid ? "paid" : "pending"}`}>
      {paid ? <CheckCircle2 size={15} /> : <Clock3 size={15} />}
      {paid ? "Pago" : "Pendente"}
    </span>
  );
}

function MatchHero({ pool }: { pool: Pool }) {
  return (
    <div className="match-hero">
      <div className="match-copy">
        <div>
          <span className="eyebrow">
            <ShieldCheck size={16} />
            Regras claras antes do jogo
          </span>
          <h1 className="match-title">
            <span className="country-tag">BRA</span> {pool.match.homeTeam}{" "}
            <span className="versus">x</span> {pool.match.awayTeam}{" "}
            <span className="country-tag">MAR</span>
          </h1>
          <p className="match-meta">
            {formatKickoff(pool.match.kickoffAt)}. Cada palpite custa{" "}
            {formatCents(pool.rules.stakeCents)}; o responsavel recebe 20% e o premio liquido fica
            com os ganhadores pagos.
          </p>
        </div>
        <div className="rules-strip" aria-label="Regras principais">
          <span className="rule-pill">
            <ReceiptText size={15} />
            {formatCents(pool.rules.stakeCents)} por palpite
          </span>
          <span className="rule-pill">
            <Calculator size={15} />
            80% premio
          </span>
          <span className="rule-pill">
            <ClipboardCheck size={15} />
            Max. 2 empates
          </span>
        </div>
      </div>
      <div className="match-art" aria-hidden="true">
        <img src="/bolao-field.png" alt="" />
      </div>
    </div>
  );
}

function FinancialSummary({
  ledger,
  pool
}: {
  ledger: ReturnType<typeof usePoolApi>["ledger"];
  pool: Pool;
}) {
  return (
    <section className="ledger-grid" aria-label="Resumo financeiro">
      <StatCard
        icon={<ReceiptText size={20} />}
        label="Arrecadado"
        note={`${ledger.paidGuesses.length} palpites pagos`}
        value={formatCents(ledger.grossCents)}
      />
      <StatCard
        icon={<Landmark size={20} />}
        label="Responsavel"
        note="Comissao de 20%"
        value={formatCents(ledger.organizerFeeCents)}
      />
      <StatCard
        icon={<Trophy size={20} />}
        label="Premio liquido"
        note="Distribuido aos ganhadores pagos"
        value={formatCents(ledger.prizePoolCents)}
      />
      <StatCard
        icon={<Eye size={20} />}
        label="Transparencia"
        note={`${ledger.pendingGuesses.length} pendentes em aberto`}
        value={`${pool.auditLogs.length} logs`}
      />
    </section>
  );
}

function PrizeOutcomePanel({
  pool,
  prizeOutcome
}: {
  pool: Pool;
  prizeOutcome: ReturnType<typeof usePoolApi>["prizeOutcome"];
}) {
  const { scenario, label, winners, grossCents, organizerCommissionCents, prizePoolCents, unclaimedPrizeCents, organizerTotalCents } = prizeOutcome;

  if (scenario === "no_paid_guesses") {
    return (
      <div className="prize-outcome-panel">
        <div className="prize-outcome-header no-paid">
          <span className="prize-badge">
            <AlertCircle size={14} /> Sem Palpites Pagos
          </span>
          <h3 className="prize-outcome-title">{label}</h3>
          <p className="prize-outcome-subtitle">
            Nenhum palpite com pagamento confirmado participa da divisão.
          </p>
        </div>
      </div>
    );
  }

  if (scenario === "awaiting_result") {
    return (
      <div className="prize-outcome-panel">
        <div className="prize-outcome-header projected">
          <span className="prize-badge">
            <TrendingUp size={14} /> Projeção de Premiação
          </span>
          <h3 className="prize-outcome-title">Guia de Premiação</h3>
          <p className="prize-outcome-subtitle">
            Veja abaixo como o prêmio será distribuído após a publicação do resultado oficial.
          </p>
        </div>
        <div className="prize-grid">
          <div className="prize-outcome-main">
            <div className="projection-scenario-box">
              <h4 className="projection-scenario-title">Cenário A: Com Ganhadores</h4>
              <p className="projection-scenario-desc">
                Se um ou mais participantes acertarem o placar oficial, o prêmio líquido total será dividido igualmente entre eles.
              </p>
              <div className="projection-value">
                Rateio de {formatCents(prizePoolCents)} dividido entre os acertadores.
              </div>
            </div>
            <div className="projection-scenario-box accumulated">
              <h4 className="projection-scenario-title">Cenário B: Acumulado (Ninguém acertou)</h4>
              <p className="projection-scenario-desc">
                Caso nenhum participante acertar o placar oficial, o prêmio líquido vai para a Banca (organizador) para cobrir custos e acúmulo.
              </p>
              <div className="projection-value bank-value">
                Banca recebe o prêmio de {formatCents(prizePoolCents)} + comissão de {formatCents(organizerCommissionCents)}.
              </div>
            </div>
          </div>
          <div className="prize-outcome-details">
            <h3>Detalhes Financeiros</h3>
            <div className="prize-detail-row">
              <span>Arrecadação Bruta:</span>
              <span className="value">{formatCents(grossCents)}</span>
            </div>
            <div className="prize-detail-row">
              <span>Taxa da Banca (20%):</span>
              <span className="value">{formatCents(organizerCommissionCents)}</span>
            </div>
            <div className="prize-detail-row total">
              <span>Prêmio Líquido (80%):</span>
              <span className="value">{formatCents(prizePoolCents)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (scenario === "no_winners") {
    return (
      <div className="prize-outcome-panel">
        <div className="prize-outcome-header accumulated">
          <span className="prize-badge">
            <Landmark size={14} /> Bolão Acumulado
          </span>
          <h3 className="prize-outcome-title">{label}</h3>
          <p className="prize-outcome-subtitle">
            Placar oficial: Brasil {pool.officialResult?.homeScore} x {pool.officialResult?.awayScore} Marrocos. Nenhum palpite acertou em cheio.
          </p>
        </div>
        <div className="prize-grid">
          <div className="prize-outcome-main">
            <div className="projection-scenario-box accumulated">
              <h4 className="projection-scenario-title">Prêmio Destinado à Banca</h4>
              <p className="projection-scenario-desc">
                Como ninguém acertou o placar oficial, os {formatCents(unclaimedPrizeCents)} do prêmio líquido acumulado foram destinados ao organizador do bolão.
              </p>
            </div>
          </div>
          <div className="prize-outcome-details">
            <h3>Resultado Financeiro</h3>
            <div className="prize-detail-row">
              <span>Arrecadação Total:</span>
              <span className="value">{formatCents(grossCents)}</span>
            </div>
            <div className="prize-detail-row">
              <span>Comissão Operacional (20%):</span>
              <span className="value">{formatCents(organizerCommissionCents)}</span>
            </div>
            <div className="prize-detail-row">
              <span>Prêmio acumulado:</span>
              <span className="value">{formatCents(unclaimedPrizeCents)}</span>
            </div>
            <div className="prize-detail-row total accumulated-total">
              <span>Total para a Banca:</span>
              <span className="value">{formatCents(organizerTotalCents)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // scenario === "winners_found"
  return (
    <div className="prize-outcome-panel">
      <div className="prize-outcome-header">
        <span className="prize-badge">
          <Trophy size={14} /> Ganhadores Encontrados!
        </span>
        <h3 className="prize-outcome-title">{label}</h3>
        <p className="prize-outcome-subtitle">
          Placar oficial: Brasil {pool.officialResult?.homeScore} x {pool.officialResult?.awayScore} Marrocos.
        </p>
      </div>
      <div className="prize-grid">
        <div className="prize-outcome-main">
          <h3>Lista de Acertadores</h3>
          <div className="winners-card-list">
            {winners.map((allocation) => (
              <div className="winner-card" key={allocation.guess.id}>
                <div className="winner-info">
                  <span className="winner-name">{allocation.guess.participantName}</span>
                  <span className="winner-guess-tag">
                    Palpite: Brasil {allocation.guess.homeScore} x {allocation.guess.awayScore} Marrocos
                  </span>
                </div>
                <div className="winner-prize-amount">
                  {formatCents(allocation.amountCents)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="prize-outcome-details">
          <h3>Partilha do Prêmio</h3>
          <div className="prize-detail-row">
            <span>Arrecadação Bruta:</span>
            <span className="value">{formatCents(grossCents)}</span>
          </div>
          <div className="prize-detail-row">
            <span>Taxa do Responsável (20%):</span>
            <span className="value">{formatCents(organizerCommissionCents)}</span>
          </div>
          <div className="prize-detail-row total">
            <span>Total Distribuído:</span>
            <span className="value">{formatCents(prizePoolCents)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPanel({
  loaded,
  locked,
  paidCount,
  totalCount
}: {
  loaded: boolean;
  locked: boolean;
  paidCount: number;
  totalCount: number;
}) {
  const paidPercent = totalCount ? Math.round((paidCount / totalCount) * 100) : 0;

  return (
    <aside className="status-panel">
      <div>
        <div className="status-row">
          <div>
            <h2>Status do bolao</h2>
            <p>{loaded ? "Estado sincronizado pelo servidor." : "Carregando..."}</p>
          </div>
          <span className={`status-badge ${locked ? "locked" : "open"}`}>
            {locked ? <LockKeyhole size={16} /> : <Unlock size={16} />}
            {locked ? "Fechado para novos palpites" : "Aberto para palpites"}
          </span>
        </div>
      </div>
      <p>
        {paidCount} de {totalCount} palpites pagos ({paidPercent}%). Pendentes ficam visiveis para
        auditoria, mas nao entram no premio.
      </p>
    </aside>
  );
}

function GuessForm({
  locked,
  onSubmit
}: {
  locked: boolean;
  onSubmit: (draft: { participantName: string; homeScore: number; awayScore: number }) => Promise<ApiMessage>;
}) {
  const [participantName, setParticipantName] = useState("");
  const [homeScore, setHomeScore] = useState("2");
  const [awayScore, setAwayScore] = useState("1");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const outcome = await onSubmit({
      participantName,
      homeScore: Number(homeScore),
      awayScore: Number(awayScore)
    });

    if (outcome.accepted) {
      setParticipantName("");
      setHomeScore("2");
      setAwayScore("1");
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="step-grid">
        <span className="step-badge">1</span>
        <div className="field">
          <label htmlFor="participantName">Nome</label>
          <input
            disabled={locked}
            id="participantName"
            placeholder="Ex.: Maria"
            value={participantName}
            onChange={(event) => setParticipantName(event.target.value)}
          />
        </div>
      </div>
      <div className="step-grid">
        <span className="step-badge">2</span>
        <div className="score-inputs">
          <div className="field">
            <label htmlFor="homeScore">Brasil</label>
            <input
              disabled={locked}
              id="homeScore"
              inputMode="numeric"
              max="20"
              min="0"
              type="number"
              value={homeScore}
              onChange={(event) => setHomeScore(event.target.value)}
            />
          </div>
          <span className="score-x">x</span>
          <div className="field">
            <label htmlFor="awayScore">Marrocos</label>
            <input
              disabled={locked}
              id="awayScore"
              inputMode="numeric"
              max="20"
              min="0"
              type="number"
              value={awayScore}
              onChange={(event) => setAwayScore(event.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="step-grid">
        <span className="step-badge">3</span>
        <button className="button primary" disabled={locked} title="Registrar novo palpite" type="submit">
          <UserPlus size={17} />
          Confirmar palpite
        </button>
      </div>
    </form>
  );
}

function MiniFlag({ country }: { country: "br" | "ma" }) {
  if (country === "br") {
    return (
      <span className="mini-flag br" role="img" aria-label="Bandeira do Brasil">
        <span className="mini-flag-br-diamond" aria-hidden="true" />
        <span className="mini-flag-br-circle" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className="mini-flag ma" role="img" aria-label="Bandeira de Marrocos">
      <span className="mini-flag-ma-star" aria-hidden="true" />
    </span>
  );
}

function PublicGuessList({ guesses }: { guesses: Guess[] }) {
  return (
    <div className="public-list">
      {guesses
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((guess) => (
          <article className="guess-card" key={guess.id}>
            <span className="guess-order">{guess.order}</span>
            <strong>{guess.participantName}</strong>
            <span className="score-cell">
              <span className="team-label">
                <MiniFlag country="br" />
                Brasil
              </span>
              <span className="score-numbers">
                {guess.homeScore} x {guess.awayScore}
              </span>
              <span className="team-label">
                Marrocos
                <MiniFlag country="ma" />
              </span>
            </span>
            <PaymentChip guess={guess} />
          </article>
        ))}
    </div>
  );
}

function HarnessPanel() {
  return (
    <section className="harness-grid" aria-label="Agente harness">
      <article className="agent-panel">
        <h3>
          <Activity size={18} />
          {harnessArchitecture.orchestrator.title}
        </h3>
        <p className="empty-state">{harnessArchitecture.orchestrator.summary}</p>
        <ul>
          {harnessArchitecture.orchestrator.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
      <article className="agent-panel">
        <h3>
          <GitBranch size={18} />
          {harnessArchitecture.architect.title}
        </h3>
        <p className="empty-state">{harnessArchitecture.architect.summary}</p>
        <ul>
          {harnessArchitecture.architect.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}

export function ApostadorApp() {
  useVisualViewportWidth();
  const { ledger, loaded, locked, message, pool, prizeOutcome, registerGuess } = usePoolApi();

  return (
    <main className="app-shell">
      <Topbar mode="apostador" />
      <div className="shell-content">
        <section className="match-board">
          <MatchHero pool={pool} />
          <StatusPanel
            loaded={loaded}
            locked={locked}
            paidCount={ledger.paidGuesses.length}
            totalCount={pool.guesses.length}
          />
        </section>
        <FinancialSummary ledger={ledger} pool={pool} />
        <PrizeOutcomePanel pool={pool} prizeOutcome={prizeOutcome} />
        <section className="public-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>Enviar palpite</h2>
                <p>Preencha, confira o placar e envie. O pagamento sera confirmado pelo responsavel.</p>
              </div>
            </div>
            <GuessForm locked={locked} onSubmit={registerGuess} />
            <div className="form-grid form-feedback">
              <MessageBox
                message={
                  message?.accepted && message.message.includes("pendente")
                    ? { accepted: true, message: "Palpite recebido, pagamento pendente." }
                    : message
                }
              />
            </div>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>Lista publica</h2>
                <p>Todos acompanham os palpites e quais ja estao pagos.</p>
              </div>
            </div>
            <PublicGuessList guesses={pool.guesses} />
          </div>
        </section>
      </div>
    </main>
  );
}

function AdminLogin({
  onLogin,
  message
}: {
  onLogin: (pin: string) => Promise<ApiMessage>;
  message: ApiMessage | null;
}) {
  const [pin, setPin] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onLogin(pin);
  }

  return (
    <main className="app-shell">
      <Topbar mode="admin" />
      <div className="shell-content login-layout">
        <section className="login-card">
          <span className="eyebrow">
            <LockKeyhole size={16} />
            Acesso protegido
          </span>
          <h1>Painel do administrador</h1>
          <p>Entre com o PIN para confirmar pagamentos, publicar resultado e restaurar o bolao.</p>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="adminPin">PIN</label>
              <input
                autoComplete="one-time-code"
                id="adminPin"
                inputMode="numeric"
                placeholder="2026"
                type="password"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
              />
            </div>
            <button className="button primary" type="submit">
              <LockKeyhole size={17} />
              Entrar
            </button>
            <MessageBox message={message} />
          </form>
        </section>
      </div>
    </main>
  );
}

function AdminGuessTable({
  guesses,
  onSetPayment
}: {
  guesses: Guess[];
  onSetPayment: (guessId: string, paymentStatus: Guess["paymentStatus"]) => Promise<ApiMessage>;
}) {
  const sortedGuesses = useMemo(
    () =>
      guesses
        .slice()
        .sort((a, b) => {
          if (a.paymentStatus !== b.paymentStatus) {
            return a.paymentStatus === "pending" ? -1 : 1;
          }

          return a.order - b.order;
        }),
    [guesses]
  );

  return (
    <div className="admin-list">
      {sortedGuesses.map((guess) => (
        <article className="admin-guess-row" key={guess.id}>
          <div>
            <span className="guess-order">#{guess.order}</span>
            <strong>{guess.participantName}</strong>
            <span className="score-cell">
              Brasil {guess.homeScore} x {guess.awayScore} Marrocos
            </span>
          </div>
          <PaymentChip guess={guess} />
          <button
            className={`button ${guess.paymentStatus === "paid" ? "warning" : "primary"}`}
            type="button"
            onClick={() =>
              onSetPayment(guess.id, guess.paymentStatus === "paid" ? "pending" : "paid")
            }
          >
            {guess.paymentStatus === "paid" ? <Clock3 size={16} /> : <CheckCircle2 size={16} />}
            {guess.paymentStatus === "paid" ? "Reabrir" : "Confirmar pago"}
          </button>
        </article>
      ))}
    </div>
  );
}

function AdminTools({
  pool,
  onReset
}: {
  pool: Pool;
  onReset: () => Promise<ApiMessage>;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const link = `${window.location.origin}/apostador`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="compact-actions">
      <button
        className="button secondary"
        type="button"
        onClick={() => downloadTextFile("bolao-brasil-marrocos.csv", `\uFEFF${poolToCsv(pool)}`, "text/csv")}
      >
        <Download size={17} />
        CSV
      </button>
      <button
        className="button secondary"
        type="button"
        onClick={() =>
          downloadTextFile("bolao-brasil-marrocos.json", JSON.stringify(pool, null, 2), "application/json")
        }
      >
        <FileJson size={17} />
        JSON
      </button>
      <button className="button secondary" type="button" onClick={copyLink}>
        <Copy size={17} />
        {copied ? "Copiado" : "Link apostador"}
      </button>
      <button className="button danger" type="button" onClick={onReset}>
        <RotateCcw size={17} />
        Restaurar
      </button>
    </div>
  );
}

function ResultPanel({
  pool,
  prizeOutcome,
  onPublish
}: {
  pool: Pool;
  prizeOutcome: ReturnType<typeof usePoolApi>["prizeOutcome"];
  onPublish: (homeScore: number, awayScore: number) => Promise<ApiMessage>;
}) {
  const [homeScore, setHomeScore] = useState("2");
  const [awayScore, setAwayScore] = useState("1");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onPublish(Number(homeScore), Number(awayScore));
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2>Resultado oficial</h2>
          <p>Publique o placar oficial do jogo para calcular a divisão final de prêmios.</p>
        </div>
      </div>
      <form className="result-box" onSubmit={handleSubmit}>
        <div className="score-inputs">
          <div className="field">
            <label htmlFor="resultHomeScore">Brasil</label>
            <input
              id="resultHomeScore"
              inputMode="numeric"
              min="0"
              type="number"
              value={homeScore}
              onChange={(event) => setHomeScore(event.target.value)}
            />
          </div>
          <span className="score-x">x</span>
          <div className="field">
            <label htmlFor="resultAwayScore">Marrocos</label>
            <input
              id="resultAwayScore"
              inputMode="numeric"
              min="0"
              type="number"
              value={awayScore}
              onChange={(event) => setAwayScore(event.target.value)}
            />
          </div>
        </div>
        <button className="button primary" type="submit">
          <Save size={17} />
          Publicar resultado
        </button>
      </form>
      <div style={{ padding: "0 18px 18px" }}>
        <PrizeOutcomePanel pool={pool} prizeOutcome={prizeOutcome} />
      </div>
    </div>
  );
}

function AuditPanel({ pool }: { pool: Pool }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2>Auditoria</h2>
          <p>Historico visivel para reduzir duvidas e combinados paralelos.</p>
        </div>
      </div>
      <div className="audit-list">
        {pool.auditLogs.map((log) => (
          <div className="audit-item" key={log.id}>
            <strong>{log.action}</strong>
            <span>{log.summary}</span>
            <span>
              {log.actor} -{" "}
              {new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "medium",
                timeZone: "America/Fortaleza"
              }).format(new Date(log.timestamp))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminApp() {
  useVisualViewportWidth();
  const {
    ledger,
    loaded,
    locked,
    login,
    message,
    pool,
    prizeOutcome,
    publishResult,
    resetPool,
    setPayment
  } = usePoolApi();
  const [authenticated, setAuthenticated] = useState(false);

  async function handleLogin(pin: string) {
    const outcome = await login(pin);
    if (outcome.accepted) {
      setAuthenticated(true);
    }
    return outcome;
  }

  if (!authenticated) {
    return <AdminLogin message={message} onLogin={handleLogin} />;
  }

  return (
    <main className="app-shell">
      <Topbar mode="admin" />
      <div className="shell-content">
        <section className="match-board">
          <MatchHero pool={pool} />
          <StatusPanel
            loaded={loaded}
            locked={locked}
            paidCount={ledger.paidGuesses.length}
            totalCount={pool.guesses.length}
          />
        </section>
        <FinancialSummary ledger={ledger} pool={pool} />
        <section className="admin-tools-row">
          <AdminTools pool={pool} onReset={resetPool} />
          <MessageBox message={message} />
        </section>
        <section className="admin-layout">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>Pagamentos</h2>
                <p>Pendentes aparecem primeiro para acelerar a rotina do responsavel.</p>
              </div>
            </div>
            <AdminGuessTable guesses={pool.guesses} onSetPayment={setPayment} />
          </div>
          <div className="section-stack">
            <ResultPanel pool={pool} prizeOutcome={prizeOutcome} onPublish={publishResult} />
            <AuditPanel pool={pool} />
          </div>
        </section>
        <HarnessPanel />
        <div className="copy-row">
          <LinkIcon size={16} />
          Link publico: <Link href="/apostador">/apostador</Link>
        </div>
      </div>
    </main>
  );
}

# Bolao da Copa 2026

Micro-SaaS para administrar o bolao Escocia x Brasil, em 24/06/2026 as 19:00, com foco em transparencia e confiabilidade.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

Rotas principais:

- Apostador: `http://localhost:3000/apostador`
- Administrador: `http://localhost:3000/admin`

PIN local padrao do administrador: `2026`.

Copie `.env.example` para `.env.local` para trocar `ADMIN_PIN`, `SESSION_SECRET` e, se desejar, configurar Supabase.

## Validar

```bash
npm run typecheck
npm test
npm run build
```

## Regras implementadas

- R$ 10,00 por palpite.
- Maximo de 2 empates por participante.
- Responsavel recebe 20% do total pago.
- Premio liquido fica em 80% do total pago.
- Apenas palpites pagos competem.
- Palpites sao bloqueados a partir de 24/06/2026 as 19:00, America/Fortaleza.
- Auditoria visivel registra mudancas operacionais.
- Estado sincronizado via Supabase opcional ou arquivo local `data/bolao-state.json`.
- Acoes administrativas protegidas por PIN e cookie HttpOnly.
- Se nao houver ganhador pago por placar exato, o premio liquido fica acumulado para a banca/organizador.

## Nota legal

Este MVP e uma ferramenta de gestao de bolao privado. Nao implementa odds, cota fixa, operacao nacional de apostas, carteira financeira nem publicidade de apostas.

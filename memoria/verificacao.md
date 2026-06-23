# Verificacoes do Projeto

Data local da verificacao: 13/06/2026.

## Revisao de Endosso

Data local da revisao: 23/06/2026.

- `npm run typecheck` passou.
- `npm audit --omit=dev` retornou 0 vulnerabilidades.
- `npm run build` passou quando executado com `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` vazios.
- `npm test` falhou sem relatorio detalhado do Vitest. A falha tambem ocorreu ao rodar arquivos de teste isolados. Tratar como pendencia de runner/ambiente ate nova investigacao.
- Conferido que a memoria foi atualizada para Supabase opcional, fallback JSON, `initialPool` limpo, `seedPool` com os 8 palpites originais e regra de premio acumulado sem ganhadores.
- Conferido que `data/bolao-state.json` estava limpo, com `guesses: []`, em 23/06/2026.

## Comandos Historicos de 13/06/2026

- `npm run typecheck` passou.
- `npm test` passou com 2 arquivos e 9 testes.
- `npm audit --omit=dev` retornou 0 vulnerabilidades.
- `npm run build` passou com Next.js 16.2.9.

## Browser

URL local: `http://127.0.0.1:3000`.

Verificacoes com Chrome via Playwright:

- `/apostador`: tela publica carregou sem overlay de hydration error.
- `/admin`: login com PIN local `2026` funcionou.
- Hidratacao: atributo externo `data-scribe-recorder-ready="true"` foi simulado no `<html>` e nao gerou erro.
- Interacao: cadastro de palpite, confirmacao de pagamento no admin e recalculo publico funcionaram.
- Mobile 390px: sem overflow horizontal do documento.
- Limpeza: estado restaurado para os 8 palpites iniciais depois do teste.
- UX apostador: sem link para `/admin` no topo.
- UX apostador: sem bloco `Orquestrador / Arquiteto`.
- Lista publica: placar exibe Brasil x Marrocos com mini bandeiras em CSS, sem texto `BR`/`MA`.

## Artefatos

- `memoria/screenshot-apostador-desktop.png`
- `memoria/screenshot-admin-desktop.png`
- `memoria/screenshot-apostador-mobile.png`
- `memoria/screenshot-apostador-topbar-sem-admin.png`
- `memoria/screenshot-apostador-sem-harness.png`
- `memoria/screenshot-lista-publica-mini-bandeiras-css.png`
- `memoria/dev-server.log`

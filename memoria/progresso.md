# Memoria de Progresso

Esta pasta existe para manter resiliencia da execucao. Se a sessao cair, o proximo agente consegue retomar a partir daqui.

## Estado

- Projeto iniciado a partir de workspace vazio.
- Skill usada: `app-builder`.
- Produto escolhido: micro-SaaS web com Next.js, React, TypeScript e persistencia server-side em arquivo JSON.
- Escopo do MVP: ferramenta operacional do bolao, nao uma casa de apostas.

## Checklist

- [x] Criar memoria de execucao.
- [x] Registrar plano raiz em `PLAN.md`.
- [x] Modelar Orquestrador e Arquiteto.
- [x] Criar dados iniciais do bolao informado.
- [x] Implementar calculos de arrecadacao, comissao e premio.
- [x] Implementar auditoria.
- [x] Criar interface principal.
- [x] Separar ambiente do apostador em `/apostador`.
- [x] Separar ambiente do administrador em `/admin`.
- [x] Proteger administrador com PIN local.
- [x] Criar API e store server-side.
- [x] Instalar dependencias.
- [x] Rodar testes, typecheck e build.
- [x] Abrir no navegador local e verificar visualmente.
- [x] Remover link/admin do topo do apostador.
- [x] Remover bloco tecnico `Orquestrador / Arquiteto` da tela do apostador.
- [x] Trocar emojis de bandeira por mini bandeiras CSS na lista publica.
- [x] Consolidar memoria do projeto para continuidade por outra IA.
- [x] Revisitar workspace e memoria em 23/06/2026.
- [x] Endossar memoria com ajustes sobre Supabase, seedPool, initialPool limpo e premio acumulado.

## Resultado

MVP atualizado para admin/apostador, com hidratacao corrigida e validado em `http://127.0.0.1:3000`.

## Evidencias

- `npm run typecheck`: passou.
- `npm test`: 2 arquivos e 9 testes passaram.
- `npm audit --omit=dev`: 0 vulnerabilidades.
- `npm run build`: passou.
- Browser: fluxo `/apostador` -> `/admin` -> `/apostador` passou com atributo externo no `<html>` e sem erro de hidratacao.
- Screenshots: `memoria/screenshot-apostador-desktop.png`, `memoria/screenshot-admin-desktop.png` e `memoria/screenshot-apostador-mobile.png`.
- UX apostador: sem link para admin, sem painel tecnico, lista publica com mini bandeiras CSS.

## Revisao de 23/06/2026

- Memoria revisitada e endossada.
- Codigo conferido nos pontos principais: layout, store, Supabase, sessao admin, dominio, UI publica e testes.
- `npm run typecheck`: passou.
- `npm audit --omit=dev`: 0 vulnerabilidades.
- `npm run build`: passou com variaveis Supabase vazias.
- `npm test`: falhou sem relatorio detalhado do Vitest; pendencia aberta para investigacao.
- Estado runtime local conferido em `data/bolao-state.json`: bolao limpo, sem palpites.

## Atualizacao de 23/06/2026 - Escocia x Brasil

- App adaptado do confronto Brasil x Marrocos para Escocia x Brasil.
- Data limite atualizada para 24/06/2026 as 19:00, America/Fortaleza.
- UI passou a usar os times do estado em vez de textos fixos.
- Mini bandeira da Escocia adicionada em CSS.
- Supabase `bolao_state.id = 1` reiniciado para o novo jogo, com 0 palpites.
- Backup do estado remoto anterior salvo localmente em `data/*.backup.json`.

## Atualizacao de 23/06/2026 - Valor R$ 5,00

- Valor do palpite alterado de R$ 10,00 para R$ 5,00.
- Regra central atualizada em `initialPool.rules.stakeCents = 500`.
- Testes de regra ajustados para arrecadacao, comissao de 20% e premio liquido de 80% com base em R$ 5,00.
- Supabase `bolao_state.id = 1` atualizado com `rules.stakeCents = 500`.
- Auditoria remota recebeu log `Valor do palpite atualizado`.
- Verificacao final: typecheck, audit e build passaram; browser confirmou R$ 5,00 na tela do apostador.
- Arte lateral antiga substituida por campo CSS dinamico para nao manter rastro visual de Marrocos/MAR.
- Asset `public/bolao-field.png` regenerado para Escocia x Brasil.
- `npm test` manteve a falha silenciosa ja registrada na revisao anterior.

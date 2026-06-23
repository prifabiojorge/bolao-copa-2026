# Memoria do Projeto - Bolao da Copa 2026

Este arquivo e a porta de entrada para qualquer IA ou pessoa que precise continuar o trabalho com calma e sem adivinhar o contexto.

## Revisao de endosso - 23/06/2026

Revisao feita no workspace `E:\Documents\bolao-copa`.

Endosso geral: a memoria esta agradavel, util e alinhada com a maior parte do codigo. O produto continua com uma separacao clara entre apostador e administrador, com foco em transparencia e uso simples no celular.

Ajustes importantes desta revisao:

- A persistencia nao e mais apenas JSON local: existe Supabase opcional em `src/server/supabaseClient.ts`, com fallback para arquivo JSON.
- `initialPool` agora representa um bolao limpo, sem palpites.
- `seedPool` guarda os 8 palpites originais usados como referencia e em testes.
- O arquivo runtime `data/bolao-state.json` estava limpo em 23/06/2026, com `guesses: []`.
- O dominio tem uma regra explicita de resultado sem ganhadores: o premio liquido nao reclamado vai para a banca/organizador.
- `npm run typecheck` passou em 23/06/2026.
- `npm audit --omit=dev` passou em 23/06/2026 com 0 vulnerabilidades.
- `npm run build` passou em 23/06/2026 quando executado com `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` vazios.
- `npm test` falhou em 23/06/2026 sem relatorio detalhado do Vitest; isso deve ser investigado antes de declarar a suite de testes como verde novamente.
- `memoria/dev-server.err.log` mostra `Supabase read error: TypeError: fetch failed`; se Supabase estiver configurado e inacessivel, o app nao faz fallback automatico para JSON.
- A URL `https://hotjqxymmmlurnpkgipq.supabase.co` foi conferida em `.env.local` e a tabela `bolao_state` respondeu com sucesso via service role local.

## Ideia do produto

O projeto e um micro-SaaS simples para administrar um bolao privado do jogo Brasil x Marrocos da Copa 2026.

Dados originais do bolao:

- Data do jogo: 13/06/2026.
- Horario limite: 19:00, fuso `America/Fortaleza`.
- Valor: R$ 10,00 por palpite.
- Regra especial: cada participante so pode ter ate 2 palpites de empate.
- Responsavel do bolao recebe 20% do total pago.
- Premio liquido para vencedores: 80% do total pago.
- Apenas palpites pagos competem.

O tom do produto deve transmitir transparencia, confianca e simplicidade. Ele nao deve parecer casa de apostas. E uma ferramenta operacional para um bolao privado.

## Estado atual

O MVP esta implementado em Next.js, React e TypeScript.

Rotas principais:

- `/apostador`: tela publica do participante.
- `/admin`: tela do responsavel, protegida por PIN.
- `/`: redireciona para `/apostador`.

Repositorio e deploy:

- GitHub: `https://github.com/prifabiojorge/bolao-copa-2026`
- Branch de producao: `main`
- Vercel: projeto `bolao-copa-2026`
- Dominio Vercel observado: `bolao-copa-2026-ebon.vercel.app`

Servidor local validado:

- `http://127.0.0.1:3000/apostador`
- `http://127.0.0.1:3000/admin`

PIN local padrao:

- `2026`

Esse PIN pode ser trocado por variavel de ambiente `ADMIN_PIN`.

Estado de dados atual em 23/06/2026:

- `initialPool`: bolao limpo, sem palpites.
- `seedPool`: copia de referencia com os 8 palpites originais.
- `data/bolao-state.json`: estado local de runtime; no momento da revisao estava sem palpites.

## O que o apostador deve ver

A experiencia do apostador deve ser limpa e sem informacao tecnica.

Na tela publica, o apostador deve ver:

- Informacoes do jogo.
- Regras essenciais.
- Resumo financeiro suficiente para transparencia.
- Formulario de palpite em poucos passos.
- Lista publica dos palpites.
- Status de pagamento de cada palpite.
- Placar exibido como `Brasil x Marrocos`, com mini bandeiras visuais.

O apostador nao deve ver:

- Botao ou link para `/admin`.
- Bloco tecnico de `Orquestrador` e `Arquiteto`.
- Explicacoes internas de arquitetura.
- Ferramentas administrativas.

Decisoes recentes de UI:

- O topo da tela do apostador nao mostra mais os botoes `Apostador` e `Admin`.
- O bloco `Orquestrador / Arquiteto` foi removido da tela do apostador.
- As bandeiras da lista publica nao usam emoji, porque no Windows podem aparecer como letras `BR` e `MA`. Elas sao desenhadas em CSS por `.mini-flag.br` e `.mini-flag.ma`.

## O que o administrador deve ver

O administrador e o responsavel pelo bolao.

Na tela `/admin`, depois de entrar com PIN, ele pode:

- Ver resumo financeiro.
- Confirmar pagamento.
- Reabrir pagamento.
- Ver pendentes primeiro.
- Publicar resultado oficial.
- Ver ganhadores por placar exato.
- Ver cenario sem ganhadores, quando o premio liquido fica acumulado para a banca/organizador.
- Exportar CSV.
- Exportar JSON.
- Copiar link do apostador.
- Restaurar o bolao para os dados iniciais.
- Ver auditoria.
- Ver o bloco tecnico `Orquestrador / Arquiteto`.

## Arquitetura mental

O projeto segue uma separacao simples:

- Interface: componentes React.
- Dominio: regras do bolao, calculos e orquestracao.
- Persistencia: Supabase opcional ou arquivo JSON server-side como fallback.
- API: rotas Next.js.
- Sessao admin: cookie HttpOnly assinado.

Mapa de pastas importantes:

- `src/app`: rotas App Router, layout e APIs.
- `src/app/apostador/page.tsx`: entrada da tela publica.
- `src/app/admin/page.tsx`: entrada do painel admin.
- `src/features/bolao/components/PoolApps.tsx`: principal UI de apostador e admin.
- `src/features/bolao/domain/types.ts`: contratos de dados.
- `src/features/bolao/domain/rules.ts`: calculos e validacoes puras.
- `src/features/bolao/domain/orchestrator.ts`: eventos que alteram o estado.
- `src/features/bolao/domain/architect.ts`: texto do painel tecnico admin.
- `src/features/bolao/data/initialPool.ts`: dados iniciais do bolao informado pelo usuario.
- `src/features/bolao/hooks/usePoolApi.ts`: hook cliente que conversa com as APIs.
- `src/server/poolStore.ts`: leitura/gravacao server-side do estado.
- `src/server/supabaseClient.ts`: cliente Supabase opcional, usado quando as variaveis de ambiente existem.
- `src/server/adminSession.ts`: PIN, cookie e validacao da sessao admin.
- `data/bolao-state.json`: estado atual gerado em runtime.
- `memoria/`: historico, decisoes e evidencias.

## Orquestrador

O Orquestrador centraliza eventos de negocio:

- `REGISTER_GUESS`: registra palpite publico como pendente.
- `SET_PAYMENT`: admin confirma ou reabre pagamento.
- `PUBLISH_RESULT`: admin publica placar oficial.
- `RESET_POOL`: admin restaura dados iniciais.

Antes de gravar, ele valida regras e gera auditoria.

Padrao de retorno:

- `{ accepted, message, pool }`

Invariantes importantes:

- Palpite pendente aparece publicamente, mas nao compete.
- Somente palpite pago entra no premio.
- Resultado oficial premia placar exato.
- Premio e dividido igualmente entre os ganhadores pagos.
- Todo evento operacional relevante gera log de auditoria.

## Persistencia

A persistencia atual e server-side com dois modos:

- Supabase, quando `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` estao configuradas.
- Arquivo local `data/bolao-state.json`, quando as variaveis Supabase nao existem.

Em desenvolvimento local, o fallback em arquivo JSON e o caminho mais simples.

Se o arquivo nao existir, o servidor inicializa com `initialPool`, que atualmente e um bolao limpo sem palpites.

Escrita:

- grava em arquivo `.tmp`
- renomeia para `bolao-state.json`

Isso reduz risco de arquivo parcial.

Observacao: o arquivo `data/bolao-state.json` e ignorado pelo git, porque e estado de runtime.

Observacao sobre Supabase:

- A tabela esperada e `bolao_state`.
- O registro usado e singleton, com `id = 1`.
- O campo principal e `state`.
- A chave `SUPABASE_SERVICE_ROLE_KEY` deve ficar apenas no servidor.
- O fallback para JSON so acontece quando as variaveis Supabase nao existem. Se elas existem e a conexao falha, o erro sobe.

## APIs

Rotas publicas:

- `GET /api/pool`: retorna estado publico.
- `POST /api/guesses`: registra palpite pendente.

Rotas administrativas:

- `POST /api/admin/login`: valida PIN e cria cookie HttpOnly.
- `POST /api/admin/payments`: confirma ou reabre pagamento.
- `POST /api/admin/result`: publica resultado oficial.
- `POST /api/admin/reset`: restaura dados iniciais.

Rotas administrativas retornam `401` sem sessao valida.

## Seguranca atual

O admin usa:

- `ADMIN_PIN`, default local `2026`.
- `SESSION_SECRET`, default local para desenvolvimento.
- Cookie HttpOnly assinado: `bolao_admin_session`.

Isso e suficiente para MVP local ou deploy simples. Nao e login completo multiusuario.

Para producao real, trocar obrigatoriamente:

- `ADMIN_PIN`
- `SESSION_SECRET`

Se usar Supabase, configurar tambem:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Correcao de hidratacao

O erro visto pelo usuario era:

- `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties`

Causa observada:

- atributo externo `data-scribe-recorder-ready="true"` foi injetado no `<html>` por extensao ou gravador do navegador.

Correcao aplicada:

- `src/app/layout.tsx` usa `<html lang="pt-BR" suppressHydrationWarning>`.
- Logicas com `window`, `localStorage` ou `visualViewport` ficam no cliente, dentro de `useEffect`.
- Datas usam fuso deterministico `America/Fortaleza`.

## UX atual da lista publica

Na lista publica, cada palpite mostra:

- ordem
- nome
- mini bandeira do Brasil
- texto `Brasil`
- placar
- texto `Marrocos`
- mini bandeira de Marrocos
- status `Pago` ou `Pendente`

Importante: nao voltar a usar emoji de bandeira para esse ponto. No ambiente do usuario, emoji apareceu como letras `BR` e `MA`.

## Regra atual de premio

Antes do resultado oficial:

- Mostra projecao.
- Ganhadores ainda nao sao calculados.

Depois do resultado oficial:

- Se houver palpite pago com placar exato, o premio liquido e dividido entre os ganhadores.
- Se nao houver palpite pago com placar exato, o premio liquido fica como acumulado para a banca/organizador.
- Se nao houver nenhum palpite pago, nao ha premio nem comissao.

## Como rodar

Instalar dependencias:

```bash
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Abrir:

```text
http://127.0.0.1:3000/apostador
http://127.0.0.1:3000/admin
```

## Como validar

Comandos usados:

```bash
npm run typecheck
npm test
npm audit --omit=dev
npm run build
```

Resultado mais recente em 23/06/2026:

- `npm run typecheck`: passou.
- `npm audit --omit=dev`: passou, 0 vulnerabilidades.
- `npm run build`: passou com variaveis Supabase vazias.
- `npm test`: falhou sem relatorio detalhado do Vitest. Reproduzido tambem ao rodar arquivos isolados, inclusive com variaveis Supabase vazias. Investigar runner/ambiente antes de confiar nos testes.

Tambem foram feitos testes com Playwright/Chrome:

- `/apostador` sem overlay de hydration error.
- `/admin` com login por PIN.
- fluxo apostador -> admin -> apostador.
- confirmacao de pagamento refletindo no publico.
- mobile 390px sem overflow horizontal.
- mini bandeiras CSS aparecendo sem texto `BR`/`MA`.

## Testes existentes

Unitarios de dominio:

- calculo de arrecadacao, comissao e premio.
- limite de 2 empates por participante.
- pendentes fora da premiacao.
- reset do bolao.
- cenario aguardando resultado.
- cenario sem palpites pagos.
- cenario sem ganhadores.
- cenario com ganhadores.

API:

- `GET /api/pool` sem login.
- `POST /api/guesses` registra palpite pendente.
- rotas admin retornam `401` sem cookie.
- login com PIN correto libera acao admin.

Total esperado pelo codigo atual: 13 testes, sendo 9 de dominio e 4 de API.

## Evidencias visuais

Screenshots atuais na pasta:

- `memoria/screenshot-apostador-desktop.png`
- `memoria/screenshot-admin-desktop.png`
- `memoria/screenshot-apostador-mobile.png`
- `memoria/screenshot-apostador-topbar-sem-admin.png`
- `memoria/screenshot-apostador-sem-harness.png`
- `memoria/screenshot-lista-publica-mini-bandeiras-css.png`

Logs:

- `memoria/dev-server.log`
- `memoria/dev-server.err.log`

Endosso:

- `memoria/endosso-2026-06-23.md`

## Pendencias e proximos passos possiveis

O MVP esta funcional. Melhorias futuras possiveis:

- Criar logout do admin.
- Guardar sessao visual do admin depois de recarregar a pagina.
- Investigar por que o Vitest falhou sem relatorio em 23/06/2026.
- Adicionar banco real se houver multi-instancia.
- Adicionar Pix manual com chave e comprovante, sem pagamento automatico.
- Criar pagina ou token secreto para admin em vez de link visivel.
- Criar backup/restore mais amigavel.
- Melhorar acessibilidade da lista se o bolao crescer muito.

## Cuidado ao continuar

Nao quebrar essas preferencias do usuario:

- Apostador nao deve ver botao `Admin`.
- Apostador nao deve ver `Orquestrador` nem `Arquiteto`.
- Lista publica deve mostrar Brasil x Marrocos com mini bandeiras reais via CSS, nao emoji.
- Produto deve parecer transparente e confiavel, nao uma bet.
- Manter tudo simples para uso no celular.

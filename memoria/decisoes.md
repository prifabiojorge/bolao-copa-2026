# Decisoes de Arquitetura

## ADR-001 - Persistencia server-side simples com Supabase opcional

Decisao: entregar a versao atual como app Next.js com estado persistido server-side. Em desenvolvimento local, usar `data/bolao-state.json`. Em ambiente com variaveis Supabase configuradas, usar tabela `bolao_state`.

Motivo: o usuario pediu sincronizacao por servidor simples para que admin e apostadores vejam o mesmo estado em dispositivos diferentes. O arquivo JSON centralizado mantem o MVP leve. Supabase foi adicionado como opcao de deploy sem exigir reescrita do dominio.

Consequencia: o MVP e adequado para um unico servidor Next.js local ou deploy simples. Se usar Supabase, configurar `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`. Para uso comercial, ainda faltam autenticacao completa, permissoes e politica de backup.

## ADR-002 - Palpites pendentes continuam publicos

Decisao: manter palpites pendentes visiveis, mas fora do premio.

Motivo: isso aumenta transparencia sem confundir arrecadacao com promessa de pagamento.

## ADR-003 - Auditoria como requisito de confianca

Decisao: cada evento operacional importante gera `AuditLog`.

Motivo: em bolao com dinheiro, a confianca depende de historico verificavel, nao apenas de tela bonita.

## ADR-004 - Apostador sem detalhes administrativos

Decisao: a tela `/apostador` nao mostra link para `/admin`, nem bloco `Orquestrador / Arquiteto`.

Motivo: o participante precisa de uma experiencia direta: regras, palpite, status e transparencia. Detalhes tecnicos reduzem clareza e podem gerar desconfianca.

## ADR-005 - Mini bandeiras em CSS, nao emoji

Decisao: a lista publica usa mini bandeiras desenhadas em CSS para Escocia e Brasil.

Motivo: no ambiente do usuario, emojis de bandeira apareceram como letras `BR` e `MA`. CSS torna a exibicao estavel em Windows, Chrome e outros ambientes.

## ADR-006 - `initialPool` limpo e `seedPool` como referencia

Decisao: `initialPool` representa um bolao limpo, sem palpites. `seedPool` guarda os 8 palpites originais informados pelo usuario.

Motivo: permite restaurar o bolao para uma lista vazia sem perder a referencia historica dos palpites iniciais em testes e documentacao.

## ADR-007 - Premio acumulado para banca sem ganhadores

Decisao: se o resultado oficial for publicado e nenhum palpite pago acertar o placar exato, o premio liquido fica como acumulado para a banca/organizador.

Motivo: a interface passou a explicar explicitamente o cenario sem ganhadores. Essa regra deve continuar clara para evitar duvida depois do jogo.

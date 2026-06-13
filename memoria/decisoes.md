# Decisoes de Arquitetura

## ADR-001 - MVP com persistencia server-side simples

Decisao: entregar a versao atual como app Next.js com estado persistido em arquivo JSON server-side: `data/bolao-state.json`.

Motivo: o usuario pediu sincronizacao por servidor simples para que admin e apostadores vejam o mesmo estado em dispositivos diferentes. O arquivo JSON centralizado mantem o MVP leve e evita banco real neste ciclo.

Consequencia: o MVP e adequado para um unico servidor Next.js local ou deploy simples. Para multi-instancia ou uso comercial, a proxima etapa deve adicionar banco de dados real, autenticacao completa, permissoes e politica de backup.

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

Decisao: a lista publica usa mini bandeiras desenhadas em CSS para Brasil e Marrocos.

Motivo: no ambiente do usuario, emojis de bandeira apareceram como letras `BR` e `MA`. CSS torna a exibicao estavel em Windows, Chrome e outros ambientes.

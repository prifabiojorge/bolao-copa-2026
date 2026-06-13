# Plano de Execucao - Bolao da Copa 2026

## Objetivo

Construir um micro-SaaS para administrar o bolao Brasil x Marrocos da Copa de 2026, com foco em transparencia, confiabilidade e rastreabilidade.

## Evento

- Jogo: Brasil x Marrocos
- Data: 13/06/2026
- Horario do bolao: 19:00, America/Fortaleza
- Valor por palpite: R$ 10,00
- Limite: ate 2 palpites de empate por participante
- Comissao do responsavel: 20% da arrecadacao paga
- Premio liquido: 80% da arrecadacao paga

## Orquestrador

O Orquestrador recebe eventos do produto e aplica as regras antes de alterar o estado do bolao.

Eventos do MVP:

- Registrar palpite
- Confirmar ou reabrir pagamento
- Publicar resultado oficial
- Restaurar bolao
- Gerar exportacao
- Registrar auditoria

Invariantes:

- Palpites pagos entram no premio; pendentes ficam visiveis, mas inelegiveis.
- Depois do fechamento, novos palpites sao bloqueados.
- Mais de 2 empates por participante sao recusados.
- Toda mudanca operacional gera trilha de auditoria.

## Arquiteto

O Arquiteto organiza o produto em camadas para evolucao segura:

- `src/app`: rota e casca visual do Next.js.
- `src/features/bolao/components`: experiencia do usuario.
- `src/features/bolao/domain`: regras, calculos, orquestracao e contrato de dados.
- `src/features/bolao/data`: carga inicial do bolao informado pelo usuario.
- `src/features/bolao/hooks`: integracao UI-API.
- `src/server`: sessao administrativa e store server-side.
- `data`: arquivo JSON centralizado para sincronizacao local.
- `memoria`: resiliencia da execucao, progresso e decisoes.

## Entrega do MVP

- Painel publico do bolao.
- Ambiente do apostador em `/apostador`.
- Ambiente do administrador em `/admin`.
- Cadastro de palpites.
- Confirmacao manual de pagamento.
- Indicadores de arrecadacao, comissao e premio.
- Ranking por placar exato apos resultado oficial.
- Auditoria visivel.
- Exportacao CSV e JSON.
- PIN local para proteger acoes administrativas.
- Documentacao de execucao e memoria.

## Validacao

- `npm run typecheck`
- `npm test`
- `npm run build`
- Teste visual em navegador local

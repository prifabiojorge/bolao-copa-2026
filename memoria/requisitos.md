# Requisitos Derivados

## Funcionais

- Registrar palpites para Escocia x Brasil.
- Mostrar e calcular cada palpite com valor de R$ 5,00.
- Marcar pagamento como pendente ou pago.
- Separar ambiente publico do apostador e ambiente do administrador.
- Calcular total bruto pago.
- Calcular 20% de comissao do responsavel.
- Calcular 80% de premio liquido.
- Bloquear novos palpites no horario definido.
- Limitar a 2 empates por participante.
- Publicar resultado oficial.
- Calcular ganhadores por placar exato.
- Dividir premio entre ganhadores pagos.
- Destinar premio liquido para banca/organizador quando nao houver ganhador pago.
- Exportar lista em CSV e JSON.
- Proteger acoes administrativas por PIN local e cookie HttpOnly.
- Esconder links e informacoes administrativas da tela do apostador.
- Mostrar Escocia x Brasil com mini bandeiras na lista publica.

## Nao Funcionais

- Transmitir transparencia e confiabilidade.
- Exibir regras de forma clara.
- Manter auditoria de alteracoes.
- Funcionar em desktop e mobile.
- Separar regras de negocio da interface.
- Persistir o estado no servidor simples em arquivo JSON local ou Supabase opcional.
- Evitar erro de hidratacao quando extensoes alterarem atributos do `<html>`.

## Fora do MVP

- Operacao nacional como casa de apostas.
- Odds, cotas variaveis ou marketplace de apostas.
- Login completo multiusuario.
- Pix automatico.
- Banco de dados remoto.
- Multi-instancia.
- Operacao com odds ou cotas variaveis.

## Observacoes de Estado

- `initialPool` e o estado limpo sem palpites.
- `seedPool` contem os 8 palpites originais para referencia e testes.
- Em 23/06/2026, `npm run typecheck` e `npm audit --omit=dev` passaram.
- Em 23/06/2026, `npm test` falhou sem relatorio detalhado do Vitest; investigar antes de tratar a suite como validada.

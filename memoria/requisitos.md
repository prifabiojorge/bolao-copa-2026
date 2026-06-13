# Requisitos Derivados

## Funcionais

- Registrar palpites para Brasil x Marrocos.
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
- Exportar lista em CSV e JSON.
- Proteger acoes administrativas por PIN local e cookie HttpOnly.
- Esconder links e informacoes administrativas da tela do apostador.
- Mostrar Brasil x Marrocos com mini bandeiras na lista publica.

## Nao Funcionais

- Transmitir transparencia e confiabilidade.
- Exibir regras de forma clara.
- Manter auditoria de alteracoes.
- Funcionar em desktop e mobile.
- Separar regras de negocio da interface.
- Persistir o estado no servidor simples em arquivo JSON.
- Evitar erro de hidratacao quando extensoes alterarem atributos do `<html>`.

## Fora do MVP

- Operacao nacional como casa de apostas.
- Odds, cotas variaveis ou marketplace de apostas.
- Login completo multiusuario.
- Pix automatico.
- Banco de dados remoto.
- Multi-instancia.
- Operacao com odds ou cotas variaveis.

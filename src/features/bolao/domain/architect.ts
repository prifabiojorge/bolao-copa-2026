export const harnessArchitecture = {
  orchestrator: {
    title: "Orquestrador",
    summary:
      "Recebe eventos do bolao, valida regras e grava auditoria antes de alterar o estado.",
    responsibilities: [
      "Bloquear palpites apos o horario limite",
      "Aplicar limite de 2 empates por participante",
      "Separar palpites pagos de pendentes",
      "Restaurar o bolao por evento auditado",
      "Gerar logs de auditoria para eventos operacionais"
    ]
  },
  architect: {
    title: "Arquiteto",
    summary:
      "Separa interface, dominio, dados e persistencia para evoluir o MVP sem perder confianca.",
    responsibilities: [
      "Manter calculos de premio fora da UI",
      "Separar ambiente do apostador e ambiente do administrador",
      "Centralizar persistencia em store server-side com arquivo JSON",
      "Proteger rotas administrativas com PIN e cookie HttpOnly",
      "Documentar decisoes na pasta memoria",
      "Preservar uma tela publica simples de auditar"
    ]
  },
  invariants: [
    "Valor por palpite: R$ 10,00",
    "Comissao do responsavel: 20%",
    "Premio: 80% do total pago",
    "Somente palpites pagos competem"
  ]
} as const;

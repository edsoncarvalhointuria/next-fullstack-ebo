export type TableNames =
    | "dimcapacidade"
    | "dimebo"
    | "dimfaq"
    | "dimingresso"
    | "dimcargo"
    | "dimcongregacao"
    | "dimcomprador"
    | "dimusuario"
    | "facttransacao"
    | "dimcredencial"
    | "factcheckin"
    | "vw_transacao_response"
    | "vw_credencial_response"
    | "vw_grafico_credenciais_igrejas"
    | "vw_grafico_credenciais_cargos"
    | "fn_credenciais_total"
    | "vw_metricas_cards_credenciais"
    | "vw_graficos_transacoes"
    | "vw_transacoes_por_status"
    | "vw_transacoes_arrecadacao"
    | "vw_credenciais_por_congregacao"
    | "vw_transacoes_por_ingresso";

export const TAGS_CACHE: Record<TableNames, string> = {
    dimcargo: "TAG_CARGOS",
    dimcongregacao: "TAG_CONGREGACOES",
    dimfaq: "TAG_PERGUNTAS_FREQUENTES",
    dimcapacidade: "TAG_CAPACIDADE",
    dimcomprador: "TAG_COMPRADOR",
    dimcredencial: "TAG_CREDENCIAL",
    dimebo: "TAG_EBO",
    dimingresso: "TAG_INGRESSOS",
    dimusuario: "TAG_USUARIO",
    factcheckin: "TAG_CHECKIN",
    facttransacao: "TAG_TRANSACAO",
    vw_transacao_response: "TAG_VW_TRANSACAO_RESPONSE",
    vw_credencial_response: "TAG_CREDENCIAL_RESPONSE",
    vw_grafico_credenciais_cargos: "TAG_GRAFICO_CREDENCIAIS_CARGOS",
    vw_grafico_credenciais_igrejas: "TAG_GRAFICO_CREDENCIAIS_IGREJAS",
    fn_credenciais_total: "FN_CREDENCIAIS_TOTAL",
    vw_metricas_cards_credenciais: "TAG_METRICAS_CARDS_CREDENCIAIS",
    vw_graficos_transacoes: "TAG_GRAFICOS_TRANSACOES",
    vw_transacoes_por_status: "TAG_TRANSACOES_POR_STATUS",
    vw_credenciais_por_congregacao: "TAG_CREDENCIAIS_POR_CONGREGACAO",
    vw_transacoes_arrecadacao: "TAG_TRANSACOES_ARRECADACAO",
    vw_transacoes_por_ingresso: "TAG_TRANSACOES_POR_INGRESSO",
} as const;

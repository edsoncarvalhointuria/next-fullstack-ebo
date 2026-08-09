"use server";

import { TransacoesForm } from "@/components/pages/transacoes/FormTransacoes";
import { TableNames, TAGS_CACHE } from "@/constants/Tables";
import { createClientCookies } from "@/supabase/server";
import { randomUUID } from "crypto";
import { revalidateTag } from "next/cache";

const TAGS_PARA_REMOVER: TableNames[] = [
    "vw_transacoes_por_status",
    "vw_transacoes_por_ingresso",
    "vw_transacoes_arrecadacao",
    "vw_transacao_response",
    "vw_metricas_cards_credenciais",
    "vw_graficos_transacoes",
    "vw_grafico_credenciais_igrejas",
    "vw_grafico_credenciais_cargos",
    "vw_credencial_response",
    "vw_credenciais_por_congregacao",
    "facttransacao",
    "dimcomprador",
];

export async function salvarTransacaoManual(form: TransacoesForm) {
    const supabase = await createClientCookies();

    const {
        cpf_cnpj,
        email,
        nomeCompleto,
        opcaoPagamento,
        tipoIngresso,
        whatsapp,
        cargo,
        congregacao,
        acompanhantes,
        nomeOutraCongregacao,
    } = form;

    const comprador = {
        cpf_cnpj,
        email,
        nome: nomeCompleto,
        whatsapp: whatsapp || null,
    };

    const id_ebo = (await supabase.from("dimebo").select("id").eq("is_ativo", true).maybeSingle()).data?.id!;

    const id_transacao = randomUUID();

    const credenciais: Omit<CredencialInterface, "id">[] = [
        {
            nome: nomeCompleto,
            id_transacao,
            id_cargo: Number(cargo),
            id_congregacao: Number(congregacao),
            is_outra_congregacao: !!nomeOutraCongregacao,
            nome_outra_congregacao: nomeOutraCongregacao || null,
            is_titular: true,
        },
    ];
    if (acompanhantes?.length) {
        credenciais.push(
            ...acompanhantes.map(
                (v) =>
                    ({
                        nome: v.nomeCompleto,
                        id_transacao,
                        id_cargo: Number(v.cargo),
                        id_congregacao: Number(v.congregacao),
                        is_outra_congregacao: !!v.nomeOutraCongregacao,
                        nome_outra_congregacao: v.nomeOutraCongregacao || null,
                        is_titular: false,
                    }) as CredencialInterface,
            ),
        );
    }

    const capacidade = await supabase.from("dimcapacidade").select("quantidade, ocupacao, id").single();

    if (
        capacidade.data?.ocupacao >= capacidade.data?.quantidade ||
        capacidade.data?.ocupacao + credenciais?.length > capacidade.data?.quantidade
    )
        return { success: false, message: "Capacidade Total Atingida." };

    const { data, error } = await supabase.rpc("fn_registrar_venda_manual", {
        p_cpf_cnpj: cpf_cnpj,
        email,
        whatsapp,
        nome: comprador.nome,
        id_transacao,
        id_ingresso: tipoIngresso,
        id_pagamento_mp: String(Date.now()),
        id_ebo,
        status_pagamento: "aprovado",
        metodo_pagamento: opcaoPagamento,
        credenciais,
    });

    if (error) return { success: false, message: "Falha ao conectar com o banco de dados." };
    if (!data.success) return { success: false, message: data.erro };

    await supabase
        .from("dimcapacidade")
        .update({ ocupacao: capacidade.data?.ocupacao + credenciais.length })
        .eq("id", capacidade.data?.id);
    TAGS_PARA_REMOVER.forEach((v) => revalidateTag(TAGS_CACHE[v], { expire: 0 }));

    return { success: true, message: "Sucesso!" };
}

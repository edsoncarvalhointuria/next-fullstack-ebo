import { TableNames, TAGS_CACHE } from "@/constants/Tables";
import { createClient } from "@supabase/supabase-js";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

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

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (body.type === "payment") {
        const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVER_API_KEY!);
        const { data } = body;

        const payment = new Payment(client);
        const dados = await payment.get({ id: data.id });

        const isErro = dados.status === "charged_back" || dados.status === "refunded";
        const isCancelado = dados.status === "rejected" || dados.status === "cancelled";
        const method =
            dados.payment_type_id === "bank_transfer"
                ? "pix"
                : dados.payment_type_id?.includes("card") || dados.payment_type_id === "account_money"
                  ? "cartao"
                  : "boleto";

        const idTransacao = dados.external_reference;
        if (dados.status === "approved") {
            const credenciaisData = await supabase
                .from("cachecredencial")
                .select("credenciais")
                .eq("id_transacao", idTransacao)
                .single();

            const [credencial, transacao] = await Promise.all([
                supabase.from("dimcredencial").insert(credenciaisData.data!.credenciais as any[]),
                supabase
                    .from("facttransacao")
                    .update({ status_pagamento: "aprovado", id_pagamento_mp: data.id!, metodo_pagamento: method })
                    .eq("id", idTransacao),
                supabase.from("cachecredencial").delete().eq("id_transacao", idTransacao),
            ]);

            if (credencial.error || transacao.error) console.log(`${transacao.error}\n${credencial.error}`);
        } else if (isErro) {
            const { error } = await supabase.rpc("fn_cancelar_venda", {
                transacao_id: idTransacao,
                p_metodo_pagamento: method,
            });

            if (error) console.log("isErro", error);
        } else if (isCancelado) {
            const { data } = await supabase
                .from("facttransacao")
                .select("status_pagamento")
                .eq("id", idTransacao)
                .single();

            if (data?.status_pagamento === "analise") {
                const { error } = await supabase.rpc("fn_cancelar_venda", {
                    transacao_id: idTransacao,
                    p_metodo_pagamento: method,
                });

                if (error) console.log("isCancelado", error);
            }
        } else if (dados.status === "in_process")
            await supabase.from("facttransacao").update({ status_pagamento: "analise" }).eq("id", idTransacao);

        TAGS_PARA_REMOVER.forEach((v) => revalidateTag(TAGS_CACHE[v], { expire: 0 }));
    }
    return NextResponse.json({ received: true }, { status: 200 });
}

import { createClient } from "@supabase/supabase-js";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (body.type === "payment") {
        const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVER_API_KEY!);
        const { data } = body;

        const payment = new Payment(client);
        const dados = await payment.get({ id: data.id });

        const isErro =
            dados.status === "charged_back" ||
            dados.status === "cancelled" ||
            dados.status === "refunded" ||
            dados.status === "rejected";
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
            ]);

            if (credencial.error || transacao.error) throw new Error(`${transacao.error}\n${credencial.error}`);
        } else if (isErro) {
            await Promise.all([
                supabase
                    .from("facttransacao")
                    .update({ status_pagamento: "cancelado", metodo_pagamento: method })
                    .eq("id", idTransacao),
                supabase.from("dimcredencial").delete().eq("id_transacao", idTransacao),
            ]);
        }
    }
    return NextResponse.json({ received: true }, { status: 200 });
}

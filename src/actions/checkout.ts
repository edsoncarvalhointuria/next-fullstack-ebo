"use server";

import { FormCheckout } from "@/components/pages/checkout/FormularioCheckout";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import MercadoPagoConfig, { Preference } from "mercadopago";

const url = process.env.NODE_ENV === "production" ? "https://ebovv.vercel.app" : "https://localhost:3000";

export async function salvarMercadoPago(form: FormCheckout & { tipoIngresso: string | number }) {
    try {
        const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVER_API_KEY!);

        const {
            cpf_cnpj,
            email,
            nomeCompleto,
            opcaoPagamento,
            whatsapp,
            cargo,
            tipoIngresso,
            congregacao,
            acompanhantes,
            nomeOutraCongregacao,
            termos,
        } = form;

        if (!termos) throw new Error("Termos não foram aceitos");

        const comprador = {
            cpf_cnpj,
            email,
            nome: nomeCompleto,
            whatsapp: whatsapp || null,
        };

        const [eboData, ingressoData] = await Promise.all([
            supabase.from("dimebo").select("*").eq("is_ativo", true).maybeSingle(),
            supabase.from("dimingresso").select("*").eq("id", tipoIngresso).maybeSingle(),
        ]);
        const ebo = eboData.data;
        const ingresso = ingressoData.data;
        const id_ebo = ebo?.id!;
        const valor_pedido = ingresso?.preco!;

        const valorFinal = opcaoPagamento === "cartao" ? Number(valor_pedido) + 5 : Number(valor_pedido);

        if (!id_ebo || !valor_pedido) return { success: false, message: "Falha ao pegar dados" };

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

        const { data, error } = await supabase.rpc("fn_registrar_venda", {
            p_cpf_cnpj: cpf_cnpj,
            email,
            whatsapp,
            nome: comprador.nome,
            id_transacao,
            valor_pedido,
            id_ingresso: tipoIngresso,
            quantidade_pessoas: ingresso.quantidade_pessoas,
            id_pagamento_mp: String(Date.now()),
            id_ebo,
            status_pagamento: "pendente",
            metodo_pagamento: opcaoPagamento,
            credenciais,
        });

        if (!data.success && data.code === "ESGOTADO") return { success: false, code: "ESGOTADO" };
        if (error || !data.success) throw new Error(`deu ruim`);

        const client = new MercadoPagoConfig({
            accessToken: process.env.MP_ACCESS_TOKEN!,
        });
        const preference = new Preference(client);

        const dataExpirar = new Date();
        dataExpirar.setMinutes(dataExpirar.getMinutes() + 10);
        const resposta = await preference.create({
            body: {
                items: [
                    {
                        id: String(tipoIngresso),
                        title: ebo?.nome || "EBO",
                        quantity: 1,
                        unit_price: valorFinal,
                        currency_id: "BRL",
                        description: ingresso.descricao || "Ingresso EBO",
                    },
                ],
                back_urls: {
                    success: `${url}/checkout/sucesso`,
                    failure: `${url}/checkout/falha`,
                    pending: `${url}/checkout/pendente`,
                },
                payer: {
                    name: comprador.nome,
                    email: comprador.email,
                    identification: {
                        type: "CPF",
                        number: comprador.cpf_cnpj.replace(/[.-\s/]/g, ""),
                    },
                },
                payment_methods: {
                    excluded_payment_types: [{ id: "ticket" }],
                },
                external_reference: id_transacao,
                notification_url: `${url}/api/mp`,
                statement_descriptor: ebo.nome || "EBOVV",
                expires: true,
                expiration_date_to: dataExpirar.toISOString(),
            },
        });

        return {
            success: true,
            link: resposta.init_point,
        };
    } catch (err) {
        console.log(err);
        return {
            success: false,
            code: "INTERNO",
        };
    }
}

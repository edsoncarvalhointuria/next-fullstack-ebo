"use client";

import { toCurrency } from "@/lib/toCurrency";
import { Ticket, Users } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputsComprador from "./InputsComprador";
import InputsAcompanhantes from "./InputsAcompanhantes";
import InputsPagamento from "./InputsPagamento";

const opcoesP = ["pix", "boleto", "cartao"];
const schema = z
    .object({
        nomeCompleto: z
            .string({ error: "Por favor, digite o nome." })
            .min(5, { error: "O nome precisa ter pelo menos 5 letras." }),
        email: z.email({ error: "Por favor, digite um e-mail válido." }),
        whatsapp: z
            .string()
            .refine((v) => v === "" || v.replace(/\D/g, "").length > 10, {
                error: "O número deve ter pelo menos 11 números.",
            })
            .optional(),
        congregacao: z.string({
            error: "Por favor, selecione a congregação.",
        }),
        nomeOutraCongregacao: z.string().optional(),
        cargo: z.string({ error: "Por favor, selecione o cargo." }),
        acompanhantes: z
            .array(
                z
                    .object({
                        nomeCompleto: z
                            .string({
                                error: "Por favor, digite o nome do(a) acompanhante.",
                            })
                            .min(5, {
                                error: "O nome precisa ter pelo menos 5 letras.",
                            }),
                        congregacao: z.string({
                            error: "Por favor, selecione a congregação.",
                        }),
                        nomeOutraCongregacao: z.string().optional(),
                        cargo: z.string({
                            error: "Por favor, selecione o cargo do(a) acompanhante.",
                        }),
                    })
                    .superRefine((dados, ctx) => {
                        const isOutraCongregacao =
                            dados.congregacao.toLocaleLowerCase() === "outra";
                        const isNome =
                            !dados.nomeOutraCongregacao?.trim() ||
                            dados.nomeOutraCongregacao.length < 3;

                        if (isOutraCongregacao && isNome)
                            ctx.addIssue({
                                code: "custom",
                                message:
                                    "Por favor, digite o nome da sua congregação.",
                                path: ["nomeOutraCongregacao"],
                            });
                    }),
            )
            .optional(),
        opcaoPagamento: z.enum(opcoesP, {
            error: "Por favor, selecione uma forma de pagamento.",
        }),
        cpf_cnpj: z.string().refine(
            (v) => {
                const valorLimpo = v.replace(/\D/g, "");
                const isOk =
                    v !== "" &&
                    (valorLimpo.length === 11 || valorLimpo.length === 14);

                if (isOk) return true;
                return false;
            },
            {
                error: "Por favor, preencha seu CPF ou CNPJ para gerarmos o pagamento",
            },
        ),
        nomeTitular: z
            .string()
            .refine(
                (v) => v === "" || v.length > 4,
                "Por favor, preencha o nome completo",
            )
            .optional(),
        numeroCartao: z
            .string()
            .refine((v) => v === "" || v.replace(/\D/g, "").length === 16, {
                error: "Por favor, preencha o número do cartão para o pagamento",
            })
            .optional(),
        dataValidade: z
            .string()
            .refine((v) => v === "" || v.replace(/\D/g, "").length === 4, {
                error: "Data invalida",
            })
            .optional(),
        cvv: z
            .string()
            .refine((v) => v === "" || v.length >= 3, "CVV invalido")
            .optional(),
        termos: z.literal(true, { error: "Por favor, aceite os termos" }),
    })
    .superRefine((dados, ctx) => {
        const isOutraCongregacao =
            dados.congregacao.toLocaleLowerCase() === "outra";
        const isNome =
            !dados.nomeOutraCongregacao?.trim() ||
            dados.nomeOutraCongregacao.length < 3;

        if (isOutraCongregacao && isNome)
            ctx.addIssue({
                code: "custom",
                message: "Por favor, digite o nome da sua congregação.",
                path: ["nomeOutraCongregacao"],
            });
    })
    .superRefine((dados, ctx) => {
        const { opcaoPagamento, numeroCartao, nomeTitular, dataValidade, cvv } =
            dados;
        const isErro = !numeroCartao || !nomeTitular || !dataValidade || !cvv;
        if (opcaoPagamento === "cartao" && isErro) {
            const obj = {
                code: "custom",
                message: "Esse campo é obrigatório",
            } as any;

            if (!numeroCartao) ctx.addIssue({ ...obj, path: ["numeroCartao"] });
            if (!nomeTitular) ctx.addIssue({ ...obj, path: ["nomeTitular"] });
            if (!dataValidade) ctx.addIssue({ ...obj, path: ["dataValidade"] });
            if (!cvv) ctx.addIssue({ ...obj, path: ["cvv"] });
        }
    });
export type FormCheckout = z.infer<typeof schema>;

const ResumoPedido = ({
    ingresso,
    isTopo,
}: {
    ingresso: IngressosInterface;
    isTopo: boolean;
}) => (
    <div className={`checkout__resumo ${isTopo ? "is-top" : "is-down"}`}>
        <div className="checkout__resumo-infos">
            <h2 className="checkout__resumo-title">
                <i>
                    <Ticket size={24} />
                </i>
                <span>{ingresso.nome_tipo}</span>
            </h2>

            <p className="checkout__resumo-qtd">
                <i>
                    <Users size={24} />
                </i>
                <span>{ingresso.quantidade_pessoas}</span>
            </p>
        </div>

        <p className="checkout__resumo-desc">{ingresso.descricao}</p>

        <div className="checkout__resumo-footer">
            <h3 className="checkout__resumo-price">
                <strong>{toCurrency(ingresso.preco)}</strong>
            </h3>
            {ingresso.observacao && (
                <p className="checkout__resumo-obs">{ingresso.observacao}</p>
            )}
        </div>
    </div>
);

export default function FormularioCheckout({
    ingresso,
}: {
    ingresso: IngressosInterface;
}) {
    const methods = useForm<FormCheckout>({
        resolver: zodResolver(schema),
    });
    const { handleSubmit } = methods;

    const onSubmit = (v: FormCheckout) => {
        console.log(v);
    };

    return (
        <FormProvider {...methods}>
            <form className="checkout__form" onSubmit={handleSubmit(onSubmit)}>
                <ResumoPedido ingresso={ingresso} isTopo />

                <div className="checkout__form-inputs">
                    <div className="checkout__form-comprador">
                        <InputsComprador />
                    </div>

                    {ingresso.quantidade_pessoas > 1 && (
                        <div className="checkout__form-acompanhantes">
                            <InputsAcompanhantes
                                qtd={ingresso.quantidade_pessoas - 1}
                            />
                        </div>
                    )}
                </div>

                <div className="checkout__form-resumo">
                    <ResumoPedido ingresso={ingresso} isTopo={false} />

                    <InputsPagamento />
                </div>
            </form>
        </FormProvider>
    );
}

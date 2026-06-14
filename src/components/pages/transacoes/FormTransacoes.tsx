"use client";

import z from "zod";
import TextInput from "@/components/forms/TextInput";
import SelectInput from "@/components/forms/SelectInput";
import useGetSearchId from "@/hooks/useGetSearchId";
import {
    FormProvider,
    useForm,
    useFormContext,
    useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { getInputsComprador } from "../checkout/InputsComprador";
import ContainerInput from "@/components/forms/ContainerInput";
import OutraCongregacao from "../checkout/OutraCongregacao";
import { mascaraCpfCnpj } from "@/lib/mascaras";
import ModalButtonSubmit from "@/components/ui/modal/ModalButtonSubmit";
import { useDataContext } from "@/contexts/DataContext";
import "./form-transacoes.scss";

const opcoesPagamentos = [
    { id: "dinheiro", nome: "DINHEIRO" },
    { id: "pix", nome: "PIX" },
    { id: "cartao", nome: "CARTAO" },
    { id: "boleto", nome: "BOLETO" },
];
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
        cargo: z
            .string({ error: "Por favor, selecione o cargo." })
            .min(1, "O cargo é obrigatório"),
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
                                    "Por favor, digite o nome da outra congregação.",
                                path: ["nomeOutraCongregacao"],
                            });
                    }),
            )
            .optional(),
        opcaoPagamento: z.enum(
            opcoesPagamentos.map((v) => v.id),
            {
                error: "Por favor, selecione uma forma de pagamento.",
            },
        ),
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
                error: "Por favor, preencha seu CPF ou CNPJ do comprador",
            },
        ),

        tipoIngresso: z
            .string({ error: "O tipo de ingresso é obrigatório" })
            .min(1, "O tipo de ingresso é obrigatório")
            .or(z.number()),
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
                message: "Por favor, digite o nome da outra congregação.",
                path: ["nomeOutraCongregacao"],
            });
    });

type TransacoesForm = z.infer<typeof schema>;
const FormTransacoesAcompanhantes = () => {
    const { ingressos, congregacoes, cargos } = useDataContext();
    const {
        control,
        formState: { errors },
        register,
    } = useFormContext<TransacoesForm>();

    const currentIngresso = useWatch({ control, name: "tipoIngresso" });
    const ingresso = ingressos.find((v) => String(v.id) === currentIngresso);
    const congregacoesMemo = useMemo(() => {
        return [{ id: "outra", nome: "outra" }, ...congregacoes];
    }, [congregacoes]);
    return (
        (ingresso?.quantidade_pessoas || 0) > 1 && (
            <div className="transacoes__form__acompanhantes">
                {Array.from({
                    length: ingresso!.quantidade_pessoas - 1,
                }).map((_, i) => (
                    <div key={i} className="transacoes__form__acompanhante">
                        <h3>Acompanhante</h3>
                        <TextInput
                            key={`acompanhante-nome-${i}`}
                            label="Nome Acompanhante"
                            nameForm={`acompanhantes.${i}.nomeCompleto`}
                            register={register}
                            messageError={
                                errors?.acompanhantes?.[i]?.nomeCompleto
                                    ?.message
                            }
                            autoComplete="companion-name"
                        />
                        <ContainerInput>
                            <SelectInput
                                nameForm={`acompanhantes.${i}.congregacao`}
                                label={"Congregação"}
                                control={control}
                                key={"congregacaoAcompanhante" + i}
                                messageError={
                                    errors?.acompanhantes?.[i]?.congregacao
                                        ?.message
                                }
                                lista={congregacoesMemo}
                            />
                            <OutraCongregacao
                                index={i}
                                messageError={
                                    errors.acompanhantes?.[i]
                                        ?.nomeOutraCongregacao?.message
                                }
                            />
                        </ContainerInput>

                        <SelectInput
                            control={control}
                            key={"cargoAcompanhante" + i}
                            messageError={
                                errors?.acompanhantes?.[i]?.cargo?.message
                            }
                            lista={cargos}
                            nameForm={`acompanhantes.${i}.cargo`}
                            label={"Cargo"}
                        />
                    </div>
                ))}
            </div>
        )
    );
};

export default function FormTransacoes() {
    const {
        addComprador,
        ingressos,
        addTransacao,
        cargos,
        congregacoes,
        addCredencial,
        credenciais,
    } = useDataContext();
    const id = useGetSearchId();
    const methods = useForm<TransacoesForm>({
        resolver: zodResolver(schema),
        shouldUnregister: true,
    });
    const {
        register,
        setValues,
        formState: { errors },
        control,
        handleSubmit,
    } = methods;

    const onSubmit = (v: TransacoesForm) => {
        if (id) {
        } else {
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
            } = v;
            const comprador = {
                cpf_cnpj,
                email,
                nome: nomeCompleto,
                whatsapp: whatsapp || "",
            };
            addComprador(comprador);
            const valor_pedido = ingressos.find(
                (v) => String(v.id) === tipoIngresso,
            )?.preco!;

            const id_transacao = String(Date.now());
            addTransacao({
                data_hora_pedido: new Date().toISOString(),
                id: id_transacao,
                id_comprador: cpf_cnpj,
                id_ingresso: tipoIngresso,
                id_pagamento_mp: String(Date.now()),
                metodo_pagamento: opcaoPagamento as any,
                status_pagamento: "aprovado",
                valor_pedido,
            });

            const novasCredenciais: CredencialInterface[] = [
                {
                    id: Date.now(),
                    id_transacao,
                    is_titular: true,

                    id_congregacao: congregacao,
                    id_cargo: cargo,
                    nome: nomeCompleto,
                    is_outra_congregacao: !!nomeOutraCongregacao,
                    nome_outra_congregacao: nomeOutraCongregacao || null,
                },
            ];
            if (acompanhantes?.length) {
                novasCredenciais.push(
                    ...acompanhantes.map(
                        (v, i) =>
                            ({
                                id: Date.now() + i,
                                id_cargo: v.cargo,
                                id_congregacao: v.congregacao,
                                id_transacao,
                                is_outra_congregacao: !!v.nomeOutraCongregacao,
                                is_titular: false,
                                nome: v.nomeCompleto,
                                nome_outra_congregacao:
                                    v.nomeOutraCongregacao || null,
                            }) as CredencialInterface,
                    ),
                );
            }

            addCredencial([...credenciais, ...novasCredenciais]);
            console.log({
                data_hora_pedido: new Date().toISOString(),
                id: String(Date.now()),
                id_comprador: cpf_cnpj,
                id_ingresso: tipoIngresso,
                id_pagamento_mp: String(Date.now()),
                metodo_pagamento: opcaoPagamento as any,
                status_pagamento: "aprovado",
                valor_pedido,
            });
        }
        window.history.pushState(null, "", "/admin/transacoes");
    };
    const drops = useMemo(() => {
        const inputsComprador = getInputsComprador<TransacoesForm>(
            congregacoes,
            cargos,
        );
        const tiposDeIngresso = ingressos.map((v) => ({
            ...v,
            nome: v.nome_tipo,
        }));
        return { inputsComprador, tiposDeIngresso };
    }, [cargos, congregacoes]);
    useEffect(() => {
        if (!id) return;
        // const item = testeTransacoes.find(v=>String(v.id_transacao)===id);
        // if(item){
        //     setValues({
        //         acompanhantes:item.credenciais.map((v)=>({cargo:v.}))
        //     })
        // }
    }, [id]);
    return (
        <div className="transacoes__form">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="transacoes__form__comprador">
                        <h2>Dados Comprador</h2>

                        <TextInput
                            label="CPF/CNPJ"
                            nameForm="cpf_cnpj"
                            register={register}
                            messageError={errors.cpf_cnpj?.message}
                            mascara={mascaraCpfCnpj}
                            placeholder="000.000.000-00"
                            inputMode="numeric"
                        />
                        {drops.inputsComprador.map((v) =>
                            v.type === "texto" ? (
                                <TextInput
                                    key={v.nameForm}
                                    register={register}
                                    {...v}
                                    messageError={errors[v.nameForm]?.message}
                                    info=""
                                />
                            ) : v.isOutraCongregacao ? (
                                <ContainerInput key={v.nameForm}>
                                    <SelectInput
                                        {...v}
                                        control={control}
                                        messageError={
                                            errors?.[v.nameForm]?.message
                                        }
                                    />

                                    <OutraCongregacao
                                        messageError={
                                            errors?.["nomeOutraCongregacao"]
                                                ?.message
                                        }
                                    />
                                </ContainerInput>
                            ) : (
                                <SelectInput
                                    key={v.nameForm}
                                    {...v}
                                    control={control}
                                    messageError={errors[v.nameForm]?.message}
                                />
                            ),
                        )}

                        <SelectInput
                            control={control}
                            label="Tipo Ingresso"
                            nameForm="tipoIngresso"
                            messageError={errors.tipoIngresso?.message}
                            lista={drops.tiposDeIngresso}
                        />
                    </div>

                    <FormTransacoesAcompanhantes />

                    <div className="transacoes__form__pgmt">
                        <SelectInput
                            lista={opcoesPagamentos}
                            control={control}
                            label="Opção de pagamento"
                            nameForm="opcaoPagamento"
                            messageError={errors.opcaoPagamento?.message}
                        />
                    </div>

                    <ModalButtonSubmit />
                </form>
            </FormProvider>
        </div>
    );
}

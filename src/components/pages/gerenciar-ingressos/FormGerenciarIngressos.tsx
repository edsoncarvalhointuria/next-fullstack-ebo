"use client";

import useGetSearchId from "@/hooks/useGetSearchId";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CheckInput from "@/components/forms/CheckInput";
import TextInput from "@/components/forms/TextInput";
import GroupInputContainer from "@/components/forms/GroupInput";
import TextAreaInput from "@/components/forms/TextAreaInput";
import { Send } from "lucide-react";
import DateInput from "@/components/forms/DateInput";
import { addItem, getItemById, updateItem } from "@/actions/handlerItens";
import z from "zod";
import { useRouter } from "next/navigation";
import FormErrorP from "../config-site/FormErrorP";

const schema = z.object({
    is_ativo: z.boolean(),
    nome_tipo: z.string().min(5, "Nome Inválido"),
    quantidade_pessoas: z
        .string()
        .refine((v) => !Number.isNaN(Number(v)), "Quantidade Inválida")
        .min(1, "Quantidade Inválida"),
    preco: z
        .string()
        .refine((v) => !Number.isNaN(Number(v)), "Número Iválido")
        .min(2, "Preço Inválido"),
    descricao: z.string().min(5, "Descrição Inválida"),
    observacao: z.string().min(5, "Observação Inválida").optional(),
    data_fim_vendas: z.string().optional().or(z.null()),
    ordem: z.number(),
});
type FormIngressos = z.infer<typeof schema>;

export default function FormGerenciarIngressos({ ordem }: { ordem: number }) {
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const table = "dimingresso";
    const id = useGetSearchId();
    const link = "/admin/ingressos";
    const router = useRouter();
    const methods = useForm<FormIngressos>({ resolver: zodResolver(schema), defaultValues: { is_ativo: true, ordem } });
    const {
        register,
        formState: { errors },
        setValues,
        handleSubmit,
    } = methods;

    const onSubmit = async (v: FormIngressos) => {
        const dados = {
            is_ativo: v.is_ativo,
            nome_tipo: v.nome_tipo,
            quantidade_pessoas: Number(v.quantidade_pessoas),
            preco: Number(v.preco),
            descricao: v.descricao,
            data_fim_vendas: v.data_fim_vendas || null,
            observacao: v.observacao,
            ordem: v.ordem,
        };

        setIsLoading(true);
        if (id) {
            const { success, error } = await updateItem(table, dados, id);
            if (error) {
                setIsError(true);
                return setIsLoading(false);
            }

            if (success) return router.push(link);
        }

        const { error, success } = await addItem(table, dados);
        if (error) {
            console.log(error);
            setIsError(true);
            return setIsLoading(false);
        }
        if (success) return router.push(link);

        console.log(v);
    };

    useEffect(() => {
        if (!id) return;
        setIsLoading(true);

        getItemById(table, id).then((v) => {
            setIsLoading(false);
            setValues({
                data_fim_vendas: v.data_fim_vendas?.slice(0, 16),
                descricao: v.descricao,
                is_ativo: v.is_ativo,
                nome_tipo: v.nome_tipo,
                observacao: v.observacao,
                preco: String(v.preco),
                quantidade_pessoas: String(v.quantidade_pessoas),
                ordem: v.ordem || ordem,
            });
        });
    }, [id]);
    return (
        <div className={`base-config__form ${isLoading ? "base-config__form--is-loading" : ""}`}>
            {isError && <FormErrorP />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <CheckInput
                    label="Ativo?"
                    isRequired={false}
                    nameForm="is_ativo"
                    register={register}
                    messageError={errors.is_ativo?.message}
                />

                <TextInput
                    register={register}
                    nameForm="nome_tipo"
                    label="Nome/Tipo Ingresso"
                    placeholder="inidividual, casal, etc"
                    messageError={errors.nome_tipo?.message}
                />

                <GroupInputContainer>
                    <TextInput
                        register={register}
                        nameForm="quantidade_pessoas"
                        label="Qtd Pessoas"
                        placeholder="Quantidade de pessoas"
                        inputMode="numeric"
                        messageError={errors.quantidade_pessoas?.message}
                    />
                    <TextInput
                        register={register}
                        nameForm="preco"
                        label="Preço"
                        placeholder="100"
                        messageError={errors.preco?.message}
                        inputMode="numeric"
                    />
                </GroupInputContainer>

                <TextAreaInput
                    register={register}
                    label="Descrição"
                    nameForm="descricao"
                    placeholder="Esse ingresso comporta x pessoas, válido para y dias..."
                    messageError={errors.descricao?.message}
                />

                <TextAreaInput
                    register={register}
                    label="Observação"
                    isRequired={false}
                    nameForm="observacao"
                    placeholder="Crianças não pagam..."
                    messageError={errors.observacao?.message}
                />

                <DateInput
                    label="Data Encerramento"
                    nameForm="data_fim_vendas"
                    register={register}
                    type="datetime-local"
                    messageError={errors.data_fim_vendas?.message}
                />

                <div className="base-config__form__submit">
                    <button
                        className="base-config__form__btn"
                        type="submit"
                        title="Enviar Formulário"
                        disabled={isLoading}
                    >
                        <i aria-hidden="true">
                            <Send />
                        </i>
                        <span>Enviar</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

"use client";

import useGetSearchId from "@/hooks/useGetSearchId";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { testeIngressos } from "../../../../config/datasTeste";
import CheckInput from "@/components/forms/CheckInput";
import TextInput from "@/components/forms/TextInput";
import GroupInputContainer from "@/components/forms/GroupInput";
import TextAreaInput from "@/components/forms/TextAreaInput";
import ContainerInput from "@/components/forms/ContainerInput";
import GenericInput from "@/components/forms/GenericInput";
import { Send } from "lucide-react";
import DateInput from "@/components/forms/DateInput";
import { useDataContext } from "@/contexts/DataContext";

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
    data_fim_vendas: z.string().or(z.null()),
});
type FormIngressos = z.infer<typeof schema>;

export default function FormGerenciarIngressos() {
    const { addIngresso, ingressos } = useDataContext() as any;
    const id = useGetSearchId();
    const methods = useForm<FormIngressos>({
        resolver: zodResolver(schema),
        defaultValues: { is_ativo: true },
    });
    const {
        register,
        formState: { errors },
        setValues,
        handleSubmit,
    } = methods;
    const onSubmit = (v: FormIngressos) => {
        if (id) {
            const index = ingressos.findIndex((v: any) => String(v.id) === id);
            if (index !== -1) {
                const list = [...ingressos];
                const item = list.splice(index, 1);
                addIngresso([...list, { ...item[0], ...v, id: Date.now() }]);
            }
        } else addIngresso({ ...v, id: Date.now(), ordem: ingressos.length });

        console.log(v);
        window.history.pushState(null, "", "/admin/ingressos");
    };

    useEffect(() => {
        if (!id) return;

        const item = testeIngressos.find((v) => String(v.id) === id);

        if (item)
            setValues({
                data_fim_vendas: item.data_fim_vendas?.slice(0, 16),
                descricao: item.descricao,
                is_ativo: item.is_ativo,
                nome_tipo: item.nome_tipo,
                observacao: item.observacao,
                preco: String(item.preco),
                quantidade_pessoas: String(item.quantidade_pessoas),
            });
    }, [id]);
    return (
        <div className="base-config__form">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
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
                    placeholder="família, casal, etc"
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
                    >
                        <i>
                            <Send />
                        </i>
                        <span>Enviar</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

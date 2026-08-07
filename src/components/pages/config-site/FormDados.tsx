"use client";

import CheckInput from "@/components/forms/CheckInput";
import TextInput from "@/components/forms/TextInput";
import useGetSearchId from "@/hooks/useGetSearchId";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { ItensListaDados } from "./ListaDados";
import { createClientCookies } from "@/supabase/server";
import { addItem, getItemById, updateItem } from "@/actions/handlerItens";
import { TableNames } from "@/constants/Tables";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import FormErrorP from "./FormErrorP";

interface FormProps {
    link: string;
    table: TableNames;
}

const schema = z.object({
    is_ativo: z.boolean(),
    nome: z.string().min(4, "Nome Inválido"),
});

type FormDados = z.infer<typeof schema>;
export default function FormDados({ link, table }: FormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const id = useGetSearchId();
    const router = useRouter();

    const methods = useForm<FormDados>({
        resolver: zodResolver(schema),
        defaultValues: { is_ativo: true },
    });
    const {
        register,
        setValues,
        handleSubmit,
        formState: { errors },
    } = methods;

    const onSubmit = async (v: FormDados) => {
        setIsLoading(true);
        if (id) {
            const { success, error } = await updateItem(table, v, id);

            if (error) {
                setIsLoading(false);
                return setIsError(true);
            }

            if (success) return router.push(link);
        }

        const { success, error } = await addItem(table, v);
        if (error) {
            setIsLoading(false);
            return setIsError(true);
        }
        if (success) return router.push(link);
    };

    useEffect(() => {
        if (!id) return;
        setIsLoading(true);

        getItemById(table, id)
            .then((v) => {
                if (!v) return;
                const { nome, is_ativo } = v;
                setValues({ nome, is_ativo });
            })
            .catch((err) => console.log("deu erro", err))
            .finally(() => setIsLoading(false));
    }, [id]);
    return (
        <div className={`base-config__form ${isLoading ? "base-config__form--is-loading" : ""} `}>
            {isError && <FormErrorP />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <CheckInput label="Ativo?" register={register} nameForm="is_ativo" isRequired={false} />
                <TextInput
                    register={register}
                    label="Nome"
                    nameForm="nome"
                    placeholder="Digite o nome"
                    messageError={errors.nome?.message}
                />

                <div className="base-config__form__submit">
                    <button className="base-config__form__btn" disabled={isLoading}>
                        <i aria-hidden="true">
                            <Send />
                        </i>
                        <span>Salvar</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

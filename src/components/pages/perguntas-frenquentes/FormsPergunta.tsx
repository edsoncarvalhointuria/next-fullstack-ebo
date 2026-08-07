"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import CheckInput from "@/components/forms/CheckInput";
import TextAreaInput from "@/components/forms/TextAreaInput";
import useGetSearchId from "@/hooks/useGetSearchId";
import ModalFormContainer from "@/components/ui/modal/ModalFormContainer";
import ModalButtonSubmit from "@/components/ui/modal/ModalButtonSubmit";
import { addItem, getItemById, updateItem } from "@/actions/handlerItens";
import { useRouter } from "next/navigation";
import "./form-pergunta.scss";
import FormErrorP from "../config-site/FormErrorP";

const schemaEdicao = z.object({
    pergunta: z.string().min(5, "A pergunta está inválida"),
    resposta: z.string().min(5, "A resposta está inválida"),
    is_ativo: z.boolean(),
});

type FormEdicao = z.infer<typeof schemaEdicao>;

export function FormFAQ() {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const table = "dimfaq";
    const link = "/admin/perguntas-frequentes";
    const id = useGetSearchId();
    const router = useRouter();

    const methods = useForm<FormEdicao>({
        resolver: zodResolver(schemaEdicao),
        defaultValues: { is_ativo: true },
    });

    const {
        formState: { errors },
        handleSubmit,
        register,
        setValues,
    } = methods;

    const onSubmit = async (v: FormEdicao) => {
        setIsLoading(true);
        if (id) {
            const { success, error } = await updateItem(table, v, id);
            if (error) return setIsError(true);
            if (success) return router.push(link);
        }

        const { success, error } = await addItem(table, v);
        if (error) return setIsError(true);
        if (success) return router.push(link);

        console.log(v, error);
    };
    useEffect(() => {
        if (!id) return;
        setIsLoading(true);

        getItemById(table, id)
            .then((v) => {
                if (!v) return;
                setIsLoading(false);
                setValues({ is_ativo: v.is_ativo, pergunta: v.pergunta, resposta: v.resposta });
            })
            .catch((error) => console.log("deu erro", error));
    }, [id]);
    return (
        <ModalFormContainer>
            {isError && <FormErrorP />}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={`perguntas-frequentes__form ${isLoading ? "perguntas-frequentes__form--loading" : ""}`}
            >
                <CheckInput label="Visível?" register={register} nameForm="is_ativo" isRequired={false} />

                <TextAreaInput
                    register={register}
                    label="Pergunta"
                    nameForm="pergunta"
                    isRequired
                    placeholder="Digite a pergunta..."
                    messageError={errors.pergunta?.message}
                />
                <TextAreaInput
                    register={register}
                    label="Resposta"
                    nameForm="resposta"
                    isRequired
                    placeholder="Digite a resposta..."
                    messageError={errors.resposta?.message}
                />

                <ModalButtonSubmit disabled={isLoading} />
            </form>
        </ModalFormContainer>
    );
}

"use client";

import CheckInput from "@/components/forms/CheckInput";
import TextInput from "@/components/forms/TextInput";
import useGetSearchId from "@/hooks/useGetSearchId";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { ItensListaDados } from "./ListaDados";

const schema = z.object({
    is_ativo: z.boolean(),
    nome: z.string().min(4, "Nome Inválido"),
});

type FormDados = z.infer<typeof schema>;
export default function FormDados({
    lista,
    onSave,
    link,
}: {
    lista: ItensListaDados[];
    onSave: (lista: ItensListaDados[] | ItensListaDados) => void;
    link: string;
}) {
    const id = useGetSearchId();

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

    const onSubmit = (v: FormDados) => {
        if (id) {
            const index = lista.findIndex((v) => String(v.id) === id);
            if (index !== -1) {
                const list = [...lista];
                const item = list.splice(index, 1);

                onSave([...list, { ...item[0], ...v, id: Date.now() }]);
            }
        } else {
            onSave({ ...v, id: Date.now() });
        }

        console.log(v);

        window.history.pushState(null, "", link);
    };

    useEffect(() => {
        if (!id) return;

        const item = lista.find((v) => String(v.id) === id);
        if (item) setValues({ nome: item.nome, is_ativo: item.is_ativo });
    }, [id]);
    return (
        <div className="base-config__form">
            <form onSubmit={handleSubmit(onSubmit)}>
                <CheckInput
                    label="Ativo?"
                    register={register}
                    nameForm="is_ativo"
                    isRequired={false}
                />
                <TextInput
                    register={register}
                    label="Nome"
                    nameForm="nome"
                    placeholder="Digite o nome"
                    messageError={errors.nome?.message}
                />

                <div className="base-config__form__submit">
                    <button className="base-config__form__btn">
                        <i>
                            <Send />
                        </i>
                        <span>Salvar</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

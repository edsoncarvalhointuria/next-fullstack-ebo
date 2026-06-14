"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { testePerguntas } from "../../../../config/datasTeste";
import "./form-pergunta.scss";
import CheckInput from "@/components/forms/CheckInput";
import TextAreaInput from "@/components/forms/TextAreaInput";
import useGetSearchId from "@/hooks/useGetSearchId";
import ModalFormContainer from "@/components/ui/modal/ModalFormContainer";
import ModalButtonSubmit from "@/components/ui/modal/ModalButtonSubmit";
import { useDataContext } from "@/contexts/DataContext";

const schemaEdicao = z.object({
    pergunta: z.string().min(5, "A pergunta está inválida"),
    resposta: z.string().min(5, "A resposta está inválida"),
    is_ativo: z.boolean(),
});

type FormEdicao = z.infer<typeof schemaEdicao>;

export function FormFAQ() {
    const { perguntas, addPergunta } = useDataContext();
    const id = useGetSearchId();

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

    const onSubmit = (v: FormEdicao) => {
        if (id) {
            const perguntaIndex = perguntas.findIndex(
                (v) => String(v.id) === id,
            );
            if (perguntaIndex !== -1) {
                const newPerguntas = [...perguntas];
                const pergunta = newPerguntas.splice(perguntaIndex, 1);

                addPergunta([
                    ...newPerguntas,
                    { ...pergunta[0], ...v, id: Date.now() },
                ]);
            }
        } else {
            addPergunta({
                ...v,
                data_criacao: new Date().toISOString(),
                id: Date.now(),
                ordem: perguntas.length + 1,
            });
        }

        window.history.pushState(null, "", "/admin/perguntas-frequentes");
        console.log(v);
    };
    useEffect(() => {
        if (!id) return;

        const pergunta = perguntas.find((v) => String(v.id) === id);
        if (pergunta) {
            setValues({
                is_ativo: pergunta.is_ativo,
                pergunta: pergunta.pergunta,
                resposta: pergunta.resposta,
            });
        }
    }, [id]);
    return (
        <ModalFormContainer>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CheckInput
                    label="Visível?"
                    register={register}
                    nameForm="is_ativo"
                    isRequired={false}
                />

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

                <ModalButtonSubmit />
            </form>
        </ModalFormContainer>
    );
}

"use client";
import { addUsuario, getItemById, updateUsuario } from "@/actions/handlerItens";
import useGetSearchId from "@/hooks/useGetSearchId";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import FormErrorP from "../config-site/FormErrorP";
import CheckInput from "@/components/forms/CheckInput";
import TextInput from "@/components/forms/TextInput";
import SelectInput from "@/components/forms/SelectInput";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/forms/PasswordInput";

const cargos = ["super_admin", "financeiro", "portaria"];
const cargosDrop = cargos.map((v) => ({ id: v, nome: v }));

const schema = z.object({
    nome: z.email("O email é obrigatório"),
    nivel: z.enum(cargos, "O cargo é obrigatório"),
    is_ativo: z.boolean(),
    senha: z.string().optional(),
});

type FormDados = z.infer<typeof schema>;

export default function FormUsuario() {
    const table = "dimusuario";
    const link = "/admin/usuarios";
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
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = methods;

    const onSubmit = async (v: FormDados) => {
        setIsLoading(true);
        if (id) {
            const { success } = await updateUsuario(id, v.is_ativo, v.nome, v.nivel, v.senha);
            if (!success) {
                setIsLoading(false);
                return setIsError(true);
            }
            return router.push(link);
        }
        if (!id && (!v.senha || v.senha!.length < 6)) setError("senha", { message: "A senha é obrigatória" });
        const { success } = await addUsuario(v.nome, v.senha!, v.nivel, v.is_ativo);
        if (!success) {
            setIsLoading(false);
            return setIsError(true);
        }
        return router.push(link);
    };

    useEffect(() => {
        if (!id) return;
        setIsLoading(true);

        getItemById(table, id)
            .then((v) => {
                if (!v) return;
                const { nome, nivel, is_ativo } = v;
                setValues({ nome, nivel, is_ativo });
            })
            .catch((err) => console.log("deu erro", err))
            .finally(() => setIsLoading(false));
    }, [id]);
    return (
        <div className={`base-config__form ${isLoading ? "base-config__form--is-loading" : ""} `}>
            {isError && <FormErrorP />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <CheckInput label="Ativo?" register={register} nameForm="is_ativo" isRequired={false} />
                <SelectInput
                    control={control}
                    label="Cargo"
                    lista={cargosDrop}
                    nameForm="nivel"
                    isRequired
                    messageError={errors.nivel?.message}
                    placeholder="Selecione o nível"
                />
                <TextInput
                    register={register}
                    label="Email"
                    nameForm="nome"
                    placeholder="email@email.com"
                    inputMode="email"
                    messageError={errors.nome?.message}
                />

                <PasswordInput
                    label="Senha"
                    register={register}
                    nameForm="senha"
                    isRequired={!id}
                    messageError={errors.senha?.message}
                    placeholder="&lowast;&lowast;&lowast;&lowast;&lowast;&lowast;"
                />

                <div className="base-config__form__submit">
                    <button className="base-config__form__btn" disabled={isSubmitting || isLoading}>
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

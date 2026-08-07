"use client";

import PasswordInput from "@/components/forms/PasswordInput";
import TextInput from "@/components/forms/TextInput";
import MotionMain from "@/components/layout/MotionMain";
import { ArrowLeft, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./login.scss";
import Link from "next/link";
import login from "@/actions/login";

const schema = z.object({
    email: z.email({ error: "Adicione um email válido" }),
    senha: z.string().min(6, { error: "Senha invalida" }),
});

type FormLogin = z.infer<typeof schema>;

export default function Login() {
    const methods = useForm<FormLogin>({ resolver: zodResolver(schema) });
    const {
        handleSubmit,
        register,
        setError,
        formState: { errors, isSubmitting },
    } = methods;

    const onSubmit = async (v: FormLogin) => {
        const { success } = await login(v.email, v.senha);

        if (!success) {
            setError("email", {
                type: "value",
                message: "Email ou senha inválido",
            });
            setError("senha", {
                type: "value",
                message: "Email ou senha inválido",
            });
        }
    };

    return (
        <MotionMain className="login">
            <Link
                href={"/"}
                title="Voltar para página inicial"
                aria-label="Voltar para página inicial"
                className="login__back"
            >
                <i aria-hidden="true">
                    <ArrowLeft size={32} />
                </i>
                <span>Home</span>
            </Link>

            <section className="login__dados">
                <h1>
                    <i>
                        <LogIn />
                    </i>
                    <span>Painel administrativo</span>
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="login__form">
                    <TextInput
                        label="Login"
                        register={register}
                        nameForm="email"
                        placeholder="email@email.com"
                        messageError={errors.email?.message}
                    />
                    <PasswordInput
                        label="Senha"
                        register={register}
                        nameForm="senha"
                        messageError={errors.senha?.message}
                        placeholder="&lowast;&lowast;&lowast;&lowast;&lowast;&lowast;"
                    />

                    <button type="submit" className="login__form-btn" disabled={isSubmitting}>
                        <i aria-hidden="true">
                            <LogIn />
                        </i>
                        <span>Fazer Login</span>
                    </button>
                </form>
            </section>
        </MotionMain>
    );
}

"use client";

import PasswordInput from "@/components/forms/PasswordInput";
import TextInput from "@/components/forms/TextInput";
import MotionMain from "@/components/layout/MotionMain";
import { ArrowLeft, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "@/contexts/AuthContexts";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./login.scss";
import Link from "next/link";

const schema = z.object({
    email: z.email({ error: "Adicione um email válido" }),
    senha: z.string().min(6, { error: "Senha invalida" }),
});

type FormLogin = z.infer<typeof schema>;

export default function Login() {
    const { handleLogin, login } = useAuthContext();
    const router = useRouter();
    const methods = useForm<FormLogin>({ resolver: zodResolver(schema) });
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = methods;
    const onSubmit = (v: FormLogin) => {
        console.log(v);
        if (v) handleLogin();
    };

    useEffect(() => {
        if (login) router.replace("/admin");
    }, [login]);
    return (
        <MotionMain className="login">
            <Link
                href={"/"}
                title="Voltar para página inicial"
                className="login__back"
            >
                <i>
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

                    <button type="submit" className="login__form-btn">
                        <i>
                            <LogIn />
                        </i>
                        <span>Fazer Login</span>
                    </button>
                </form>
            </section>
        </MotionMain>
    );
}

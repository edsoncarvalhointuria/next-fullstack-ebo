"use client";
import { SquarePen, Trash } from "lucide-react";
import { ReactNode } from "react";
import "./botao-acoes.scss";

export default function BotaoAcoes({
    acao,
    link,
    icon,
    className,
}: {
    acao: "del" | "edit";
    link: string;
    icon?: ReactNode;
    className?: string;
}) {
    return (
        <button
            title={acao === "del" ? "Deletar Item" : "Editar Item"}
            type="button"
            className={`botao-acoes botao-acoes--${acao} ${className || ""}`}
            onClick={() => window.history.pushState(null, "", link)}
        >
            <i>{icon ? icon : acao === "del" ? <Trash /> : <SquarePen />}</i>
        </button>
    );
}

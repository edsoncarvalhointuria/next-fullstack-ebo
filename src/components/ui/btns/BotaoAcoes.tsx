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
            aria-label={acao === "del" ? "Clique para deletar" : "Clique para editar"}
        >
            <i aria-hidden="true">{icon ? icon : acao === "del" ? <Trash /> : <SquarePen />}</i>
        </button>
    );
}

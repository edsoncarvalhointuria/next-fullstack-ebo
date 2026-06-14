"use client";

import { CirclePlus } from "lucide-react";
import { ReactNode, useCallback } from "react";
import "./botao-add.scss";

interface BotaoAddProps {
    title: string;
    link?: string;
    icon?: ReactNode;
    className?: string;
}
export default function BotaoAdd({
    title,
    icon,
    className,
    link = "modal=form",
}: BotaoAddProps) {
    const abrirModal = useCallback(() => {
        const url = new URLSearchParams(window.location.search);
        window.history.pushState(null, "", `?${url.toString()}&${link}`);
    }, []);

    return (
        <button className={`botao-add ${className}`} onClick={abrirModal}>
            <i>{icon ? icon : <CirclePlus size={24} />}</i>
            <span>{title}</span>
        </button>
    );
}

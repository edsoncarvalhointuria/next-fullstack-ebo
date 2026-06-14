"use client";

import Link from "next/link";
import { ReactNode } from "react";

function BotaoAba({
    icon,
    mode,
    title,
    isActive,
}: {
    icon: ReactNode;
    mode: string;
    title: string;
    isActive?: boolean;
}) {
    return (
        <Link
            title="abrir aba lista"
            href={`?mode=${mode}`}
            className={`transacoes__aba ${isActive ? "transacoes__aba--active" : ""}`}
        >
            <i>{icon}</i>
            <span>{title}</span>
        </Link>
    );
}

export default BotaoAba;

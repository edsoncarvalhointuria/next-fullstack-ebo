"use client";

import { downloadCSVCredenciais, downloadCSVTransacoes } from "@/actions/downloads";
import { Sheet } from "lucide-react";
import { useCallback, useState } from "react";

export default function BotaoExportar({ type }: { type: "credenciais" | "transacoes" }) {
    const [isLoading, setIsLoading] = useState(false);
    const download = useCallback(async () => {
        setIsLoading(true);

        const csv = await (type === "credenciais" ? downloadCSVCredenciais : downloadCSVTransacoes)();
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}.csv`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        setIsLoading(false);
    }, [type]);
    return (
        <button
            className={`transacoes__button ${isLoading ? "transacoes__button--is-loading" : ""}`}
            type="button"
            title="Exportar para Excel"
            disabled={isLoading}
            onClick={download}
        >
            <i aria-hidden="true">
                <Sheet />
            </i>
            <span>{isLoading ? "Baixando..." : "Exportar"}</span>
        </button>
    );
}

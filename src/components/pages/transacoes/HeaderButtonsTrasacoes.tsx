"use client";

import BotaoAba from "@/components/ui/btns/BotaoAba";
import { ChartColumn, Rows3 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function HeaderButtonsTransacoes() {
    const params = useSearchParams();
    const mode = params.get("mode");

    return (
        <div className="transacoes__abas">
            <BotaoAba
                icon={<Rows3 />}
                mode="lista"
                title="Lista"
                isActive={mode !== "graficos"}
            />

            <BotaoAba
                icon={<ChartColumn />}
                mode="graficos"
                title="Gráficos"
                isActive={mode === "graficos"}
            />
        </div>
    );
}

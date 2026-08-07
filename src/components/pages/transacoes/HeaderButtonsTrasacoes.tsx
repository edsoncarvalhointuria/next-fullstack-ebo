"use client";

import BotaoAba from "@/components/ui/btns/BotaoAba";
import { ChartColumn, Rows3 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function HeaderButtonsTransacoes({ caminho }: { caminho: string }) {
    const pathname = usePathname();
    return (
        <div className="transacoes__abas">
            <BotaoAba
                icon={<Rows3 />}
                mode={`${caminho}/lista`}
                title="Lista"
                isActive={pathname !== `/admin/${caminho}/graficos`}
            />

            <BotaoAba
                icon={<ChartColumn />}
                mode={`${caminho}/graficos`}
                title="Gráficos"
                isActive={pathname === `/admin/${caminho}/graficos`}
            />
        </div>
    );
}

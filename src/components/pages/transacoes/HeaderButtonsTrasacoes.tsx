"use client";

import BotaoAba from "@/components/ui/btns/BotaoAba";
import { ChartColumn, Rows3 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function HeaderButtonsTransacoes({
    caminho,
    isPortaria = false,
}: {
    caminho: string;
    isPortaria?: boolean;
}) {
    const pathname = usePathname();
    return (
        <div className="transacoes__abas">
            <BotaoAba
                icon={<Rows3 />}
                mode={`${caminho}/lista`}
                title="Lista"
                isActive={pathname !== `/admin/${caminho}/graficos`}
            />

            {!isPortaria && (
                <BotaoAba
                    icon={<ChartColumn />}
                    mode={`${caminho}/graficos`}
                    title="Gráficos"
                    isActive={pathname === `/admin/${caminho}/graficos`}
                />
            )}
        </div>
    );
}

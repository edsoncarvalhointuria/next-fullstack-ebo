import { Banknote, ChartColumn, Rows3, Sheet } from "lucide-react";
import { ReactNode, Suspense } from "react";
import "./header-transacoes.scss";
import BotaoAdd from "@/components/ui/btns/BotaoAdd";
import BotaoHeaderContainer from "@/components/ui/btns/BotaoHeaderContainer";
import HeaderButtonsTransacoes from "./HeaderButtonsTrasacoes";

export default function HeaderTransacoes({
    icon,
    title,
    notAdd = true,
}: {
    icon: ReactNode;
    title: string;
    notAdd?: boolean;
}) {
    return (
        <section className="transacoes__header">
            <div className="transacoes__infos">
                <h1 className="transacoes__title">
                    <i>{icon}</i>
                    <span>{title}</span>
                </h1>

                <BotaoHeaderContainer>
                    {!notAdd && (
                        <BotaoAdd
                            title="Nova Venda Manual"
                            icon={<Banknote />}
                        />
                    )}

                    <button
                        className="transacoes__button"
                        type="button"
                        title="Exportar para Excel"
                    >
                        <i>
                            <Sheet />
                        </i>
                        <span>Exportar</span>
                    </button>
                </BotaoHeaderContainer>
            </div>

            <Suspense>
                <HeaderButtonsTransacoes />
            </Suspense>
        </section>
    );
}

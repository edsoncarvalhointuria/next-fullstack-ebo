import { Banknote, Sheet } from "lucide-react";
import { ReactNode, Suspense } from "react";
import BotaoAdd from "@/components/ui/btns/BotaoAdd";
import BotaoHeaderContainer from "@/components/ui/btns/BotaoHeaderContainer";
import HeaderButtonsTransacoes from "./HeaderButtonsTrasacoes";
import "./header-transacoes.scss";

export default function HeaderTransacoes({
    icon,
    title,
    caminho,
    notAdd = true,
}: {
    icon: ReactNode;
    title: string;
    caminho: string;
    notAdd?: boolean;
}) {
    return (
        <section className="transacoes__header">
            <div className="transacoes__infos">
                <h1 className="transacoes__title">
                    <i aria-hidden="true">{icon}</i>
                    <span>{title}</span>
                </h1>

                <BotaoHeaderContainer>
                    {!notAdd && <BotaoAdd title="Nova Venda Manual" icon={<Banknote />} />}

                    <button className="transacoes__button" type="button" title="Exportar para Excel">
                        <i aria-hidden="true">
                            <Sheet />
                        </i>
                        <span>Exportar</span>
                    </button>
                </BotaoHeaderContainer>
            </div>

            <Suspense>
                <HeaderButtonsTransacoes caminho={caminho} />
            </Suspense>
        </section>
    );
}

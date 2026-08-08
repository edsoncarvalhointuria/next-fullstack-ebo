import { Banknote, Sheet } from "lucide-react";
import { ReactNode, Suspense } from "react";
import BotaoAdd from "@/components/ui/btns/BotaoAdd";
import BotaoHeaderContainer from "@/components/ui/btns/BotaoHeaderContainer";
import HeaderButtonsTransacoes from "./HeaderButtonsTrasacoes";
import "./header-transacoes.scss";
import BotaoExportar from "@/components/ui/btns/BotaoExportar";

export default function HeaderTransacoes({
    icon,
    title,
    caminho,
    type,
    notAdd = true,
}: {
    icon: ReactNode;
    title: string;
    type: "credenciais" | "transacoes";
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

                    <BotaoExportar type={type} />
                </BotaoHeaderContainer>
            </div>

            <Suspense>
                <HeaderButtonsTransacoes caminho={caminho} />
            </Suspense>
        </section>
    );
}

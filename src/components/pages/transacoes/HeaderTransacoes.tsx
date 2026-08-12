import { Banknote, Sheet } from "lucide-react";
import { ReactNode, Suspense } from "react";
import BotaoAdd from "@/components/ui/btns/BotaoAdd";
import BotaoHeaderContainer from "@/components/ui/btns/BotaoHeaderContainer";
import HeaderButtonsTransacoes from "./HeaderButtonsTrasacoes";
import "./header-transacoes.scss";
import BotaoExportar from "@/components/ui/btns/BotaoExportar";
import { createClientCookies } from "@/supabase/server";

export default async function HeaderTransacoes({
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
    const supabase = await createClientCookies();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    const isPortaria = session?.user.app_metadata.cargo === "portaria";

    return (
        <section className="transacoes__header">
            <div className="transacoes__infos">
                <h1 className="transacoes__title">
                    <i aria-hidden="true">{icon}</i>
                    <span>{title}</span>
                </h1>

                <BotaoHeaderContainer>
                    {!notAdd && <BotaoAdd title="Nova Venda Manual" icon={<Banknote />} />}

                    {!isPortaria && <BotaoExportar type={type} />}
                </BotaoHeaderContainer>
            </div>

            <Suspense>
                <HeaderButtonsTransacoes caminho={caminho} isPortaria={isPortaria} />
            </Suspense>
        </section>
    );
}

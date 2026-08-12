import MotionMain from "@/components/layout/MotionMain";
import "./admin.scss";
import ChartsLista from "@/components/pages/admin/ChartsAdmin";
import { Suspense } from "react";
import BotaoAdd from "@/components/ui/btns/BotaoAdd";
import ModalBase from "@/components/ui/modal/ModalBase";
import CardsAdmin from "@/components/pages/admin/CardsAdmin";
import { getItens } from "@/actions/handlerItens";
import WrapperForm from "@/components/pages/transacoes/WrapperForm";
import { createClientCookies } from "@/supabase/server";

export default async function AdminHome() {
    const supabse = await createClientCookies();
    const {
        data: { session },
    } = await supabse.auth.getSession();

    const promises = [getItens("vw_transacoes_por_ingresso"), getItens("vw_credenciais_por_congregacao")];

    if (session?.user.app_metadata.cargo !== "portaria")
        promises.push(getItens("vw_transacoes_arrecadacao"), getItens("vw_transacoes_por_status"));

    const [
        transacoesPorIngressoData,
        credenciaisPorCongregacaoData,
        transacoesArrecadacaoData,
        transacoesPorStatusData,
    ] = await Promise.all(promises);

    const transacoesPorIngresso = transacoesPorIngressoData.data![0];
    const transacoesPorStatus = transacoesPorStatusData ? transacoesPorStatusData.data![0] : undefined;
    const credenciaisPorCongregacao = credenciaisPorCongregacaoData.data!;
    const transacoesArrecadacao = transacoesArrecadacaoData ? transacoesArrecadacaoData.data! : undefined;

    return (
        <>
            <MotionMain className="admin">
                <section className="admin__header">
                    <h1>Olá. Seja bem-vindo(a)!</h1>

                    <BotaoAdd title="Nova Venda Manual" />
                </section>
                <CardsAdmin transacoesPorIngresso={transacoesPorIngresso} transacoesPorStatus={transacoesPorStatus} />
                <ChartsLista
                    credenciaisPorCongregacao={credenciaisPorCongregacao}
                    transacoesArrecadacao={transacoesArrecadacao}
                    transacoesPorStatus={transacoesPorStatus}
                />

                {/* <AtividadesRecentes /> */}
            </MotionMain>

            <Suspense>
                <ModalBase keyName="form" title="Transação Manual">
                    <WrapperForm link="/admin" />
                </ModalBase>
            </Suspense>
        </>
    );
}

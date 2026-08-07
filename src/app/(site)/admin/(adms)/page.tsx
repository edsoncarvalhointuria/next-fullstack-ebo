import MotionMain from "@/components/layout/MotionMain";
import "./admin.scss";
import ChartsLista from "@/components/pages/admin/ChartsAdmin";
import { Suspense } from "react";
import BotaoAdd from "@/components/ui/btns/BotaoAdd";
import ModalBase from "@/components/ui/modal/ModalBase";
import CardsAdmin from "@/components/pages/admin/CardsAdmin";
import { getItens } from "@/actions/handlerItens";
import DropdownSkeleton from "@/components/ui/DropdownSkeleton";
import WrapperForm from "@/components/pages/transacoes/WrapperForm";

export default async function AdminHome() {
    const [
        transacoesPorIngressoData,
        credenciaisPorCongregacaoData,
        transacoesArrecadacaoData,
        transacoesPorStatusData,
    ] = await Promise.all([
        getItens("vw_transacoes_por_ingresso"),
        getItens("vw_credenciais_por_congregacao"),
        getItens("vw_transacoes_arrecadacao"),
        getItens("vw_transacoes_por_status"),
    ]);

    const transacoesPorIngresso = transacoesPorIngressoData.data![0];
    const transacoesPorStatus = transacoesPorStatusData.data![0];
    const credenciaisPorCongregacao = credenciaisPorCongregacaoData.data!;
    const transacoesArrecadacao = transacoesArrecadacaoData.data!;

    return (
        <>
            <MotionMain className="admin">
                <section className="admin__header">
                    <h1>
                        Olá, <strong>Edson</strong>. Seja bem-vindo(a)!
                    </h1>

                    <BotaoAdd title="Adicionar nova venda manual?" />
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

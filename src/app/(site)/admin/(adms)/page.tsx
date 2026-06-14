import MotionMain from "@/components/layout/MotionMain";
import "./admin.scss";
import ChartsLista from "@/components/pages/admin/ChartsAdmin";
import { Suspense } from "react";
import BotaoAdd from "@/components/ui/btns/BotaoAdd";
import ModalBase from "@/components/ui/modal/ModalBase";
import FormTransacoes from "@/components/pages/transacoes/FormTransacoes";
import AtividadesRecentes from "@/components/pages/admin/AtividadesRecentesAdmin";
import CardsAdmin from "@/components/pages/admin/CardsAdmin";

export default function AdminHome() {
    return (
        <>
            <MotionMain className="admin">
                <section className="admin__header">
                    <h1>
                        Olá, <strong>Edson</strong>. Seja bem-vindo(a)!
                    </h1>

                    <BotaoAdd title="Adicionar nova venda manual?" />
                </section>
                <CardsAdmin />
                <ChartsLista />

                <AtividadesRecentes />
            </MotionMain>

            <Suspense>
                <ModalBase keyName="form" title="Transação Manual">
                    <FormTransacoes />
                </ModalBase>
            </Suspense>
        </>
    );
}

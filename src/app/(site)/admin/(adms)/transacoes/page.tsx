import MotionMain from "@/components/layout/MotionMain";
import { Coins, Receipt } from "lucide-react";
import "./transacoes.scss";
import HeaderTransacoes from "@/components/pages/transacoes/HeaderTransacoes";
import ModalBase from "@/components/ui/modal/ModalBase";
import FormTransacoes from "@/components/pages/transacoes/FormTransacoes";
import TransacoesBody from "@/components/pages/transacoes/ListaTransacoes";
import { Suspense } from "react";

export default function Transacoes() {
    return (
        <>
            <MotionMain className="transacoes">
                <HeaderTransacoes
                    icon={<Receipt />}
                    title="Transações"
                    notAdd={false}
                />

                <Suspense>
                    <TransacoesBody />
                </Suspense>
            </MotionMain>
            <Suspense>
                <ModalBase
                    keyName="form"
                    title="Transação Manual"
                    icon={<Coins size={34} />}
                >
                    <FormTransacoes />
                </ModalBase>
            </Suspense>
        </>
    );
}

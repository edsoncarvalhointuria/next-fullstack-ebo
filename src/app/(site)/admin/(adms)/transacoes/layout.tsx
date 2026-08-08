import MotionMain from "@/components/layout/MotionMain";
import { Coins, Receipt } from "lucide-react";
import HeaderTransacoes from "@/components/pages/transacoes/HeaderTransacoes";
import ModalBase from "@/components/ui/modal/ModalBase";
import FormTransacoes from "@/components/pages/transacoes/FormTransacoes";
import { ReactNode, Suspense } from "react";
import "./transacoes.scss";
import LoadingPage from "@/components/layout/LoadingPage";
import WrapperForm from "@/components/pages/transacoes/WrapperForm";

export default function LayoutTransacoes({ children }: { children: ReactNode }) {
    return (
        <MotionMain className="transacoes">
            <HeaderTransacoes
                type="transacoes"
                icon={<Receipt />}
                title="Transações"
                caminho="transacoes"
                notAdd={false}
            />

            <Suspense fallback={<LoadingPage />}>{children}</Suspense>
            <Suspense>
                <ModalBase keyName="form" title="Transação Manual" icon={<Coins size={34} />}>
                    <WrapperForm link="/admin/transacoes/lista" />
                </ModalBase>
            </Suspense>
        </MotionMain>
    );
}

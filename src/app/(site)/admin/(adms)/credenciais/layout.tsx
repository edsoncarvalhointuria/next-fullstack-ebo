import MotionMain from "@/components/layout/MotionMain";
import HeaderTransacoes from "@/components/pages/transacoes/HeaderTransacoes";
import { IdCardLanyard } from "lucide-react";
import { ReactNode, Suspense } from "react";
import "./credenciais.scss";
import LoadingPage from "@/components/layout/LoadingPage";

export default async function LayoutCredencial({ children }: { children: ReactNode }) {
    return (
        <MotionMain className="credenciais">
            <HeaderTransacoes icon={<IdCardLanyard size={34} />} caminho="credenciais" title="Credenciais" />
            <Suspense fallback={<LoadingPage />}>{children}</Suspense>
        </MotionMain>
    );
}

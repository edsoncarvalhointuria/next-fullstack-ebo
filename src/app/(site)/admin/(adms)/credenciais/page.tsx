import "./credenciais.scss";
import MotionMain from "@/components/layout/MotionMain";
import HeaderTransacoes from "@/components/pages/transacoes/HeaderTransacoes";
import { IdCardLanyard } from "lucide-react";
import BodyCredenciais from "@/components/pages/credenciais/CredenciaisBody";

export default function Credenciais() {
    return (
        <MotionMain className="credenciais">
            <HeaderTransacoes
                icon={<IdCardLanyard size={34} />}
                title="Credenciais"
            />

            <BodyCredenciais />
        </MotionMain>
    );
}

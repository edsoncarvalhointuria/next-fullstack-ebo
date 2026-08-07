import MotionMain from "@/components/layout/MotionMain";
import Contador from "@/components/ui/Contador";
import { ChevronsRight, Clock } from "lucide-react";
import "./pendente.scss";
import Link from "next/link";

export default function Pendente() {
    return (
        <MotionMain className="pendente">
            <section className="pendente__header">
                <h1 className="pendente__title">
                    <i aria-hidden="true">
                        <Clock size={35} />
                    </i>
                </h1>
                <div className="pendente__infos">
                    <p className="pendente__info">O seu pagamento está sendo processado.</p>
                    <p className="pendente__info">Você será informado por email.</p>
                </div>
            </section>
            <section className="pendente__redirect">
                <h2 className="pendente__redirect-texto">
                    Redirecionando em <Contador tempo={30} redirect="/" />
                </h2>

                <Link href={"/"}>
                    <span>Home</span>{" "}
                    <i aria-hidden="true">
                        <ChevronsRight size={24} />
                    </i>
                </Link>
            </section>
        </MotionMain>
    );
}

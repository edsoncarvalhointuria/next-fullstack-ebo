import MotionMain from "@/components/layout/MotionMain";
import Contador from "@/components/ui/Contador";
import { ChevronsRight, CircleX } from "lucide-react";
import "./falha.scss";
import Link from "next/link";

export default function Falha() {
    return (
        <MotionMain className="falha">
            <section className="falha__header">
                <h1 className="falha__title">
                    <i aria-hidden="true">
                        <CircleX size={35} />
                    </i>
                    <span>Pagamento rejeitado</span>
                </h1>
                <div className="falha__infos">
                    <p className="falha__info falha__info--whats">
                        Em caso de dúvidas entre em contato pelo <Link href="#">Whatsapp</Link>
                    </p>
                </div>
            </section>
            <section className="falha__redirect">
                <h2 className="falha__redirect-texto">
                    Redirecionando em <Contador tempo={60} redirect="/" />
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

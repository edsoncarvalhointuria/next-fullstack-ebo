import MotionMain from "@/components/layout/MotionMain";
import { ChevronsRight, Ticket } from "lucide-react";
import Link from "next/link";
import "./esgotado.scss";

export default function Esgotado() {
    return (
        <MotionMain className="esgotado">
            <section className="esgotado__infos">
                <h1 className="esgotado__title">
                    <i aria-hidden="true">
                        <Ticket size={35} />
                    </i>
                    <span>Esgotado</span>
                </h1>

                <p className="esgotado__whats">
                    Em caso de dúvidas, entre em contato pelo <Link href={"#"}>whatsapp</Link>
                </p>
            </section>

            <section className="esgotado__redirecionando">
                <Link href={"/"}>
                    <span>Home</span>
                    <i aria-hidden="true">
                        <ChevronsRight size={24} />
                    </i>
                </Link>
            </section>
        </MotionMain>
    );
}

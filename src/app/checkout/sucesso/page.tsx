import MotionMain from "@/components/layout/MotionMain";
import Contador from "@/components/ui/Contador";
import { ChevronsRight, CircleCheck } from "lucide-react";
import "./sucesso.scss";
import Link from "next/link";

export default function Sucesso() {
    return (
        <MotionMain className="sucesso">
            <section className="sucesso__header">
                <h1 className="sucesso__title">
                    <i aria-hidden="true">
                        <CircleCheck size={35} />
                    </i>
                    <span>Pagamento concluído!</span>
                </h1>
            </section>
            <section className="sucesso__redirect">
                <h2 className="sucesso__redirect-texto">
                    Redirecionando em <Contador redirect="/" />
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

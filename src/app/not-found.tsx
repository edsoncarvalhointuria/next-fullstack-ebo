import Contador from "@/components/ui/Contador";
import MotionMain from "@/components/layout/MotionMain";
import { ChevronsRight, StickyNoteOff } from "lucide-react";
import "./not-found.scss";
import Link from "next/link";

export default function NotFound() {
    return (
        <MotionMain className="not-found">
            <section className="not-found__header">
                <h1 className="not-found__title">
                    <i>
                        <StickyNoteOff size={35} />
                    </i>
                    <strong>404</strong>
                </h1>
                <p className="not-found__info">Página não encontrada</p>
            </section>
            <section className="not-found__redirect">
                <h2 className="not-found__redirect-texto">
                    Redirecionando em <Contador redirect="/" />
                </h2>

                <Link href={"/"}>
                    <span>Redirecionar</span>{" "}
                    <i>
                        <ChevronsRight size={24} />
                    </i>
                </Link>
            </section>
        </MotionMain>
    );
}

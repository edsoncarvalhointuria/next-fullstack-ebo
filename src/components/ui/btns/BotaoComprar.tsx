import Link from "next/link";
import "./botao-comprar.scss";

export default function BotaoComprar() {
    return (
        <Link href="/ingressos" className="btn-comprar">
            Garantir meu Ingresso
        </Link>
    );
}

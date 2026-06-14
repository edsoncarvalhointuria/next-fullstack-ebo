import { Instagram } from "../ui/icons/Instagram";
import { Facebook } from "../ui/icons/Facebook";
import { Youtube } from "../ui/icons/Youtube";
import "./footer.scss";
import { eventDetails } from "../../../config/eventDetails";
import Link from "next/link";

const redesSociais = [
    {
        nome: "Instagram",
        link: "https://instagram.com/advaledasvirtudesoficial",
        icone: <Instagram />,
    },
    {
        nome: "Facebook",
        link: "https://www.facebook.com/p/Assembl%C3%A9ia-de-Deus-Minist%C3%A9rio-Vale-das-Virtudes-100066517040565/?locale=pt_BR",
        icone: <Facebook />,
    },
    ,
    {
        nome: "Youtube",
        link: "https://www.youtube.com/@canaladvaledasvirtudes",
        icone: <Youtube />,
    },
];
export default function Footer() {
    return (
        <footer className="footer">
            <address className="footer__ministerio">
                <div className="footer__img">
                    <img
                        src="/logo-igreja.png"
                        alt="Ministério Vale Das Virtudes"
                    />
                </div>
                <p className="footer__direcao">
                    Sob a direção do Pastor Presidente{" "}
                    <a
                        rel="noopener noreferrer"
                        href="https://www.instagram.com/prsilas_alves?igsh=MWVqdWFmcmFnOXM2cQ=="
                        target="_blank"
                    >
                        <strong>Silas Alves</strong>
                    </a>
                </p>
                <div className="footer__links">
                    {redesSociais.map((v) => (
                        <a
                            href={v!.link}
                            key={v!.nome}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`footer__link ${v!.nome.toLowerCase()}`}
                        >
                            <i>{v!.icone}</i>
                        </a>
                    ))}
                </div>
            </address>

            <section className="footer__infos">
                <p className="footer__copy">
                    <Link href="/admin/login">
                        &copy; {eventDetails.data.getFullYear()}
                    </Link>{" "}
                    EBOVV. Todos os direitos reservados.
                </p>
                <p className="footer__desenvolvido">
                    Desenvolvido por{" "}
                    <a
                        href="https://edsoncarvalhointuria.github.io/portfolio/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Edson Carvalho Inturia
                    </a>
                </p>
            </section>
        </footer>
    );
}

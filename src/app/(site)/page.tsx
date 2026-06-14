import { Dia } from "@/components/pages/home/Dia";
import { Hero } from "@/components/pages/home/Hero";
import Acordeao from "@/components/ui/Acordeao";
import { Map, MapPin } from "lucide-react";
import "./home.scss";
import Final from "@/components/pages/home/Final";
import { testePerguntas } from "../../../config/datasTeste";

const dias = [
    { img: "/dia1ebo.png", dia: 1, nome: "Pr. Eberson Tobias" },
    { img: "/dia2ebo.png", dia: 2, nome: "Pr. André Bueno" },
    { img: "/dia3ebo.png", dia: 3, nome: "Pr. Carlos Roberto" },
    { img: "/dia4ebo.png", dia: 4, nome: "Pr. Sérgio Pereira" },
];

export default function Home() {
    return (
        <main className="home">
            <Hero>
                <div className="home-hero__video">
                    <video
                        src="/ebo-video.mp4"
                        muted
                        autoPlay
                        loop
                        playsInline
                    ></video>
                </div>
            </Hero>

            {dias.map((v) => (
                <Dia {...v} key={v.nome} />
            ))}

            <Final />

            <section className="home-endereco">
                <h2 className="home-endereco__title">Onde nos encontraremos</h2>

                <address className="home-endereco__infos">
                    <p className="home-endereco__endereco">
                        R. José Ramos Fernandes, 420 - Jardim Vale das Virtudes,
                        São Paulo - SP, 05796-070
                    </p>

                    <div className="home-endereco__btns">
                        <a
                            className="home-endereco__btn"
                            target="_blank"
                            href="https://maps.app.goo.gl/MqFZ8GpSp3JEmuZL7"
                            rel="noopener noreferrer"
                        >
                            <i>
                                <MapPin size={24} />
                            </i>
                            <span>Google Maps</span>
                        </a>
                        <a
                            className="home-endereco__btn"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://ul.waze.com/ul?place=ChIJTz8kz5ZTzpQRk2cZxo7bzr4&ll=-23.64924530%2C-46.77358880&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location"
                        >
                            <i>
                                <Map size={24} />
                            </i>
                            <span>Waze</span>
                        </a>
                    </div>
                </address>
            </section>

            <section className="home-faq">
                <h2 className="home-faq__title">Dúvidas</h2>

                <div className="home-faq__lista">
                    {testePerguntas.map((v, i) => (
                        <Acordeao
                            className="home-faq__acordeao"
                            pergunta={v.pergunta}
                            resposta={v.resposta}
                            key={i}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}

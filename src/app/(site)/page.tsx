import { Dia } from "@/components/pages/home/Dia";
import { Hero } from "@/components/pages/home/Hero";
import { Map, MapPin } from "lucide-react";
import "./home.scss";
import Final from "@/components/pages/home/Final";
import FAQHome from "@/components/pages/home/FAQHome";
import { Suspense } from "react";

const dias = [
    { img: "/Altair_Germano.png", title: "PRELETOR", nome: "Altair Germano" },
    { img: "/fernanda_souza_cunha.png", title: "PRELETORA", nome: "Fernanda Souza" },
    { img: "/gilberto_resende.png", title: "PRELETOR", nome: "Gilberto Resende" },
    // { img: "/Carlos_Emael.png", title: "PRELETOR", nome: "Carlos Emael" },
    // { img: "/Cassandra_Albrecht.png", title: "PRELETORA", nome: "Cassandra Albrecht" },
    { img: "/rosana.png", title: "PRELETORA", nome: "Rosana Garcia" },
    { img: "/dia3ebo.png", title: "PRELETOR", nome: "Carlos Roberto" },
    { img: "/Nerildo_Accioly.png", title: "PRELETOR", nome: "Nerildo Accioly" },
    { img: "/dia4ebo.png", title: "PRELETOR", nome: "Sérgio Pereira" },
];

export default async function Home() {
    return (
        <main className="home">
            <Hero>
                <div className="home-hero__video">
                    <video src="/ebo.mp4" muted playsInline loop autoPlay {...{ fetchPriority: "high" }}></video>
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
                        R. José Ramos Fernandes, 420 - Jardim Vale das Virtudes, São Paulo - SP, 05796-070
                    </p>

                    <div className="home-endereco__btns">
                        <a
                            className="home-endereco__btn"
                            target="_blank"
                            href="https://maps.app.goo.gl/MqFZ8GpSp3JEmuZL7"
                            rel="noopener noreferrer"
                        >
                            <i aria-hidden="true">
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
                            <i aria-hidden="true">
                                <Map size={24} />
                            </i>
                            <span>Waze</span>
                        </a>
                    </div>
                </address>
            </section>
            <Suspense>
                <FAQHome />
            </Suspense>
        </main>
    );
}

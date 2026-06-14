import MotionMain from "@/components/layout/MotionMain";
import { eventDetails } from "../../../../config/eventDetails";
import "./ingressos.scss";
import Ingresso from "@/components/pages/ingressos/Ingresso";
import { testeIngressos } from "../../../../config/datasTeste";
import BotaoWhatsapp from "@/components/ui/btns/BotaoWhatsapp";

export default function Ingressos() {
    return (
        <MotionMain className="ingressos">
            <section className="ingressos__infos">
                <h1 className="ingressos__title">Comprar Ingressos</h1>

                <div className="ingressos__evento">
                    <p className="ingressos__evento-nome">
                        Escola Bíblica de Obreiros
                    </p>
                    <p className="ingressos__evento-horas">
                        {eventDetails.dia} às {eventDetails.hora}
                    </p>
                </div>
            </section>

            <section className="ingressos__lista">
                {testeIngressos
                    .sort((a, b) => a.ordem - b.ordem)
                    .map((v) => (
                        <Ingresso {...v} key={v.id} />
                    ))}
            </section>

            <BotaoWhatsapp />
        </MotionMain>
    );
}

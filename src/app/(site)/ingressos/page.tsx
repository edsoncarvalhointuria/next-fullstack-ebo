"use server";
import MotionMain from "@/components/layout/MotionMain";
import { eventDetails } from "../../../../config/eventDetails";
import Ingresso from "@/components/pages/ingressos/Ingresso";
import BotaoWhatsapp from "@/components/ui/btns/BotaoWhatsapp";
import { getItemAtivo, getItens } from "@/actions/handlerItens";
import "./ingressos.scss";

export default async function Ingressos() {
    const { data } = await getItemAtivo("dimingresso");
    const ingressos = data as IngressosInterface[];
    return (
        <MotionMain className="ingressos">
            <section className="ingressos__infos">
                <h1 className="ingressos__title">Comprar Ingressos</h1>

                <div className="ingressos__evento">
                    <p className="ingressos__evento-nome">Escola Bíblica de Obreiros</p>
                    <p className="ingressos__evento-horas">
                        {eventDetails.dia} às {eventDetails.hora}
                    </p>
                </div>
            </section>

            <section className="ingressos__lista">
                {ingressos
                    .sort((a, b) => a.ordem - b.ordem)
                    .map((v) => (
                        <Ingresso {...v} key={v.id} />
                    ))}
            </section>

            <BotaoWhatsapp />
        </MotionMain>
    );
}

import MotionMain from "@/components/layout/MotionMain";
import { testeIngressos } from "../../../../config/datasTeste";
import FormularioCheckout from "@/components/pages/checkout/FormularioCheckout";
import { notFound } from "next/navigation";
import "./checkout.scss";

const simularBusca = (id: string | number) =>
    new Promise((resolve) =>
        setTimeout(
            () =>
                resolve(
                    testeIngressos.find((v) => String(v.id) === String(id)),
                ),
            2000,
        ),
    );

export default async function Checkout({
    params,
}: {
    params: Promise<{ id: string | number }>;
}) {
    const idIngresso = await params;
    const ingresso = (await simularBusca(idIngresso.id)) as IngressosInterface;

    if (!ingresso) notFound();

    return (
        <MotionMain className="checkout">
            <section className="checkout__title">
                <h1>Comprar Ingresso</h1>
            </section>

            <section className="checkout__infos">
                <FormularioCheckout ingresso={ingresso} />
            </section>
        </MotionMain>
    );
}

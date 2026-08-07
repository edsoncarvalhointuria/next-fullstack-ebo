import MotionMain from "@/components/layout/MotionMain";
import "./checkout.scss";
import WrapperCheckout from "@/components/pages/checkout/WrapperCheckout";

export default async function Checkout({ params }: { params: Promise<{ id: string }> }) {
    return (
        <MotionMain className="checkout">
            <section className="checkout__title">
                <h1>Comprar Ingresso</h1>
            </section>

            <section className="checkout__infos">
                <WrapperCheckout params={params} />
            </section>
        </MotionMain>
    );
}

import Final from "@/components/pages/home/Final";
import "./checkout.scss";

export default function CheckoutLoading() {
    return (
        <main className="checkout__loading">
            <Final showButton={false} />
        </main>
    );
}

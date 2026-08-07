import Final from "@/components/pages/home/Final";
import "./loading.scss";

export default function CheckoutLoading() {
    return (
        <main className="loading">
            <Final showButton={false} />
        </main>
    );
}

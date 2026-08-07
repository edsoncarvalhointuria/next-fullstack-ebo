import { Loader } from "lucide-react";
import "./loading-page.scss";

export default function LoadingPage() {
    return (
        <section className="loading-page">
            <div className="loading-page__infos">
                <h2>Carregando</h2>
                <i aria-hidden="true">
                    <Loader />
                </i>
            </div>

            <div aria-hidden="true" className="loading-page__skeletons">
                <div className="loading-page__skeleton loading-page__skeleton__header">
                    <span></span>
                    <span></span>
                </div>

                <div className="loading-page__skeleton loading-page__skeleton__info">
                    <span></span>
                </div>

                <div className="loading-page__skeleton loading-page__skeleton__info">
                    <span></span>
                </div>
            </div>
        </section>
    );
}

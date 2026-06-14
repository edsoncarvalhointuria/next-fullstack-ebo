import BotaoComprar from "../../ui/btns/BotaoComprar";
import "./final.scss";

export default function Final({ showButton = true }: { showButton?: boolean }) {
    return (
        <section className="home-final">
            <video
                className="home-final__video"
                src="/ebo-video.mp4"
                autoPlay
                loop
                muted
                playsInline
            />
            <div className="home-final__efeito">
                <h2 className="home-final__title">19º EBO</h2>
                {!showButton && <p>Carregando ...</p>}
            </div>
            {showButton && (
                <div className="home-final__button">
                    <BotaoComprar />
                </div>
            )}
        </section>
    );
}

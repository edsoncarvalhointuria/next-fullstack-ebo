import MotionMain from "@/components/layout/MotionMain";
import "./capacidade-maxima.scss";
import { PackageOpen } from "lucide-react";
import CountUp from "@/components/ui/CountUp";

export default function CapacidadeMaxima() {
    return (
        <MotionMain className="capacidade-maxima">
            <section className="capacidade-maxima__header">
                <div className="capacidade-maxima__card">
                    <h1 className="capacidade-maxima__title">
                        <i>
                            <PackageOpen />
                        </i>
                        <span>Capacidade Maxima</span>
                    </h1>

                    <h2 className="capacidade-maxima__numero">
                        <CountUp valor={100} duration={1.3} type="round" />
                    </h2>
                </div>
            </section>

            <section className="capacidade-maxima__edicao">
                <form>
                    <div className="capacidade-maxima__input">
                        <input
                            type="number"
                            name="capacidade-maxima-input"
                            id="capacidade-maxima-input"
                            defaultValue={100}
                        />
                        <p className="capacidade-maxima__input-aviso">
                            Quando o total de inscrições aprovadas e pendentes
                            atingir este limite, o sistema pausará
                            automaticamente as vendas públicas
                        </p>
                    </div>

                    <button type="submit" title="salvar nova capacidade">
                        Atualizar Capacidades
                    </button>
                </form>
            </section>
        </MotionMain>
    );
}

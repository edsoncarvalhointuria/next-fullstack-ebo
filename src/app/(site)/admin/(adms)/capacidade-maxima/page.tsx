import MotionMain from "@/components/layout/MotionMain";
import { PackageOpen } from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import "./capacidade-maxima.scss";
import { getItens } from "@/actions/handlerItens";
import FormCapacidade from "@/components/pages/capacidade-maxima/FormCapacidade";

export default async function CapacidadeMaxima() {
    const { data } = await getItens("dimcapacidade");
    const capacidade = data?.length ? data[0] : { quantidade: 0, id: "", ocupacao: 0 };

    return (
        <MotionMain className="capacidade-maxima">
            <section className="capacidade-maxima__header">
                <div className="capacidade-maxima__card">
                    <h1 className="capacidade-maxima__title">
                        <i aria-hidden="true">
                            <PackageOpen />
                        </i>
                        <span>Capacidade Atingida</span>
                    </h1>

                    <h2 className="capacidade-maxima__numero">
                        <CountUp valor={capacidade.ocupacao} duration={1.3} type="round" />
                    </h2>
                </div>
            </section>

            <section className="capacidade-maxima__edicao">
                <form>
                    <FormCapacidade capacidade={capacidade.quantidade} id={capacidade.id} />
                </form>
            </section>
        </MotionMain>
    );
}

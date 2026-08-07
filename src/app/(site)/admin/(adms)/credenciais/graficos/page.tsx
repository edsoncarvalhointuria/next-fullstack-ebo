import { GraficosCredenciais } from "@/components/pages/credenciais/CredenciaisBody";
import "./credenciais-graficos.scss";
import { getItens, getItensFunction } from "@/actions/handlerItens";

export default async function CredenciaisGraficos() {
    const [cargosData, congregacoesData, inscricoesData, cardsCredenciaisData] = await Promise.all([
        getItens("vw_grafico_credenciais_cargos"),
        getItens("vw_grafico_credenciais_igrejas"),
        getItensFunction("fn_credenciais_total"),
        getItens("vw_metricas_cards_credenciais"),
    ]);

    const listaGraficosCredenciais = {
        congregacoes: congregacoesData.data as GraficoCredenciaisIgrejas[],
        cargos: (cargosData.data as GraficoCredenciaisCargos[]).map((v, i) => ({
            ...v,
            fill: `var(--chart-${(i % 12) + 1})`,
        })),
        inscricoes: (inscricoesData.data as CredenciaisTotal[]) || [],
    };
    const cardsCredenciais = cardsCredenciaisData.data
        ? (cardsCredenciaisData.data[0] as MetricasCardsCredenciais)
        : undefined;

    return (
        <GraficosCredenciais cardsCredenciais={cardsCredenciais} listaGraficosCredenciais={listaGraficosCredenciais} />
    );
}

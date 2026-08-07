import { GraficosTransacoes } from "@/components/pages/transacoes/ListaTransacoes";
import "./transacoes-graficos.scss";
import { getItens } from "@/actions/handlerItens";

export default async function TransacoesGraficos() {
    const [listaGraficosTransacoesData, transacoesPorStatusData] = await Promise.all([
        getItens("vw_graficos_transacoes"),
        getItens("vw_transacoes_por_status"),
    ]);

    const listaGraficosTransacoes = listaGraficosTransacoesData.data as GraficosTransacoes[];
    const transacoesPorStatus = transacoesPorStatusData.data![0] as CardsTransacaoStatus;
    transacoesPorStatus.pendente.fill = "var(--brand-warning)";
    transacoesPorStatus.aprovado.fill = "var(--brand-success)";
    transacoesPorStatus.cancelado.fill = "var(--brand-danger)";
    return (
        <GraficosTransacoes
            listaGraficosTransacoes={listaGraficosTransacoes}
            transacoesPorStatus={transacoesPorStatus}
        />
    );
}

import { getItens } from "@/actions/handlerItens";
import { ListaTransacoes } from "@/components/pages/transacoes/ListaTransacoes";

export default async function TransacoesLista() {
    const responseTransacoesData = await getItens("vw_transacao_response");
    const responseTransacoes = responseTransacoesData.data as TransacaoResponse[];
    return <ListaTransacoes responseTransacoes={responseTransacoes} />;
}

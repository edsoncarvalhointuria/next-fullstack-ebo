import { getItens } from "@/actions/handlerItens";
import { deletarTransacaoManual } from "@/actions/transacoes";
import DeletarConfig from "@/components/pages/config-site/DeletarConfig";
import { ListaTransacoes } from "@/components/pages/transacoes/ListaTransacoes";
import { Banknote } from "lucide-react";
import { Suspense } from "react";

export default async function TransacoesLista() {
    const responseTransacoesData = await getItens("vw_transacao_response");
    const responseTransacoes = responseTransacoesData.data as TransacaoResponse[];
    return (
        <>
            <ListaTransacoes responseTransacoes={responseTransacoes} />

            <Suspense>
                <DeletarConfig<TransacaoInterface>
                    keyName="valor_pedido"
                    table={"facttransacao"}
                    link={"/admin/transacoes/lista"}
                    icon={<Banknote />}
                    onClick={deletarTransacaoManual}
                />
            </Suspense>
        </>
    );
}

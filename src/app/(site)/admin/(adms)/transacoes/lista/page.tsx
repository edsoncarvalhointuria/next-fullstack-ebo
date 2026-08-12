import { getItens } from "@/actions/handlerItens";
import { deletarTransacaoManual } from "@/actions/transacoes";
import DeletarConfig from "@/components/pages/config-site/DeletarConfig";
import { ListaTransacoes } from "@/components/pages/transacoes/ListaTransacoes";
import { createClientCookies } from "@/supabase/server";
import { Banknote } from "lucide-react";
import { Suspense } from "react";

export default async function TransacoesLista() {
    const supabase = await createClientCookies();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    const responseTransacoesData = await getItens("vw_transacao_response");
    let responseTransacoes = responseTransacoesData.data as TransacaoResponse[];

    if (session?.user.app_metadata.cargo === "portaria")
        responseTransacoes = responseTransacoes.map((v) => {
            const { comprador } = v;
            const comp = {
                ...comprador,
                cpf: comprador.cpf.replace(/(.{3}).*/g, "$1.***.***"),
            };

            return { ...v, comprador: comp };
        });

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

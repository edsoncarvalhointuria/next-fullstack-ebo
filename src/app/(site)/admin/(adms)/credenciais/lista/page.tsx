import { ListaCredenciais } from "@/components/pages/credenciais/CredenciaisBody";
import { getItens } from "@/actions/handlerItens";
import "./credenciais-lista.scss";

export default async function CredenciaisLista() {
    const [ingressosData, congregacoesData, cargosData, credenciaisResponse] = await Promise.all([
        getItens("dimingresso"),
        getItens("dimcongregacao"),
        getItens("dimcargo"),
        getItens("vw_credencial_response"),
    ]);
    const ingressos = ingressosData.data as IngressosInterface[];
    const congregacoes = congregacoesData.data as CongregacaoInterface[];
    const cargos = cargosData.data as CargosInterface[];
    const credenciais = credenciaisResponse.data as CredencialResponse[];

    return (
        <ListaCredenciais
            ingressos={ingressos}
            congregacoes={congregacoes}
            cargos={cargos}
            credenciaisResponse={credenciais}
        />
    );
}

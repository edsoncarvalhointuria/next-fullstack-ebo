"use server";

import { getItens } from "@/actions/handlerItens";
import FormTransacoes from "./FormTransacoes";

export default async function WrapperForm({ link }: { link: string }) {
    const [ingressosData, cargosData, congregacoesData] = await Promise.all([
        getItens("dimingresso"),
        getItens("dimcargo"),
        getItens("dimcongregacao"),
    ]);
    const ingressos = ingressosData.data!;
    const cargos = cargosData.data!;
    const congregacao = congregacoesData.data!;

    return <FormTransacoes link={link} cargos={cargos} congregacoes={congregacao} ingressos={ingressos} />;
}

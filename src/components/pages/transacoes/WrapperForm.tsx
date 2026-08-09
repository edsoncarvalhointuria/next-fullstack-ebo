"use server";

import { getItemAtivo } from "@/actions/handlerItens";
import FormTransacoes from "./FormTransacoes";

export default async function WrapperForm({ link }: { link: string }) {
    const [ingressosData, cargosData, congregacoesData] = await Promise.all([
        getItemAtivo("dimingresso"),
        getItemAtivo("dimcargo"),
        getItemAtivo("dimcongregacao"),
    ]);
    const ingressos = ingressosData.data!;
    const cargos = cargosData.data!;
    const congregacao = congregacoesData.data!;

    return <FormTransacoes link={link} cargos={cargos} congregacoes={congregacao} ingressos={ingressos} />;
}

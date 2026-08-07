import { getItemById, getItens } from "@/actions/handlerItens";
import FormularioCheckout from "./FormularioCheckout";
import { notFound } from "next/navigation";

export default async function WrapperCheckout({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const ingresso = (await getItemById("dimingresso", id)) as IngressosInterface;

    if (!ingresso) notFound();
    const [cargosData, congregacoesData] = await Promise.all([getItens("dimcargo"), getItens("dimcongregacao")]);
    return <FormularioCheckout ingresso={ingresso} cargos={cargosData.data!} congregacoes={congregacoesData.data!} />;
}

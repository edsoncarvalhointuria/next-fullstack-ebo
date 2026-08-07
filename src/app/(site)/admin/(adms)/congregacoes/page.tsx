import { Church } from "lucide-react";
import BaseConfig from "@/components/pages/config-site/BaseConfig";
import { Suspense } from "react";
import ModalBase from "@/components/ui/modal/ModalBase";
import FormDados from "@/components/pages/config-site/FormDados";
import DeletarConfig from "@/components/pages/config-site/DeletarConfig";
import { getItens } from "@/actions/handlerItens";
import { ItensListaDados } from "@/components/pages/config-site/ListaDados";

export default async function Congregacoes() {
    const table = "dimcongregacao";
    const link = "/admin/congregacoes";
    const { data } = await getItens(table);
    const congregacoes = data as ItensListaDados[];
    return (
        <>
            <BaseConfig
                icon={<Church size={34} />}
                itens={congregacoes}
                title={"Congregações"}
                buttonTitle={"Nova Congregação"}
                buttonLink="modal=form"
            />

            <Suspense>
                <ModalBase keyName="form" title="Congregações" icon={<Church size={34} />}>
                    <FormDados link={link} table={table} />
                </ModalBase>

                <DeletarConfig icon={<Church size={34} />} table={table} link={link} />
            </Suspense>
        </>
    );
}

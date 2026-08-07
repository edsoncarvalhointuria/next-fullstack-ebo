import { IdCard, IdCardLanyard } from "lucide-react";
import BaseConfig from "@/components/pages/config-site/BaseConfig";
import { Suspense } from "react";
import ModalBase from "@/components/ui/modal/ModalBase";
import FormDados from "@/components/pages/config-site/FormDados";
import DeletarConfig from "@/components/pages/config-site/DeletarConfig";
import { ItensListaDados } from "@/components/pages/config-site/ListaDados";
import { getItens } from "@/actions/handlerItens";
import "./cargos.scss";

export default async function Cargos() {
    const link = "/admin/cargos";
    const table = "dimcargo";
    const { data } = await getItens("dimcargo");
    const cargos = data as ItensListaDados[];

    return (
        <>
            <BaseConfig
                icon={<IdCard size={34} />}
                itens={cargos}
                title={"Cargos"}
                buttonTitle={"Cadastrar Novo Cargo"}
                buttonLink="modal=form"
            />

            <Suspense>
                <ModalBase keyName="form" title="Cargos" icon={<IdCardLanyard size={34} />}>
                    <FormDados link={link} table={table} />
                </ModalBase>

                <DeletarConfig icon={<IdCardLanyard />} link={link} table={table} />
            </Suspense>
        </>
    );
}

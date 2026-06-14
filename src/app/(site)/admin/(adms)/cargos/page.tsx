"use client";
import "./cargos.scss";
import {
    Calculator,
    CirclePlus,
    IdCard,
    IdCardLanyard,
    UserRoundCheck,
    UserRoundX,
} from "lucide-react";
import BaseConfig from "@/components/pages/config-site/BaseConfig";
import { Suspense } from "react";
import ModalBase from "@/components/ui/modal/ModalBase";
import FormDados from "@/components/pages/config-site/FormDados";
import DeletarConfig from "@/components/pages/config-site/DeletarConfig";
import { useDataContext } from "@/contexts/DataContext";

export default function Cargos() {
    const { cargos, addCargo } = useDataContext();
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
                <ModalBase
                    keyName="form"
                    title="Cargos"
                    icon={<IdCardLanyard size={34} />}
                >
                    <FormDados
                        onSave={addCargo}
                        link="/admin/cargos"
                        lista={cargos}
                    />
                </ModalBase>

                <DeletarConfig
                    onConfirm={addCargo}
                    icon={<IdCardLanyard />}
                    lista={cargos}
                />
            </Suspense>
        </>
    );
}

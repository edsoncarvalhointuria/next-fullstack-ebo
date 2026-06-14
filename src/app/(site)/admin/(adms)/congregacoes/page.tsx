"use client";

import { Church } from "lucide-react";
import BaseConfig from "@/components/pages/config-site/BaseConfig";
import { Suspense } from "react";
import ModalBase from "@/components/ui/modal/ModalBase";
import FormDados from "@/components/pages/config-site/FormDados";
import DeletarConfig from "@/components/pages/config-site/DeletarConfig";
import { useDataContext } from "@/contexts/DataContext";

export default function Cargos() {
    const { congregacoes, addCongregacao } = useDataContext();
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
                <ModalBase
                    keyName="form"
                    title="Cargos"
                    icon={<Church size={34} />}
                >
                    <FormDados
                        onSave={addCongregacao}
                        lista={congregacoes}
                        link="/admin/congregacoes"
                    />
                </ModalBase>

                <DeletarConfig
                    icon={<Church size={34} />}
                    lista={congregacoes}
                    onConfirm={addCongregacao}
                />
            </Suspense>
        </>
    );
}

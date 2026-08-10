import MotionMain from "@/components/layout/MotionMain";
import BaseConfig, { BaseHeader } from "@/components/pages/config-site/BaseConfig";
import DeletarConfig from "@/components/pages/config-site/DeletarConfig";
import ModalBase from "@/components/ui/modal/ModalBase";
import { CircleUserRound, Plus, TicketPlus, User, UserRoundX } from "lucide-react";
import { Suspense } from "react";
import "./usuarios.scss";
import { getItens } from "@/actions/handlerItens";
import FormUsuario from "@/components/pages/usuarios/FormUsuarios";

export default async function Usuarios() {
    const table = "dimusuario";
    const link = "/admin/usuario";

    const { data } = await getItens("dimusuario");
    const usuario = data as UsuarioInterface[];
    return (
        <>
            <BaseConfig
                icon={<User size={34} />}
                itens={usuario}
                title={"Usuário"}
                buttonTitle={"Cadastrar Usuário"}
                buttonLink="modal=form"
                isUsuario
            />

            <Suspense>
                <ModalBase keyName="form" title="Ingressos" icon={<CircleUserRound />}>
                    <FormUsuario />
                </ModalBase>
                {/* <DeletarConfig<UsuarioInterface> keyName="nome" table={table} link={link} icon={<UserRoundX />} /> */}
            </Suspense>
        </>
    );
}

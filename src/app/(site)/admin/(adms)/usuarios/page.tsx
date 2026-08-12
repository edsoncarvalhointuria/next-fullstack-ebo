import MotionMain from "@/components/layout/MotionMain";
import BaseConfig, { BaseHeader } from "@/components/pages/config-site/BaseConfig";
import DeletarConfig from "@/components/pages/config-site/DeletarConfig";
import ModalBase from "@/components/ui/modal/ModalBase";
import { CircleUserRound, User } from "lucide-react";
import { Suspense } from "react";
import "./usuarios.scss";
import { getItens } from "@/actions/handlerItens";
import FormUsuario from "@/components/pages/usuarios/FormUsuarios";
import { createClientCookies } from "@/supabase/server";

const cargos = ["super_admin", "financeiro", "portaria"];

export default async function Usuarios() {
    const table = "dimusuario";
    const link = "/admin/usuario";
    const supabase = await createClientCookies();
    let cargosFiltro = cargos;

    const {
        data: { session },
    } = await supabase.auth.getSession();
    let lista;

    if (session?.user.app_metadata.cargo === "super_admin") {
        const { data } = await getItens("dimusuario");
        lista = data;
    } else {
        const { data } = await supabase.from("dimusuario").select("*").eq("id", session?.user.id);
        lista = data;
        cargosFiltro = cargosFiltro.filter((v) => session?.user.app_metadata.cargo === v);
    }

    const usuario = lista as UsuarioInterface[];
    const cargosDrop = cargosFiltro.map((v) => ({ id: v, nome: v }));
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
                    <FormUsuario cargosDrop={cargosDrop} />
                </ModalBase>
                {/* <DeletarConfig<UsuarioInterface> keyName="nome" table={table} link={link} icon={<UserRoundX />} /> */}
            </Suspense>
        </>
    );
}

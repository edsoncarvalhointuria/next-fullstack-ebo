"use server";

import { createClientCookies } from "@/supabase/server";

export async function searchCredenciais(pesquisa: string, tipo?: string) {
    const supabase = await createClientCookies();

    if (tipo) {
        const { data, error } = await supabase.from("vw_checkin_response").select("*").eq(tipo, pesquisa);
        console.log(error);
        if (error) throw new Error("Houve um erro ao pesquisar");
        return data;
    }

    const { data, error } = await supabase
        .from("vw_checkin_response")
        .select("*")
        .or(`nome.ilike.%${pesquisa}%,email.ilike.%${pesquisa}%,cpf_comprador.ilike.%${pesquisa}%`);

    if (error) throw new Error("Houve um erro ao pesquisar");
    return data;
}

export async function fazerCheckin(id_credencial: string | number) {
    const supabase = await createClientCookies();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("factcheckin").insert({ id_credencial, id_usuario: user?.id });
}

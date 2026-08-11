"use server";

import { TableNames, TAGS_CACHE } from "@/constants/Tables";
import { createClientCookies } from "@/supabase/server";
import { AdminUserAttributes, createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";

export async function getItens(table: TableNames) {
    "use cache";
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_BROWSER_API_KEY!);
    cacheTag(TAGS_CACHE[table]!);
    cacheLife("hours");

    return supabase.from(table).select("*");
}

export async function getItemAtivo(table: TableNames) {
    "use cache";
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_BROWSER_API_KEY!);
    cacheTag(TAGS_CACHE[table]!);
    cacheLife("hours");

    return supabase.from(table).select("*").eq("is_ativo", true);
}

export async function getItensFunction(table: TableNames) {
    "use cache";
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_BROWSER_API_KEY!);
    cacheTag(TAGS_CACHE[table]!);
    cacheLife("minutes");

    return supabase.rpc(table);
}

export async function getItemById(table: TableNames, id: string | number) {
    const supabase = await createClientCookies();
    const { data } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
    return data;
}

export async function updateItem(table: TableNames, values: { [key: string]: any }, id: string | number) {
    const supabase = await createClientCookies();
    const { success, error } = await supabase.from(table).update(values).eq("id", id);

    if (success) revalidateTag(TAGS_CACHE[table]!, { expire: 0 });

    return { success, error };
}

export async function addItem(table: TableNames, values: { [key: string]: any }) {
    const supabase = await createClientCookies();
    const { success, error } = await supabase.from(table).insert(values);
    if (success) revalidateTag(TAGS_CACHE[table]!, { expire: 0 });

    return { success, error };
}

export async function addUsuario(email: string, password: string, cargo: string, isAtivo: boolean) {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVER_API_KEY!);
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        ban_duration: isAtivo ? "none" : "876000h",
    });

    if (error) {
        console.log(error);
        return { success: false, message: "Houve um erro" };
    }

    await supabase.from("dimusuario").insert({
        id: data.user.id,
        nome: email,
        nivel: cargo,
        is_ativo: isAtivo,
    });

    revalidateTag(TAGS_CACHE["dimusuario"], { expire: 0 });
    return { success: true, message: "Sucesso" };
}

export async function updateUsuario(id: string, isAtivo: boolean, email?: string, cargo?: string, password?: string) {
    if (!email && !cargo && !password) return { success: false, message: "Nenhum item" };

    const objAuth: AdminUserAttributes = { ban_duration: isAtivo ? "none" : "876000h" };
    const obj = { is_ativo: isAtivo } as any;

    if (email) {
        objAuth.email = email;
        obj.nome = email;
    }
    if (cargo) obj.nivel = cargo;
    if (password) objAuth.password = password;

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVER_API_KEY!);

    const { error } = await supabase.auth.admin.updateUserById(id, objAuth);

    if (error) return { success: false, message: "Houve um erro" };

    const { error: e } = await supabase.from("dimusuario").update(obj).eq("id", id);
    if (e) return { success: false, message: "Houve um erro" };

    revalidateTag(TAGS_CACHE["dimusuario"], { expire: 0 });

    return { success: true, message: "Sucesso!" };
}

export async function removeItem(table: TableNames, id: string) {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVER_API_KEY!);
    const { success } = await supabase.from(table).delete().eq("id", id);
    if (success) revalidateTag(TAGS_CACHE[table]!, { expire: 0 });
    return success;
}

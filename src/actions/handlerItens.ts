"use server";

import { TableNames, TAGS_CACHE } from "@/constants/Tables";
import { createClientCookies } from "@/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";

export async function getItens(table: TableNames) {
    "use cache";
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_BROWSER_API_KEY!);
    cacheTag(TAGS_CACHE[table]!);
    cacheLife("hours");

    return supabase.from(table).select("*");
}

export async function getItensFunction(table: TableNames) {
    "use cache";
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_BROWSER_API_KEY!);
    cacheTag(TAGS_CACHE[table]!);
    cacheLife("hours");

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

export async function removeItem(table: TableNames, id: string) {
    const supabase = await createClientCookies();
    const { success } = await supabase.from(table).delete().eq("id", id);
    if (success) revalidateTag(TAGS_CACHE[table]!, { expire: 0 });
    return success;
}

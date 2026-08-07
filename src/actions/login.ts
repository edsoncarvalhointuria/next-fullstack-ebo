"use server";

import { createClientCookies } from "@/supabase/server";
import { redirect } from "next/navigation";

export default async function login(email: string, senha: string) {
    const supabase = await createClientCookies();

    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) {
        console.log(error);
        return { success: false };
    }

    redirect("/admin");
}

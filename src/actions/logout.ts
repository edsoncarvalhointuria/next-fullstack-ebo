"use server";

import { createClientCookies } from "@/supabase/server";
import { redirect } from "next/navigation";

export default async function logout() {
    const supabase = await createClientCookies();

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.log(error);
        return { success: false };
    }

    redirect("/admin/login");
}

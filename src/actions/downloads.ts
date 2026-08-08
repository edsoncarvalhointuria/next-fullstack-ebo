"use server";

import { createClientCookies } from "@/supabase/server";
import Papa from "papaparse";

export async function downloadCSVTransacoes() {
    const supabase = await createClientCookies();
    const { data } = await supabase.from("vw_download_transacoes").select("*");

    const csv = Papa.unparse(data || [], {
        quotes: true,
        delimiter: ";",
    });

    return csv;
}

export async function downloadCSVCredenciais() {
    const supabase = await createClientCookies();
    const { data } = await supabase.from("vw_download_credenciais").select("*");

    const csv = Papa.unparse(
        (data || []).sort((a, b) => a["Congregação Título"].localeCompare(b["Congregação Título"])),
        {
            quotes: true,
            delimiter: ";",
        },
    );

    return csv;
}

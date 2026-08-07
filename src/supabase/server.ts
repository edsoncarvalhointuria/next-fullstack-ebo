import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClientCookies() {
    const cookie = await cookies();

    return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_BROWSER_API_KEY!, {
        cookies: {
            getAll: () => cookie.getAll(),

            setAll: (cookiesToSet, _headers) => {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => cookie.set(name, value, options));
                } catch {}
            },
        },
    });
}

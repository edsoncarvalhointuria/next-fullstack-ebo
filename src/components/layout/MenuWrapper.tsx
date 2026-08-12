import { createClientCookies } from "@/supabase/server";
import Menu from "./Menu";

export default async function WrapperMenu() {
    const supabase = await createClientCookies();
    const {
        data: { session },
    } = await supabase.auth.getSession();
    const isPortaria = session?.user.app_metadata.cargo === "portaria";

    return <Menu isPortaria={isPortaria} />;
}

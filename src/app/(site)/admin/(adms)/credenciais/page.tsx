import { redirect } from "next/navigation";

export default async function Credenciais() {
    redirect("/admin/credenciais/lista");
}

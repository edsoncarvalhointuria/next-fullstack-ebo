import Acordeao from "@/components/ui/Acordeao";
import { createClient } from "@supabase/supabase-js";

export default async function FAQHome() {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_BROWSER_API_KEY!);
    const perguntas = (await supabase.from("dimfaq").select("*").eq("is_ativo", true)).data;

    return (
        <section className="home-faq">
            <h2 className="home-faq__title">Dúvidas</h2>

            <div className="home-faq__lista">
                {perguntas
                    ?.sort((a, b) => a.ordem - b.ordem)
                    .map((v, i) => (
                        <Acordeao className="home-faq__acordeao" pergunta={v.pergunta} resposta={v.resposta} key={i} />
                    ))}
            </div>
        </section>
    );
}

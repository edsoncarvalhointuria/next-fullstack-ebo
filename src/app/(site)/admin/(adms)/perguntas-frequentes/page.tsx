import MotionMain from "@/components/layout/MotionMain";
import { ArrowUpDown, BadgeQuestionMark, MessageCircleQuestionMark, Trash2 } from "lucide-react";
import BotaoAdd from "@/components/ui/btns/BotaoAdd";
import { BaseCards } from "@/components/pages/config-site/BaseConfig";
import ListaPerguntas from "@/components/pages/perguntas-frenquentes/ListaPerguntas";
import { Suspense } from "react";
import ModalBase from "@/components/ui/modal/ModalBase";
import { FormFAQ } from "@/components/pages/perguntas-frenquentes/FormsPergunta";
import OrdemPerguntas from "@/components/pages/perguntas-frenquentes/OrdemPerguntas";
import BotaoHeaderContainer from "@/components/ui/btns/BotaoHeaderContainer";
import { getItens } from "@/actions/handlerItens";
import "./perguntas-frequentes.scss";
import DeletarConfig from "@/components/pages/config-site/DeletarConfig";

export default async function PerguntasFrequentes() {
    const link = "/admin/perguntas-frequentes";
    const { data } = await getItens("dimfaq");
    const perguntas = data as FAQInterface[];

    return (
        <>
            <MotionMain className="perguntas-frequentes">
                <section className="perguntas-frequentes__header">
                    <h1>
                        <i aria-hidden="true">
                            <BadgeQuestionMark size={34} />
                        </i>
                        <span>FAQ</span>
                    </h1>

                    <BotaoHeaderContainer>
                        <BotaoAdd title="Cadastrar Nova Pergunta" link="modal=form" />
                        <BotaoAdd
                            className="perguntas-frequentes__reordenar"
                            title="Reordenar"
                            link="modal=reordenar"
                            icon={<ArrowUpDown />}
                        />
                    </BotaoHeaderContainer>
                </section>

                <BaseCards itens={perguntas.map((v) => ({ ...v, nome: v.pergunta }))} />

                <ListaPerguntas perguntas={perguntas} />
            </MotionMain>

            <Suspense>
                <ModalBase keyName="form" title="Perguntas" icon={<MessageCircleQuestionMark size={34} />}>
                    <FormFAQ />
                </ModalBase>

                <OrdemPerguntas perguntas={perguntas} link={link} />

                <DeletarConfig<FAQInterface>
                    icon={<Trash2 size={34} />}
                    keyName="pergunta"
                    table={"dimfaq"}
                    link={link}
                />
            </Suspense>
        </>
    );
}

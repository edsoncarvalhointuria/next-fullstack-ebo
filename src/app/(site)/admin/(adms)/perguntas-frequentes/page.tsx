"use client";
import MotionMain from "@/components/layout/MotionMain";
import "./perguntas-frequentes.scss";
import {
    ArrowUpDown,
    BadgeQuestionMark,
    MessageCircleQuestionMark,
} from "lucide-react";
import BotaoAdd from "@/components/ui/btns/BotaoAdd";
import { BaseCards } from "@/components/pages/config-site/BaseConfig";
import ListaPerguntas from "@/components/pages/perguntas-frenquentes/ListaPerguntas";
import { Suspense } from "react";
import ModalBase from "@/components/ui/modal/ModalBase";
import { FormFAQ } from "@/components/pages/perguntas-frenquentes/FormsPergunta";
import OrdemPerguntas from "@/components/pages/perguntas-frenquentes/OrdemPerguntas";
import DeletarPerguntas from "@/components/pages/perguntas-frenquentes/DeletarPerguntas";
import BotaoHeaderContainer from "@/components/ui/btns/BotaoHeaderContainer";
import { useDataContext } from "@/contexts/DataContext";

export default function PerguntasFrequentes() {
    const { ingressos } = useDataContext();
    return (
        <>
            <MotionMain className="perguntas-frequentes">
                <section className="perguntas-frequentes__header">
                    <h1>
                        <i>
                            <BadgeQuestionMark size={34} />
                        </i>
                        <span>FAQ</span>
                    </h1>

                    <BotaoHeaderContainer>
                        <BotaoAdd
                            title="Cadastrar Nova Pergunta"
                            link="modal=form"
                        />
                        <BotaoAdd
                            className="perguntas-frequentes__reordenar"
                            title="Reordenar"
                            link="modal=reordenar"
                            icon={<ArrowUpDown />}
                        />
                    </BotaoHeaderContainer>
                </section>

                <BaseCards
                    itens={ingressos.map((v) => ({ ...v, nome: v.nome_tipo }))}
                />

                <ListaPerguntas />
            </MotionMain>

            <Suspense>
                <ModalBase
                    keyName="form"
                    title="Perguntas"
                    icon={<MessageCircleQuestionMark size={34} />}
                >
                    <FormFAQ />
                </ModalBase>

                <OrdemPerguntas />
                <DeletarPerguntas />
            </Suspense>
        </>
    );
}

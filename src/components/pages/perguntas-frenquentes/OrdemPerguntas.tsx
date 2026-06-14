"use client";

import Reordernar from "@/components/ui/Reordernar";
import { testePerguntas } from "../../../../config/datasTeste";
import ModalBase from "@/components/ui/modal/ModalBase";
import { MessageCircleQuestionMark } from "lucide-react";
import { useDataContext } from "@/contexts/DataContext";

export default function OrdemPerguntas() {
    const { perguntas, addPergunta } = useDataContext();
    return (
        <ModalBase
            keyName="reordenar"
            title="Perguntas"
            icon={<MessageCircleQuestionMark size={34} />}
        >
            {(closeModal) => (
                <Reordernar
                    keyName="pergunta"
                    lista={perguntas}
                    onSave={(v) => {
                        const lista = v.map((v, i) => ({ ...v, ordem: i }));
                        addPergunta(lista);
                        console.log(v);
                        closeModal();
                    }}
                />
            )}
        </ModalBase>
    );
}

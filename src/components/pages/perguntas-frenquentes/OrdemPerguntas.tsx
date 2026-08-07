"use client";

import { updateItem } from "@/actions/handlerItens";
import Reordenar from "@/components/ui/Reordernar";
import ModalBase from "@/components/ui/modal/ModalBase";
import { MessageCircleQuestionMark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrdemPerguntas({ perguntas, link }: { perguntas: FAQInterface[]; link: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    return (
        <ModalBase keyName="reordenar" title="Perguntas" icon={<MessageCircleQuestionMark size={34} />}>
            <div
                className={`perguntas-frequentes__reordenar ${isLoading ? "perguntas-frequentes__reordenar--loading" : ""}`}
            >
                <Reordenar
                    keyName="pergunta"
                    lista={perguntas.sort((a, b) => a.ordem - b.ordem)}
                    onSave={async (v) => {
                        setIsLoading(true);
                        Promise.all(v.map((v, i) => updateItem("dimfaq", { ordem: i }, v.id))).then(() => {
                            setIsLoading(false);
                            router.push(link);
                        });
                    }}
                />
            </div>
        </ModalBase>
    );
}

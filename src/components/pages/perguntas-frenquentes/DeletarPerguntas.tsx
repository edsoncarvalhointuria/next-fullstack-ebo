"use client";
import ModalDeletar, {
    ModalDeletarText,
} from "@/components/ui/modal/ModalDeletar";
import { useSearchParams } from "next/navigation";
import { testePerguntas } from "../../../../config/datasTeste";
import { Trash2 } from "lucide-react";

export default function DeletarPerguntas() {
    const params = useSearchParams();
    const id = params.get("id");
    const item = testePerguntas.find((v) => String(v.id) === id);
    if (!item) return;

    return (
        <ModalDeletar
            keyName="del"
            onConfirm={() => console.log("aaaa")}
            title={"Deletar?"}
            icon={<Trash2 />}
            text={
                <ModalDeletarText
                    text={
                        <>
                            Tem certeza que deseja deletar a pergunta:{" "}
                            <span>{item.pergunta}</span>
                        </>
                    }
                />
            }
        />
    );
}

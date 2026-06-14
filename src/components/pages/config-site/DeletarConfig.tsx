"use client";

import ModalDeletar, {
    ModalDeletarText,
} from "@/components/ui/modal/ModalDeletar";
import { ReactNode } from "react";
import { ItensListaDados } from "./ListaDados";
import { useSearchParams } from "next/navigation";

export default function DeletarConfig<T extends { id: string | number }>({
    icon,
    lista,
    onConfirm,
    keyName = "nome" as keyof T,
}: {
    icon: ReactNode;
    lista: T[];
    keyName?: keyof T;
    onConfirm: (lista: T[]) => void;
}) {
    const params = useSearchParams();
    const id = params.get("id");
    const index = lista.findIndex((v) => String(v.id) === id);
    if (index === -1) return null;

    return (
        <ModalDeletar
            keyName="del"
            onConfirm={() => {
                const list = [...lista];
                list.splice(index, 1);
                onConfirm(list);
            }}
            title="Deletar?"
            icon={icon}
            text={
                <ModalDeletarText
                    text={
                        <>
                            Tem certeza que deseja deletar:{" "}
                            <span>{`${lista[index][keyName]}`}</span> ?
                        </>
                    }
                />
            }
        />
    );
}

"use client";

import ModalDeletar, { ModalDeletarText } from "@/components/ui/modal/ModalDeletar";
import { ReactNode, useEffect, useState } from "react";
import { ItensListaDados } from "./ListaDados";
import { useRouter, useSearchParams } from "next/navigation";
import useGetSearchId from "@/hooks/useGetSearchId";
import { getItemById, removeItem } from "@/actions/handlerItens";
import { TableNames } from "@/constants/Tables";

export default function DeletarConfig<T extends { id: string | number }>({
    icon,
    table,
    link,
    keyName = "nome" as keyof T,
}: {
    icon: ReactNode;
    table: TableNames;
    link: string;
    keyName?: keyof T;
}) {
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const id = useGetSearchId();

    useEffect(() => {
        if (!id) return;
        getItemById(table, id)
            .then((v) => {
                if (!v) return;
                setTitle(v[keyName]);
            })
            .catch((v) => console.log("deu erro", v));
    }, [id]);

    if (!title) return <></>;
    return (
        <ModalDeletar
            keyName="del"
            isLoading={isLoading}
            onConfirm={() => {
                setIsLoading(true);
                removeItem(table, id!)
                    .then(() => router.push(link))
                    .catch((err) => console.log("deu esse erro", err))
                    .finally(() => setIsLoading(false));
            }}
            title="Deletar?"
            icon={icon}
            text={
                <ModalDeletarText
                    text={
                        <>
                            Tem certeza que deseja deletar: <span>{title}</span> ?
                        </>
                    }
                />
            }
        />
    );
}

"use client";

import { updateCapacidade } from "@/actions/handlerItens";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

export default function FormCapacidade({ capacidade, id }: { capacidade: number; id: string }) {
    const router = useRouter();
    const $input = useRef<HTMLInputElement>(null);
    const onUpdate = useCallback(async () => {
        await updateCapacidade({ quantidade: Number($input.current?.value || 0) }, id);
        router.refresh();
    }, []);

    return (
        <>
            <div className="capacidade-maxima__input">
                <input
                    ref={$input}
                    type="number"
                    name="capacidade-maxima-input"
                    id="capacidade-maxima-input"
                    defaultValue={capacidade}
                />
                <p className="capacidade-maxima__input-aviso">
                    Quando o total de inscrições aprovadas e pendentes atingir este limite, o sistema pausará
                    automaticamente as vendas públicas
                </p>
            </div>

            <button type="button" title="salvar nova capacidade" onClick={onUpdate}>
                Atualizar Capacidade
            </button>
        </>
    );
}

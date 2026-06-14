"use client";

import { Reorder } from "framer-motion";
import { GripHorizontal, Save } from "lucide-react";
import { useState } from "react";
import "./reordenar.scss";

interface ReordenarItem {
    ordem: number;
    id: number | string;
}
interface ReordenarProps<T> {
    lista: T[];
    keyName: keyof T;
    onSave: (novaLista: T[]) => void;
}

export default function Reordernar<T extends ReordenarItem>({
    lista,
    onSave,
    keyName,
}: ReordenarProps<T>) {
    const [listaOrdernada, setListaOrdenada] = useState(lista);
    return (
        <div className="reordenar">
            <Reorder.Group
                className="reordenar__ul"
                onReorder={setListaOrdenada}
                values={listaOrdernada}
            >
                {listaOrdernada.map((v, i) => (
                    <Reorder.Item
                        value={v}
                        key={v.id}
                        className="reordenar__li"
                    >
                        <span className="reordenar__li-numero">{i + 1} - </span>
                        <p className="reordenar__li-text">{`${v[keyName]}`}</p>
                        <span className="reordenar__li-icon">
                            <GripHorizontal />
                        </span>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <div className="reordenar__salvar">
                <button
                    className="reordenar__btn"
                    onClick={() => onSave(listaOrdernada)}
                >
                    <i>
                        <Save />
                    </i>
                    <span>Salvar</span>
                </button>
            </div>
        </div>
    );
}

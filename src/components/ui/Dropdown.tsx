"use client";

import { animate, AnimatePresence, motion, Variants } from "framer-motion";
import { CircleChevronDown, SearchX } from "lucide-react";
import React, {
    use,
    useDeferredValue,
    useEffect,
    useMemo,
    useState,
} from "react";
import "./dropdown.scss";

export interface ItemDropdownDefault {
    id: string | number;
    nome: string;
}

interface DropdownProps<T> {
    lista: T[] | Promise<T[]>;
    placeholder?: string;
    currentValue: null | undefined | T;
    onSelected: ((v: T) => void) | ((id: string, v: T) => void);
    classError?: string;
    className?: string;
    idObj?: string;
}

const variantsArrow: Variants = {
    animate: (isOpen: boolean) => (isOpen ? { rotate: 180 } : { rotate: 0 }),
};

const variantsLista: Variants = {
    initial: { opacity: 0, y: -20, height: 0 },
    animate: { opacity: 1, y: 0, height: "auto" },
    exit: { opacity: 0, y: -20, height: 0 },
};

const IDITEM = "dropdown-item-lista";

function Dropdown<T extends ItemDropdownDefault>({
    lista,
    currentValue,
    onSelected,
    classError,
    className,
    idObj,
    placeholder = "Clique para selecionar",
}: DropdownProps<T>) {
    const itens = lista instanceof Promise ? use(lista) : lista;

    const [pesquisa, setPesquisa] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const p = useDeferredValue(pesquisa);

    const itensMemo = useMemo(() => {
        if (pesquisa)
            return itens.filter(
                (v) =>
                    v.nome.toLocaleLowerCase().includes(p) ||
                    String(v.id).toLocaleLowerCase() === p,
            );
        return itens;
    }, [itens, p]);

    const fechar = () => {
        setPesquisa("");
        setIsOpen(false);
    };

    useEffect(() => {
        if (!isOpen || !currentValue) return;

        document
            .getElementById(`${IDITEM}-${currentValue.id}`)
            ?.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
            });
    }, [isOpen, currentValue]);

    return (
        <div
            className={`dropdown ${className || ""}`}
            onBlur={(e) => {
                const item = e.relatedTarget;

                if (!e.currentTarget?.contains(item)) {
                    fechar();
                }
            }}
        >
            <div className={`dropdown__search ${classError}`}>
                <motion.input
                    type="search"
                    placeholder={isOpen ? "Digite para pesquisar" : placeholder}
                    name="pesquisa"
                    title="selecione a congregação"
                    autoComplete="off"
                    value={isOpen ? pesquisa : currentValue?.nome || ""}
                    onChange={(e) => setPesquisa(e.target.value.toLowerCase())}
                    onFocus={() => setIsOpen(true)}
                />

                <button
                    title="Fechar Dropdown"
                    type="button"
                    onClick={() => (isOpen ? fechar() : setIsOpen(true))}
                >
                    <motion.i
                        custom={isOpen}
                        variants={variantsArrow}
                        animate="animate"
                    >
                        <CircleChevronDown size={34} />
                    </motion.i>
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div style={{ overflow: "hidden" }}>
                        <motion.div
                            variants={variantsLista}
                            initial={"initial"}
                            animate={"animate"}
                            exit={"exit"}
                            className="dropdown__itens-container"
                        >
                            <div
                                className={`dropdown__itens ${pesquisa !== p ? "dropdown__itens--pesquisando" : ""}`}
                            >
                                {itensMemo.length > 0 ? (
                                    <>
                                        {itensMemo.map((v) => (
                                            <button
                                                className={`dropdown__item ${currentValue?.id === v.id ? "dropdown__item--selected" : ""}`}
                                                key={v.id}
                                                type="button"
                                                title={`Selecionar ${v.nome}`}
                                                onClick={() => {
                                                    if (idObj)
                                                        onSelected(
                                                            idObj as any,
                                                            v,
                                                        );
                                                    else (onSelected as any)(v);
                                                    fechar();
                                                }}
                                                id={`${IDITEM}-${v.id}`}
                                            >
                                                <p>{v.nome}</p>
                                            </button>
                                        ))}
                                    </>
                                ) : (
                                    <button
                                        className={`dropdown__item dropdown__item--not-found`}
                                        title="Nenhum item encontrado"
                                        type="button"
                                    >
                                        <i>
                                            <SearchX size={24} />
                                        </i>
                                        <p>Nenhum item encontrado</p>
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default React.memo(Dropdown);

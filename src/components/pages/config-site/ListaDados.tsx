"use client";

import { ReactNode, useDeferredValue, useMemo, useState } from "react";
import Search from "@/components/ui/Search";
import Dropdown, { ItemDropdownDefault } from "@/components/ui/Dropdown";
import {
    Ban,
    Briefcase,
    CircleCheck,
    CloudOff,
    Cog,
    Power,
    Trash,
    UserRoundPen,
} from "lucide-react";
import useResize from "@/hooks/useResize";
import BotaoAcoes from "@/components/ui/btns/BotaoAcoes";
import "./lista-dados.scss";

type tipos = "todos" | "ativos" | "inativos";
export interface ItensListaDados {
    id: string | number;
    nome: string;
    is_ativo: boolean;
}
interface ListaDadosProps<T> {
    itens: T[];
    children: (itensFiltrados: T[]) => ReactNode;
    onFilter: (pesquisa: string, listaAtual: T[]) => T[];
}
interface ListaDadosItensProps {
    colunas?: { icon: ReactNode; title: string }[];
    itens: ItensListaDados[];
}

const defaultColumns = [
    { icon: <Briefcase />, title: "Nome" },
    { icon: <Power />, title: "Ativo" },
];
const opcoes = [
    { id: "todos", nome: "Todos" },
    { id: "ativos", nome: "Ativos" },
    { id: "inativos", nome: "Inativos" },
];

export const ListaVazia = () => {
    return (
        <div className="lista-dados__lista--vazio">
            <i>
                <CloudOff />
            </i>
            <p>Nenhum Item encontrado</p>
        </div>
    );
};
const ListaDadosCard = ({ id, is_ativo, nome }: ItensListaDados) => {
    return (
        <div
            className={`lista-dados__lista__card ${is_ativo ? "lista-dados__lista__card--ativo" : "lista-dados__lista__card--inativo"}`}
        >
            <h3>{nome}</h3>
            {is_ativo ? (
                <p className="lista-dados__lista__card-ativo">
                    <i>
                        <CircleCheck />
                    </i>
                    <span>Ativo</span>
                </p>
            ) : (
                <p className="lista-dados__lista__card-inativo">
                    <i>
                        <Ban />
                    </i>
                    <span>Inativo</span>
                </p>
            )}

            <div className="lista-dados__lista__card-buttons">
                <BotaoAcoes
                    acao="edit"
                    link={`?modal=form&id=${id}`}
                    icon={<UserRoundPen />}
                />
                <BotaoAcoes acao="del" link={`?modal=del&id=${id}`} />
            </div>
        </div>
    );
};
const ListaDadosItens = ({
    colunas = defaultColumns,
    itens,
}: ListaDadosItensProps) => {
    const isMobile = useResize(750);
    return (
        <div
            className={`lista-dados__lista ${isMobile ? "lista-dados__lista--mobile" : ""}`}
        >
            {isMobile ? (
                itens.map((v) => <ListaDadosCard key={v.id} {...v} />)
            ) : (
                <table className="lista-dados__lista__table">
                    <thead>
                        <tr>
                            {colunas.map((v) => (
                                <th key={v.title}>
                                    <div className="lista-dados__lista__coluna">
                                        <i>{v.icon}</i>
                                        <span>{v.title}</span>
                                    </div>
                                </th>
                            ))}
                            <th>
                                <div className="lista-dados__lista__coluna">
                                    <i>
                                        <Cog />
                                    </i>
                                    <span>Ações</span>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {itens.map((v) => (
                            <tr key={v.id} className="lista-dados__lista__item">
                                <td>
                                    <p className="lista-dados__lista__item-nome">
                                        {v.nome}
                                    </p>
                                </td>
                                <td>
                                    {v.is_ativo ? (
                                        <i className="lista-dados__lista__item-boolean lista-dados__lista__item-boolean--ativo">
                                            <CircleCheck />
                                        </i>
                                    ) : (
                                        <i className="lista-dados__lista__item-boolean lista-dados__lista__item-boolean--inativo">
                                            <Ban />
                                        </i>
                                    )}
                                </td>
                                <td>
                                    <div className="lista-dados__lista__item-acoes">
                                        <BotaoAcoes
                                            acao="edit"
                                            link={`?modal=form&id=${v.id}`}
                                            icon={<UserRoundPen />}
                                        />
                                        <BotaoAcoes
                                            acao="del"
                                            link={`?modal=del&id=${v.id}`}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
export const ListaDadosItensDefault = ({
    itens,
}: {
    itens: ItensListaDados[];
}) => {
    return (
        <ListaDados
            itens={itens}
            onFilter={(p, l) => {
                return l.filter((v) => v.nome.toLowerCase().includes(p));
            }}
        >
            {(listaFiltrada) => {
                return <ListaDadosItens itens={listaFiltrada} />;
            }}
        </ListaDados>
    );
};

export default function ListaDados<
    T extends { is_ativo: boolean; order?: number },
>({ itens, onFilter, children }: ListaDadosProps<T>) {
    const [currentDrop, setCurrentDrop] = useState<ItemDropdownDefault>({
        id: "todos",
        nome: "Todos",
    });
    const [pesquisa, setPesquisa] = useState("");
    const p = useDeferredValue(pesquisa);

    const itensMemo = useMemo(() => {
        let c = itens;

        if (currentDrop.id !== "todos") {
            c = c.filter((v) =>
                currentDrop.id === "ativos"
                    ? v.is_ativo === true
                    : v.is_ativo === false,
            );
        }
        if (p) c = onFilter(p, c);
        return c;
    }, [currentDrop, p, itens]);
    return (
        <section className="lista-dados">
            <div className="lista-dados__filtros">
                <div className="lista-dados__filtros-filtro">
                    <Search placeholder="Pesquisar" onSearch={setPesquisa} />
                </div>
                <div className="lista-dados__filtros-filtro">
                    <Dropdown
                        lista={opcoes}
                        currentValue={currentDrop}
                        onSelected={setCurrentDrop}
                    />
                </div>
            </div>

            {itensMemo.length > 0 ? children(itensMemo) : <ListaVazia />}
        </section>
    );
}

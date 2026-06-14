"use client";

import Acordeao from "@/components/ui/Acordeao";
import { testePerguntas } from "../../../../config/datasTeste";
import ListaDados from "../config-site/ListaDados";
import Link from "next/link";
import { SquarePen, Trash } from "lucide-react";
import BotaoAcoes from "@/components/ui/btns/BotaoAcoes";
import { useDataContext } from "@/contexts/DataContext";

export default function ListaPerguntas() {
    const { perguntas } = useDataContext();
    return (
        <section className="perguntas-frequentes__body">
            <ListaDados
                itens={perguntas}
                onFilter={(p, l) =>
                    l.filter((v) => {
                        const pAtualizado = p.replace(/[\u0300-\u036f]/g, "");
                        const perguntaAtualizado = v.pergunta
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase();
                        const respostaAtualizado = v.resposta
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase();

                        return (
                            perguntaAtualizado.includes(pAtualizado) ||
                            respostaAtualizado.includes(pAtualizado)
                        );
                    })
                }
            >
                {(listaFiltrada) => {
                    return (
                        <div className="perguntas-frequentes__lista">
                            {listaFiltrada.map((v) => (
                                <Acordeao
                                    key={v.id}
                                    pergunta={v.pergunta}
                                    resposta={
                                        <div className="perguntas-frequentes__answer">
                                            <p>{v.resposta}</p>

                                            <div className="perguntas-frequentes__answer-btns">
                                                <BotaoAcoes
                                                    acao="edit"
                                                    link={`?modal=form&id=${v.id}`}
                                                />
                                                <BotaoAcoes
                                                    acao="del"
                                                    link={`?modal=del&id=${v.id}`}
                                                />
                                            </div>
                                        </div>
                                    }
                                    className="perguntas-frequentes__question"
                                />
                            ))}
                        </div>
                    );
                }}
            </ListaDados>
        </section>
    );
}

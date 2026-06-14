"use client";
import MotionMain from "@/components/layout/MotionMain";
import { BaseHeader } from "@/components/pages/config-site/BaseConfig";
import {
    NotebookPen,
    Ticket,
    TicketPlus,
    Tickets,
    TicketX,
    Trash2,
    UsersRound,
} from "lucide-react";
import { toCurrency } from "@/lib/toCurrency";
import "./ingressos.scss";
import BotaoAcoes from "@/components/ui/btns/BotaoAcoes";
import ModalBase from "@/components/ui/modal/ModalBase";
import FormGerenciarIngressos from "@/components/pages/gerenciar-ingressos/FormGerenciarIngressos";
import { Suspense } from "react";
import DeletarConfig from "@/components/pages/config-site/DeletarConfig";
import { useDataContext } from "@/contexts/DataContext";

export default function GerenciarIngressos() {
    const { addIngresso, ingressos } = useDataContext();
    return (
        <>
            <MotionMain className="gerenciar-ingressos">
                <BaseHeader
                    icon={<Ticket size={34} />}
                    title="Ingressos"
                    buttonTitle="Cadastrar Novo Ingresso"
                    buttonIcon={<TicketPlus />}
                />

                <section className="gerenciar-ingressos__ingressos">
                    {ingressos.map((v) => (
                        <div
                            className={`gerenciar-ingressos__ingresso ${!v.is_ativo ? "gerenciar-ingressos__ingresso--inativo" : ""}`}
                            key={v.id}
                        >
                            <div className="gerenciar-ingressos__ingresso__header">
                                <h2 className="gerenciar-ingressos__ingresso__title">
                                    {v.nome_tipo}
                                </h2>

                                <h3 className="gerenciar-ingressos__ingresso__preco">
                                    {toCurrency(Number(v.preco))}
                                </h3>
                            </div>

                            <div className="gerenciar-ingressos__ingresso__infos">
                                <p className="gerenciar-ingressos__ingresso__qtd">
                                    <span>
                                        <i>
                                            <UsersRound />
                                        </i>
                                        Quantidade de Pessoas:{" "}
                                    </span>
                                    <strong>{v.quantidade_pessoas}</strong>
                                </p>

                                <p className="gerenciar-ingressos__ingresso__descricao">
                                    <strong>{v.descricao}</strong>
                                </p>

                                {v?.observacao && (
                                    <p className="gerenciar-ingressos__ingresso__observacao">
                                        <span>
                                            <i>
                                                <NotebookPen />
                                            </i>
                                            Obs:
                                        </span>
                                        <em>{v.observacao}</em>
                                    </p>
                                )}

                                {v?.data_fim_vendas && (
                                    <p className="gerenciar-ingressos__ingresso__data">
                                        Data Encerramento:{" "}
                                        <data value={v.data_fim_vendas}>
                                            <strong>
                                                {new Date(
                                                    v.data_fim_vendas,
                                                ).toLocaleDateString("pt-br")}
                                            </strong>
                                        </data>
                                    </p>
                                )}
                            </div>

                            <div className="gerenciar-ingressos__ingresso__footer">
                                <BotaoAcoes
                                    acao="edit"
                                    link={`?modal=form&id=${v.id}`}
                                />

                                <BotaoAcoes
                                    acao="del"
                                    link={`?modal=del&id=${v.id}`}
                                    icon={<Trash2 />}
                                />
                            </div>
                        </div>
                    ))}
                </section>
            </MotionMain>

            <Suspense>
                <ModalBase keyName="form" title="Ingressos" icon={<Tickets />}>
                    <FormGerenciarIngressos />
                </ModalBase>
                <DeletarConfig
                    keyName="nome_tipo"
                    lista={ingressos}
                    onConfirm={addIngresso}
                    icon={<TicketX />}
                />
            </Suspense>
        </>
    );
}

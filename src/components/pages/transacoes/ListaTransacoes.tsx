"use client";

import {
    ReactNode,
    useCallback,
    useDeferredValue,
    useMemo,
    useState,
} from "react";
import Search from "@/components/ui/Search";
import Dropdown, { ItemDropdownDefault } from "@/components/ui/Dropdown";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
    Banknote,
    BanknoteX,
    CalendarCheck,
    ChevronDown,
    Church,
    CircleCheck,
    CircleUserRound,
    CircleX,
    Clock,
    CloudAlert,
    DollarSign,
    FileSearchCorner,
    HandCoins,
    IdCard,
    ListRestart,
    Shuffle,
    Tag,
    Ticket,
    TicketCheck,
} from "lucide-react";
import { toCurrency } from "@/lib/toCurrency";
import Link from "next/link";
import {
    Card,
    CardOpcao,
    CardOpcaoProps,
    CardProps,
} from "@/components/ui/Card";
import { BaseCardsContainer } from "../config-site/BaseConfig";
import {
    ChartBarPorCargos,
    ChartFaturamento,
    ChartPiePagamentos,
} from "./ChartsTransacoes";
import useResize from "@/hooks/useResize";
import { useSearchParams } from "next/navigation";
import { useDataContext } from "@/contexts/DataContext";

interface TableHeaderItem {
    icon?: ReactNode;
    title?: string;
}
interface TableButton {
    link: string;
    title: string;
    icon: ReactNode;
}

const metodosPagamento: ItemDropdownDefault[] = [
    { id: "todos", nome: "Todos" },
    { id: "pix", nome: "PIX" },
    { id: "boleto", nome: "Boleto" },
    { id: "cartao", nome: "Cartão" },
    { id: "dinheiro", nome: "Dinheiro" },
];
const statusPedido: ItemDropdownDefault[] = [
    { id: "todos", nome: "Todos" },
    { id: "aprovado", nome: "Aprovado" },
    { id: "pendente", nome: "Pendente" },
    { id: "cancelado", nome: "Cancelado" },
];
const bars = [
    { dataKey: "aprovado", fill: "var(--brand-success)" },
    { dataKey: "cancelado", fill: "var(--brand-danger)" },
    { dataKey: "pendente", fill: "var(--brand-warning)" },
];

const variansDrop: Variants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
};
const variansArrow: Variants = {
    initial: { rotate: 0 },
    animate: (isOpen: boolean) => (isOpen ? { rotate: 180 } : { rotate: 0 }),
};

const TableButton = ({ link, title, icon }: TableButton) => {
    return (
        <Link href={link}>
            <i>{icon}</i>
            <span>
                <span>Ir para </span>
                {title}
            </span>
        </Link>
    );
};

const TableDropCardCheckin = ({ data }: { data: string }) => {
    const date = new Date(data);
    const dia = date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });
    const horas = date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });
    return (
        <div className="transacoes__table-container__drop__checkin">
            <i>
                <CalendarCheck />
            </i>
            <p>
                <span>{dia}</span>
                <span>{horas}</span>
            </p>
        </div>
    );
};
const TableDropCard = ({
    checkins,
    nome_titular,
    tipo_ingresso,
    nome_congregacao,
    nome_outra_congregacao,
}: TransacaoResponseCrendencial) => {
    return (
        <div className="transacoes__table-container__drop__card">
            <div className="transacoes__table-container__drop__card-container">
                <p className="transacoes__table-container__drop__tipo-igreja">
                    <i>
                        <Church />
                    </i>
                    <span>{nome_congregacao || nome_outra_congregacao}</span>
                </p>

                <h3 className="transacoes__table-container__drop__nome">
                    {nome_titular}
                </h3>

                <p className="transacoes__table-container__drop__tipo-ingresso">
                    <i>
                        <Ticket />
                    </i>
                    <span>{tipo_ingresso}</span>
                </p>
            </div>

            {checkins.length > 0 ? (
                <div className="transacoes__table-container__drop__checkins">
                    {checkins.map((v) => (
                        <TableDropCardCheckin {...v} key={v.id} />
                    ))}
                </div>
            ) : (
                <div className="transacoes__table-container__drop__checkins-vazio">
                    <p>Ainda não foi realizado nenhum checkin</p>
                </div>
            )}
        </div>
    );
};
const TableDropVazio = () => {
    return (
        <div className="transacoes__table-container__drop__vazio">
            <p>
                <i>
                    <CloudAlert />
                </i>
                <span>As credenciais ainda não foram geradas</span>
            </p>
        </div>
    );
};
const TableItem = ({
    comprador,
    pagamento,
    credenciais,
    data_compra,
}: TransacaoResponse) => {
    const [isOpen, setIsOpen] = useState(false);
    const alterarIsOpen = () => setIsOpen((v) => !v);
    return (
        <div
            className={`transacoes__table-container ${isOpen ? "transacoes__table-container--is-open" : ""}`}
        >
            <div className="transacoes__table-row" onClick={alterarIsOpen}>
                <div className="transacoes__table-item transacoes__table-item__comprador">
                    <p className="transacoes__table-item__comprador-nome">
                        {comprador.nome}
                    </p>
                    <p className="transacoes__table-item__comprador-email">
                        {comprador.email}
                    </p>
                    <p className="transacoes__table-item__comprador-cpf">
                        <strong>{comprador.cpf}</strong>
                    </p>
                </div>

                <div className="transacoes__table-item transacoes__table-item__pagamento">
                    <p className="transacoes__table-item__pagamento-valor">
                        {toCurrency(pagamento.valor_total)}
                    </p>
                    <p className="transacoes__table-item__pagamento-tipo">
                        <strong>{pagamento.metodo_pagamento}</strong>
                    </p>
                </div>

                <div
                    className={`transacoes__table-item transacoes__table-item__status transacoes__table-item__status--${pagamento.status}`}
                >
                    <p>
                        <i>
                            {pagamento.status === "aprovado" ? (
                                <CircleCheck />
                            ) : pagamento.status === "pendente" ? (
                                <Clock />
                            ) : (
                                <CircleX />
                            )}
                        </i>
                        <span>{pagamento.status}</span>
                    </p>
                </div>

                <div className="transacoes__table-item transacoes__table-item__data">
                    <p>
                        {new Date(data_compra).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}
                    </p>
                    <p className="transacoes__table-item__data-hora">
                        {new Date(data_compra).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>

                <div className="transacoes__table-item transacoes__table-item__acao">
                    <motion.p
                        className={`transacoes__table-item__pagamento-status transacoes__table-item__pagamento-status--${pagamento.status}`}
                        variants={variansArrow}
                        custom={isOpen}
                        animate="animate"
                        initial="initial"
                    >
                        <i>
                            <ChevronDown />
                        </i>
                    </motion.p>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="transacoes__table-container__drop--container">
                        <motion.div
                            style={{ overflow: "hidden", height: "100%" }}
                            variants={variansDrop}
                            initial="initial"
                            animate="animate"
                            exit={"exit"}
                            transition={{ ease: "linear" }}
                        >
                            <div
                                className="transacoes__table-container__drop"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {credenciais.length > 0 ? (
                                    <>
                                        <div className="transacoes__table-container__drop__cards">
                                            {credenciais.map((v) => (
                                                <TableDropCard
                                                    {...v}
                                                    key={v.id_credencial}
                                                />
                                            ))}
                                        </div>
                                        <div className="transacoes__table-container__buttons">
                                            <TableButton
                                                link="#"
                                                title="Credenciais"
                                                icon={<IdCard />}
                                            />
                                            <TableButton
                                                link="#"
                                                title="Checkin"
                                                icon={<TicketCheck />}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <TableDropVazio />
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TableHeaderItem = ({ icon, title }: TableHeaderItem) => {
    return (
        <div className="transacoes__table-header__opcao">
            {icon && (
                <>
                    <i>{icon}</i>
                    <span>{title}</span>
                </>
            )}
        </div>
    );
};
const headerItens = [
    { icon: <CircleUserRound />, title: "Comprador" },
    { icon: <HandCoins />, title: "Pagamento" },
    { icon: <FileSearchCorner />, title: "Status" },
    { icon: <CalendarCheck />, title: "Data" },
    {},
];

export function ListaTransacoes() {
    const {
        responsesMemo: { responseTransacoes },
    } = useDataContext();
    const [pesquisa, setPesquisa] = useState("");
    const [drops, setDrops] = useState({
        pgmt: { id: "todos", nome: "todos" },
        stts: { id: "todos", nome: "todos" },
    });
    const p = useDeferredValue(pesquisa);

    const addDrops = useCallback((id: string, obj: ItemDropdownDefault) => {
        setDrops((v) => ({ ...v, [id]: obj }));
    }, []);

    const transacoesMemo = useMemo(() => {
        let c = responseTransacoes;

        if (drops.pgmt.id !== "todos")
            c = c.filter((v) => v.pagamento.metodo_pagamento === drops.pgmt.id);
        if (drops.stts.id !== "todos")
            c = c.filter((v) => v.pagamento.status === drops.stts.id);
        if (p)
            c = c.filter((v) => {
                const { cpf, email } = v.comprador;

                return (
                    cpf.toLowerCase().includes(p) ||
                    email.toLowerCase().includes(p) ||
                    v.credenciais.find((v) =>
                        v.nome_titular.toLowerCase().includes(p),
                    )
                );
            });

        return c;
    }, [p, drops, responseTransacoes]);

    return (
        <>
            <section className="transacoes__lista">
                <div className="transacoes__filtros">
                    <div className="transacoes__filtro transacoes__filtro-search">
                        <Search onSearch={setPesquisa} />
                    </div>
                    <div className="transacoes__filtro transacoes__filtro-drop">
                        <p className="transacoes__filtro-title">
                            Método de Pagamento
                        </p>
                        <Dropdown
                            lista={metodosPagamento}
                            currentValue={drops.pgmt}
                            onSelected={addDrops}
                            placeholder="Método de Pagamento"
                            idObj="pgmt"
                        />
                    </div>
                    <div className="transacoes__filtro transacoes__filtro-drop">
                        <p className="transacoes__filtro-title">
                            Status Pedido
                        </p>
                        <Dropdown
                            lista={statusPedido}
                            currentValue={drops.stts}
                            idObj="stts"
                            onSelected={addDrops}
                            placeholder="Status Pedido"
                        />
                    </div>
                </div>

                <div className="transacoes__table">
                    <div className="transacoes__table-header">
                        {headerItens.map((v, i) => (
                            <TableHeaderItem key={`${v.title}-${i}`} {...v} />
                        ))}
                    </div>

                    <div className="transacoes__table-body">
                        {transacoesMemo.map((v) => (
                            <TableItem {...v} key={v.id_transacao} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export function GraficosTransacoes() {
    const {
        responsesMemo: {
            listaGraficosTransacoes,
            transacoesPorStatus,
            totalArrecadado,
            totalTransacoes,
        },
    } = useDataContext();
    const [filter, setFilter] = useState<{
        cargo: null | string;
        congregacao: null | string;
    }>({ cargo: null, congregacao: null });
    const isMobile = useResize(480);

    const addFilter = useCallback((key: string, name: string) => {
        setFilter((v) => ({
            ...v,
            [key]: (v as any)[key] === name ? null : name,
        }));
    }, []);

    const listaMemo = useMemo(() => {
        let l = listaGraficosTransacoes;
        const listaMap = new Map();
        const faturamentoMap = new Map();

        if (filter.cargo) l = l.filter((v) => v.titular_cargo === filter.cargo);
        if (filter.congregacao)
            l = l.filter((v) =>
                filter.congregacao === "outra"
                    ? !v.titular_congregacao
                    : v.titular_congregacao === filter.congregacao,
            );

        l.forEach((v) => {
            const data = v.data_pedido;
            const metodo = listaMap.get("metodo") || {
                pix: {
                    name: "pix",
                    fill: "var(--chart-3)",
                    arrecadado: 0,
                    qtd: 0,
                },
                cartao: {
                    name: "cartão",
                    fill: "var(--chart-1)",
                    arrecadado: 0,
                    qtd: 0,
                },
                boleto: {
                    name: "boleto",
                    fill: "var(--chart-2)",
                    arrecadado: 0,
                    qtd: 0,
                },
                dinheiro: {
                    name: "dinheiro",

                    arrecadado: 0,
                    qtd: 0,
                    fill: "var(--brand-success)",
                },
            };
            const congregacao = listaMap.get("congregacao") || {};
            const cargo = listaMap.get("cargo") || {};
            const faturamento = faturamentoMap.get(data) || {
                arrecadado: 0,
                pendente: 0,
                aprovado: 0,
                cancelado: 0,
                name: data,
            };

            if (v.status === "aprovado") {
                const mtd = metodo[v.metodo_pagamento];
                mtd.arrecadado += v.valor;
                mtd.qtd++;

                const cong = v.titular_congregacao || "outra";
                congregacao[cong] = (congregacao[cong] || 0) + 1;

                cargo[v.titular_cargo] = (cargo[v.titular_cargo] || 0) + 1;

                faturamento.arrecadado += v.valor;
                faturamento.aprovado++;
            } else
                v.status === "cancelado"
                    ? faturamento.cancelado++
                    : faturamento.pendente++;

            listaMap.set("metodo", metodo);
            listaMap.set("congregacao", congregacao);
            listaMap.set("cargo", cargo);
            faturamentoMap.set(data, faturamento);
        });

        return {
            metodos: Object.values(listaMap.get("metodo") ?? {}),
            congregacao: Object.entries(listaMap.get("congregacao") ?? {})
                .map(([key, value]) => ({ name: key, inscritos: value }))
                .sort((a: any, b: any) => b.inscritos - a.inscritos),
            cargo: Object.entries(listaMap.get("cargo") ?? {})
                .map(([key, value]) => ({ name: key, inscritos: value }))
                .sort((a: any, b: any) => b.inscritos - a.inscritos),
            faturamento: Array.from(faturamentoMap.values() || {}),
        };
    }, [filter]);
    const cards = useMemo(() => {
        const dados = {
            total_arrecadado: totalArrecadado,
            total_transacoes: totalTransacoes,
            aprovados: transacoesPorStatus.aprovado.value,
            cancelados: transacoesPorStatus.cancelado.value,
            pendentes: transacoesPorStatus.pendente.value,
            ticket: totalArrecadado / totalTransacoes,
        };

        const c: (CardOpcaoProps | CardProps)[] = [
            {
                icon: <Shuffle />,
                number: dados.total_transacoes,
                title: "Total Transações",
                className: "card--short",
            },
            {
                icon: <HandCoins />,
                title: "Status",
                opcoes: [
                    {
                        icon: <Banknote />,
                        id: "aprovado",
                        number: dados.aprovados,
                        title: "Aprovados",
                    },
                    {
                        icon: <BanknoteX />,
                        id: "cancelado",
                        number: dados.cancelados,
                        title: "Cancelados",
                    },
                    {
                        icon: <Clock />,
                        id: "pendente",
                        number: dados.pendentes,
                        title: "Pendentes",
                    },
                ],
                number: dados.aprovados,
            },
            {
                icon: <DollarSign />,
                number: dados.total_arrecadado,
                title: "Total Arrecadado",
                type: "currency",
                className: "card--short",
            },
            {
                icon: <Tag />,
                number: dados.ticket,
                title: "Ticket Médio",
                type: "currency",
                className: "card--short",
            },
        ];

        return c;
    }, [totalTransacoes]);
    return (
        <div className="transacoes__graficos">
            <BaseCardsContainer>
                {cards.map((v, i) =>
                    "opcoes" in v ? (
                        <CardOpcao {...v} key={`card-${i}`} />
                    ) : (
                        <Card key={`card-${i}`} {...v} />
                    ),
                )}
            </BaseCardsContainer>

            {(filter.congregacao || filter.cargo) && (
                <button
                    className="transacoes__graficos__reset"
                    type="button"
                    title="Remover Filtro"
                    onClick={() =>
                        setFilter({ cargo: null, congregacao: null })
                    }
                >
                    <i>
                        <ListRestart />
                    </i>
                    <span>Remover Filtro</span>
                </button>
            )}

            <motion.div
                initial={{ display: "none" }}
                animate={{ display: "block" }}
                transition={{ delay: 1 }}
            >
                <div className="transacoes__graficos__graficos">
                    <div className="transacoes__graficos__graficos__grafico">
                        <h3 className="transacoes__graficos__graficos__grafico__title">
                            Faturamento Diário
                        </h3>

                        <ChartFaturamento
                            data={listaMemo.faturamento}
                            isMobile={isMobile}
                            areaKeyName="arrecadado"
                            bars={bars}
                        />
                    </div>

                    <ChartPiePagamentos
                        data={listaMemo.metodos}
                        isMobile={isMobile}
                    />

                    <div className="transacoes__graficos__graficos__grafico">
                        <h3 className="transacoes__graficos__graficos__grafico__title">
                            Vendas por Cargos
                        </h3>

                        <ChartBarPorCargos
                            data={listaMemo.cargo}
                            onClick={addFilter}
                            keyName="cargo"
                            isMobile={isMobile}
                        />
                    </div>
                    <div className="transacoes__graficos__graficos__grafico">
                        <h3 className="transacoes__graficos__graficos__grafico__title">
                            Vendas por Congregações
                        </h3>

                        <ChartBarPorCargos
                            data={listaMemo.congregacao}
                            onClick={addFilter}
                            keyName="congregacao"
                            isMobile={isMobile}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function TransacoesBody() {
    const params = useSearchParams();
    const mode = params.get("mode");
    const isChart = mode === "graficos";
    return isChart ? <GraficosTransacoes /> : <ListaTransacoes />;
}

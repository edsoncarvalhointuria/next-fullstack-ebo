"use client";

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import {
    testeCargos,
    testeCheckinResponses,
    testeCheckins,
    testeCompradores,
    testeCongregacoes,
    testeCredenciais,
    testeIngressos,
    testePerguntas,
    testeTransacoes,
} from "../../config/datasTeste";

interface ProviderDataContext {
    ingressos: IngressosInterface[];
    congregacoes: CongregacaoInterface[];
    compradores: CompradorInterface[];
    cargos: CargosInterface[];
    checkins: {
        id: number;
        id_credencial: number;
        id_usuario: string;
        data_hora_checkin: string;
    }[];
    perguntas: FAQInterface[];
    transacoes: TransacaoInterface[];
    credenciais: CredencialInterface[];
    checkinResponse: CheckinResponse[];
    responsesMemo: {
        totalArrecadado: number;
        responseTransacoes: TransacaoResponse[];
        credenciaisResponse: CredencialResponse[];
        transacoesArrecadacao: unknown[];
        transacoesPorStatus: {
            pendente: {
                name: string;
                value: number;
                fill: string;
            };
            aprovado: {
                name: string;
                value: number;
                fill: string;
            };
            cancelado: {
                name: string;
                value: number;
                fill: string;
            };
        };
        listaGraficosTransacoes: GraficosTransacoes[];
        credenciaisPorCongregacao: {
            name: string;
            inscritos: number;
        }[];
        cardsCredenciais: MetricasCardsCredenciais;
        listaGraficosCredenciais: GraficosCrendenciaisResponse;
        totalTransacoes: number;
        totalCredenciais: number;
        transacoesPorIngresso: {
            total: number;
            individual: number;
            casal: number;
        };
    };
    addIngresso: (ingresso: IngressosInterface | IngressosInterface[]) => void;
    addCongregacao: (
        congregacao: CongregacaoInterface | CongregacaoInterface[],
    ) => void;
    addComprador: (comprador: CompradorInterface) => void;
    addCargo: (cargo: CargosInterface | CargosInterface[]) => void;
    addCheckin: (checkin: {
        id: number;
        id_credencial: number;
        id_usuario: string;
        data_hora_checkin: string;
    }) => void;
    addPergunta: (pergunta: FAQInterface | FAQInterface[]) => void;
    addTransacao: (transacao: TransacaoInterface) => void;
    addCredencial: (
        transacao: TransacaoInterface | CredencialInterface[],
    ) => void;
}

const context = createContext({});
export const useDataContext = () => useContext(context) as ProviderDataContext;

export default function DataContext({ children }: { children: ReactNode }) {
    const [ingressos, setIngressos] = useState(testeIngressos);
    const [congregacoes, setCongregacoes] = useState(testeCongregacoes);
    const [compradores, setCompradores] = useState(testeCompradores);
    const [cargos, setCargos] = useState(testeCargos);
    const [perguntas, setPerguntas] = useState(testePerguntas);
    const [transacoes, setTransacoes] = useState(testeTransacoes);
    const [credenciais, setCredenciais] = useState(testeCredenciais);
    const [checkins, setCheckins] = useState(testeCheckins);
    const [checkinResponse, _] = useState(testeCheckinResponses);

    const responsesMemo = useMemo(() => {
        const totalTransacoes = transacoes.length;
        const totalCredenciais = credenciais.length;
        let totalArrecadado = 0;

        const credenciaisListaMap = new Map<
            string,
            (CredencialInterface & {
                nome_cargo: string;
                nome_congregacao: string;
            })[]
        >();
        const congregacoesSet = new Set();
        const responseTransacoes: TransacaoResponse[] = [];
        const objArrecadacao: any = {};
        const transacoesPorStatus = {
            pendente: {
                name: "pendente",
                value: 0,
                fill: "var(--brand-warning)",
            },
            aprovado: {
                name: "aprovado",
                value: 0,
                fill: "var(--brand-success)",
            },
            cancelado: {
                name: "cancelado",
                value: 0,
                fill: "var(--brand-danger)",
            },
        };
        const transacoesPorIngresso = { total: 0, individual: 0, casal: 0 };
        const credenciaisCongregacoesMap = new Map<
            string,
            GraficoCredenciaisIgrejas
        >();
        const credenciaisCargosMap = new Map<
            string,
            GraficoCredenciaisCargos
        >();
        const credenciaisMap = new Map<string, CredenciaisTotal>();

        const credenciaisResponse: CredencialResponse[] = credenciais.map(
            (v, i) => {
                const {
                    id_cargo,
                    id_congregacao,
                    id,
                    id_transacao,
                    is_outra_congregacao,
                    is_titular,
                    nome,
                    nome_outra_congregacao,
                } = v;
                const transacao = transacoes.find(
                    (v) => v.id === id_transacao,
                )!;
                const comprador = compradores.find(
                    (v) => v.cpf_cnpj === transacao.id_comprador,
                )!;

                const ingresso = ingressos.find(
                    (v) => String(v.id) === String(transacao.id_ingresso),
                )?.nome_tipo!;
                const cargo = testeCargos.find(
                    (c) => String(c.id) === String(id_cargo),
                )?.nome!;
                const congregacao = testeCongregacoes.find(
                    (c) => String(c.id) === String(id_congregacao),
                )?.nome!;
                congregacoesSet.add(id_congregacao);

                const objIgreja = credenciaisCongregacoesMap.get(
                    congregacao,
                ) || {
                    name: congregacao || "outra",
                    quantidadeCredenciais: 0,
                };
                objIgreja.quantidadeCredenciais++;

                const objCargo = credenciaisCargosMap.get(cargo) || {
                    name: cargo,
                    qtd: 0,
                    fill: `var(--chart-${(i % 12) + 1})`,
                };
                objCargo.qtd++;

                credenciaisCongregacoesMap.set(congregacao, objIgreja);
                credenciaisCargosMap.set(cargo, objCargo);
                const lista = credenciaisListaMap.get(id_transacao) || [];
                lista.push({
                    ...v,
                    nome_cargo: cargo,
                    nome_congregacao: congregacao,
                });

                credenciaisListaMap.set(id_transacao, lista);

                return {
                    nome_outra_congregacao,
                    id,
                    id_cargo,
                    id_congregacao,
                    id_transacao,
                    is_outra_congregacao,
                    is_titular,
                    nome,
                    nome_cargo: cargo,
                    nome_congregacao: congregacao,
                    nome_comprador: comprador.nome,
                    tipo_ingresso: ingresso,
                    whatsapp_comprador: comprador.whatsapp,
                    email_comprador: comprador.email,
                };
            },
        );

        const listaGraficosTransacoes: GraficosTransacoes[] = transacoes.map(
            (v) => {
                const {
                    data_hora_pedido,
                    id,
                    id_ingresso,
                    metodo_pagamento,
                    status_pagamento,
                    valor_pedido,
                    id_comprador,
                } = v;
                const data = new Date(data_hora_pedido).toLocaleDateString(
                    "pt-BR",
                    { day: "2-digit", month: "2-digit" },
                );

                const tipo_ingresso =
                    ingressos.find((v) => String(v.id) === String(id_ingresso))
                        ?.nome_tipo || "";
                const credencial = credenciais.find(
                    (v) => v.id_transacao === id && v.is_titular,
                )!;

                const titular_congregacao =
                    congregacoes.find(
                        (v) =>
                            String(v.id) === String(credencial?.id_congregacao),
                    )?.nome || "";

                const titular_cargo =
                    cargos.find(
                        (v) => String(v.id) === String(credencial?.id_cargo),
                    )?.nome || "";
                const comprador = compradores.find(
                    (v) => v.cpf_cnpj === id_comprador,
                )!;
                const credenciaisLista = credenciaisListaMap.get(id)!;

                if (status_pagamento === "aprovado") {
                    const obj = objArrecadacao[data] || {
                        name: data,
                        vendas: 0,
                        arrecadado: 0,
                    };
                    obj.vendas++;
                    obj.arrecadado += valor_pedido;
                    objArrecadacao[data] = obj;
                    totalArrecadado += valor_pedido;

                    tipo_ingresso === "individual"
                        ? transacoesPorIngresso.individual++
                        : transacoesPorIngresso.casal++;
                    transacoesPorIngresso.total++;
                }
                transacoesPorStatus[status_pagamento].value++;

                responseTransacoes.push({
                    id_transacao: id,
                    pagamento: {
                        metodo_pagamento,
                        status: status_pagamento,
                        valor_total: valor_pedido,
                    },
                    data_compra: data_hora_pedido,
                    comprador: {
                        nome: comprador.nome,
                        cpf: comprador.cpf_cnpj,
                        email: comprador.email,
                    },
                    credenciais:
                        credenciaisLista?.map((v) => {
                            const {
                                is_outra_congregacao,
                                nome,
                                nome_outra_congregacao,
                                nome_cargo,
                                nome_congregacao,
                            } = v;
                            const checkinLista = checkins
                                .filter((c) => c.id_credencial === v.id)
                                .map((v) => ({
                                    data: v.data_hora_checkin,
                                    id: String(v.id),
                                }));
                            return {
                                checkins: checkinLista,
                                id_credencial: String(v.id),
                                is_outra_congregacao,
                                nome_cargo,
                                nome_congregacao,
                                nome_outra_congregacao,
                                nome_titular: nome,
                                tipo_ingresso,
                            };
                        }) || [],
                });

                const objCredenciais = credenciaisMap.get(data) || {
                    name: data,
                    quantidadeTotal: 0,
                };
                objCredenciais.quantidadeTotal++;
                (objCredenciais as any)[tipo_ingresso] =
                    ((objCredenciais as any)[tipo_ingresso] || 0) + 1;

                credenciaisMap.set(data, objCredenciais);

                return {
                    data_pedido: new Date(data_hora_pedido).toLocaleDateString(
                        "pt-BR",
                        { day: "2-digit", month: "2-digit" },
                    ),
                    id_transacao: id,
                    status: status_pagamento,
                    valor: valor_pedido,
                    metodo_pagamento,
                    tipo_ingresso,
                    titular_cargo,
                    titular_congregacao,
                };
            },
        );

        const transacoesArrecadacao = Object.values(objArrecadacao).sort(
            (a: any, b: any) => {
                const [aD, aM] = a.name.split("/");
                const [bD, bM] = b.name.split("/");
                const dA = new Date(`${new Date().getFullYear()}-${aM}-${aD}`);
                const dB = new Date(`${new Date().getFullYear()}-${bM}-${bD}`);

                return dA.getTime() - dB.getTime();
            },
        );
        const credenciaisPorCongregacaoOrdenada = Array.from(
            credenciaisCongregacoesMap.values(),
        ).sort((a, b) => b.quantidadeCredenciais - a.quantidadeCredenciais);
        const credenciaisPorCongregacao = credenciaisPorCongregacaoOrdenada.map(
            (v) => ({ name: v.name, inscritos: v.quantidadeCredenciais }),
        );
        const cardsCredenciais: MetricasCardsCredenciais = {
            totalCredenciais: testeCredenciais.length,
            congregacoesAlcancadas: congregacoesSet.size,
            lotacaoPercentual: testeCredenciais.length / 100,
        };
        const listaGraficosCredenciais: GraficosCrendenciaisResponse = {
            cards: cardsCredenciais,
            inscricoes: Array.from(credenciaisMap.values()),
            cargos: Array.from(credenciaisCargosMap.values()),
            congregacoes: credenciaisPorCongregacaoOrdenada,
        };

        return {
            responseTransacoes,
            credenciaisResponse,
            transacoesArrecadacao,
            transacoesPorStatus,
            listaGraficosTransacoes,
            credenciaisPorCongregacao,
            cardsCredenciais,
            listaGraficosCredenciais,
            totalArrecadado,
            totalTransacoes,
            totalCredenciais,
            transacoesPorIngresso,
        };
    }, [
        transacoes,
        credenciais,
        ingressos,
        cargos,
        congregacoes,
        compradores,
        checkins,
    ]);
    const addIngresso = useCallback(
        (ingresso: IngressosInterface | IngressosInterface[]) => {
            setIngressos((v) =>
                "length" in ingresso ? ingresso : [...v, ingresso],
            );
        },
        [],
    );
    const addCongregacao = useCallback(
        (congregacao: CongregacaoInterface | CongregacaoInterface[]) => {
            setCongregacoes((v) =>
                "length" in congregacao ? congregacao : [...v, congregacao],
            );
        },
        [],
    );
    const addComprador = useCallback((comprador: CompradorInterface) => {
        setCompradores((v) => [...v, comprador]);
    }, []);
    const addCargo = useCallback(
        (cargo: CargosInterface | CargosInterface[]) => {
            setCargos((v) => ("length" in cargo ? cargo : [...v, cargo]));
        },
        [],
    );
    const addCheckin = useCallback(
        (checkin: {
            id: number;
            id_credencial: number;
            id_usuario: string;
            data_hora_checkin: string;
        }) => {
            setCheckins((v) => [...v, checkin]);
        },
        [],
    );
    const addPergunta = useCallback(
        (pergunta: FAQInterface | FAQInterface[]) => {
            setPerguntas((v) =>
                ("length" in pergunta ? pergunta : [...v, pergunta]).sort(
                    (a, b) => a.ordem - b.ordem,
                ),
            );
        },
        [],
    );
    const addTransacao = useCallback((transacao: TransacaoInterface) => {
        setTransacoes((v) => [...v, transacao]);
    }, []);
    const addCredencial = useCallback(
        (credencial: CredencialInterface | CredencialInterface[]) => {
            setCredenciais((v) =>
                "length" in credencial ? credencial : [...v, credencial],
            );
        },
        [],
    );

    const provider = {
        ingressos,
        congregacoes,
        compradores,
        cargos,
        checkins,
        perguntas,
        transacoes,
        credenciais,
        checkinResponse,
        responsesMemo,
        addIngresso,
        addCongregacao,
        addComprador,
        addCargo,
        addCheckin,
        addPergunta,
        addTransacao,
        addCredencial,
    };

    return <context.Provider value={provider}>{children}</context.Provider>;
}

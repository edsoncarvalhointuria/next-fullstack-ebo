"use client";

import Dropdown, { ItemDropdownDefault } from "@/components/ui/Dropdown";
import {
    memo,
    ReactNode,
    useCallback,
    useDeferredValue,
    useMemo,
    useState,
} from "react";
import Search from "@/components/ui/Search";
import { ListaVazia } from "../config-site/ListaDados";
import Link from "next/link";
import Whatsapp from "@/components/ui/icons/Whatsapp";
import Gmail from "@/components/ui/icons/Gmail";
import { Box, Church, Ticket, Tickets, Users } from "lucide-react";
import {
    Card,
    CardCustom,
    CardCustomProps,
    CardOpcaoProps,
    CardProps,
} from "@/components/ui/Card";
import { BaseCardsContainer } from "../config-site/BaseConfig";
import {
    ChartBarPorCargos,
    ChartFaturamento,
    ChartPieCustom,
} from "../transacoes/ChartsTransacoes";
import useResize from "@/hooks/useResize";
import { useSearchParams } from "next/navigation";
import GraficoRosca from "@/components/ui/GraficoRosca";
import { useDataContext } from "@/contexts/DataContext";
import { motion } from "framer-motion";

interface StateDrops {
    ingresso: ItemDropdownDefault;
    cargo: ItemDropdownDefault;
    congregacao: ItemDropdownDefault;
}

const CredencialCard = ({
    is_titular,
    is_outra_congregacao,
    nome_cargo,
    nome,
    nome_congregacao,
    nome_outra_congregacao,
}: CredencialResponse) => {
    return (
        <div
            className={`credenciais__credencial__card ${is_titular ? "credenciais__credencial__card--titular" : ""} ${is_outra_congregacao ? "credenciais__credencial__card--outra-congregacao" : ""}`}
        >
            <p className="credenciais__credencial__card__cargo">{nome_cargo}</p>
            <h3 className="credenciais__credencial__card__nome">{nome}</h3>
            <p className={"credenciais__credencial__card__congregacao"}>
                {nome_congregacao || nome_outra_congregacao}
            </p>
        </div>
    );
};
const Crendecial = memo(
    ({
        comprador,
        lista,
    }: {
        comprador: CredencialResponse | undefined;
        lista: CredencialResponse[] | undefined;
    }) => {
        return (
            <div className="credenciais__credencial">
                <div className="credenciais__credencial__header">
                    <div className="credenciais__credencial__infos">
                        <h2 className="credenciais__credencial__title">
                            <span>Comprador:</span>
                            <strong>{comprador?.nome_comprador}</strong>
                        </h2>

                        <p className="credenciais__credencial__tipo">
                            <i>
                                {comprador?.tipo_ingresso === "individual" ? (
                                    <Ticket />
                                ) : (
                                    <Tickets />
                                )}
                            </i>
                            <span>{comprador?.tipo_ingresso}</span>
                        </p>
                    </div>

                    <div className="credenciais__credencial__contatos">
                        <Link
                            rel="noopener noreferrer"
                            className="credenciais__credencial__contato credenciais__credencial__contato--gmail"
                            href={`mailto:${comprador?.email_comprador}`}
                            title="Entrar em contato por email"
                        >
                            <i>
                                <Gmail />
                            </i>
                        </Link>

                        {comprador?.whatsapp_comprador && (
                            <Link
                                href={"#"}
                                rel="noopener noreferrer"
                                className="credenciais__credencial__contato credenciais__credencial__contato--whats"
                            >
                                <i>
                                    <Whatsapp />
                                </i>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="credenciais__credencial__body">
                    {lista?.map((v) => (
                        <CredencialCard {...v} key={v.id} />
                    ))}
                </div>
            </div>
        );
    },
);

export function FiltrosCredenciais({
    children,
}: {
    children: (
        listaAtualizada: [string, CredencialResponse[] | undefined][],
    ) => ReactNode;
}) {
    const {
        ingressos,
        cargos,
        congregacoes,
        responsesMemo: { credenciaisResponse, responseTransacoes },
    } = useDataContext();
    const [pesquisa, setPesquisa] = useState("");
    const [drops, setDrops] = useState<StateDrops>({
        cargo: { id: "todos", nome: "Todos" },
        congregacao: { id: "todos", nome: "Todos" },
        ingresso: { id: "todos", nome: "Todos" },
    });
    const p = useDeferredValue(pesquisa);
    const addDrops = useCallback((id: string, value: ItemDropdownDefault) => {
        setDrops((v) => ({ ...v, [id]: value }));
    }, []);

    const ingressosMemo = useMemo(() => {
        return ingressos.map((v) => ({ ...v, nome: v.nome_tipo }));
    }, [ingressos]);
    const credenciaisMemo = useMemo(() => {
        let c = credenciaisResponse;

        if (drops.cargo.id !== "todos")
            c = c.filter((v) => v.id_cargo === drops.cargo.id);
        if (drops.congregacao.id !== "todos") {
            if (drops.congregacao.id === "outra")
                c = c.filter((v) => v.is_outra_congregacao);
            else c = c.filter((v) => v.id_congregacao === drops.congregacao.id);
        }
        if (drops.ingresso.id !== "todos")
            c = c.filter((v) => v.tipo_ingresso === drops.ingresso.nome);
        if (p)
            c = c.filter(
                (v) =>
                    v.email_comprador.toLowerCase().includes(p) ||
                    v.nome.toLowerCase().includes(p) ||
                    v.nome_cargo.toLowerCase().includes(p) ||
                    v.nome_comprador.toLowerCase().includes(p) ||
                    v.nome_outra_congregacao?.toLowerCase().includes(p),
            );

        return Object.entries(Object.groupBy(c, (v) => v.id_transacao));
    }, [p, drops, credenciaisResponse]);
    const cards = useMemo(() => {
        let individual = 0;
        let casal = 0;
        responseTransacoes.forEach((v) => {
            const { credenciais } = v;
            if (credenciais.length)
                credenciais[0].tipo_ingresso === "individual"
                    ? ++individual
                    : ++casal;
        });
        const c: CardProps[] = [
            {
                icon: <Users />,
                title: "Total Pessoas",
                number: credenciaisResponse.length,
                type: "round",
            },
            {
                icon: <Ticket />,
                title: "Individual",
                number: individual,
                type: "round",
            },
            {
                icon: <Tickets />,
                title: "Casal",
                number: casal,
                type: "round",
            },
        ];
        return c;
    }, [credenciaisResponse, responseTransacoes]);
    return (
        <>
            <BaseCardsContainer>
                {cards.map((v) => (
                    <Card {...v} key={v.title} className="card--short" />
                ))}
            </BaseCardsContainer>

            <section className="credenciais__lista">
                <div className="credenciais__filtros">
                    <div className="credenciais__filtro credenciais__filtro--search">
                        <Search
                            onSearch={setPesquisa}
                            placeholder="Pesquisar Credenciais"
                        />
                    </div>
                    <div className="credenciais__filtros__drops">
                        <div className="credenciais__filtro">
                            <p className="credenciais__filtro__title">
                                Tipo Ingresso
                            </p>
                            <Dropdown
                                lista={ingressosMemo}
                                currentValue={drops.ingresso}
                                idObj="ingresso"
                                onSelected={addDrops}
                            />
                        </div>
                        <div className="credenciais__filtro">
                            <p className="credenciais__filtro__title">Cargo</p>
                            <Dropdown
                                lista={cargos}
                                currentValue={drops.cargo}
                                idObj="cargo"
                                onSelected={addDrops}
                            />
                        </div>
                        <div className="credenciais__filtro">
                            <p className="credenciais__filtro__title">
                                Congregação
                            </p>
                            <Dropdown
                                lista={congregacoes}
                                currentValue={drops.congregacao}
                                idObj="congregacao"
                                onSelected={addDrops}
                            />
                        </div>
                    </div>
                </div>

                {children(credenciaisMemo)}
            </section>
        </>
    );
}

export function ListaCredenciais() {
    return (
        <FiltrosCredenciais>
            {(lista) => (
                <div className="credenciais__itens">
                    {lista.length > 0 ? (
                        lista.map(([id, lista]) => {
                            const comprador = lista?.[0];
                            return (
                                <Crendecial
                                    key={id}
                                    comprador={comprador}
                                    lista={lista}
                                />
                            );
                        })
                    ) : (
                        <ListaVazia />
                    )}
                </div>
            )}
        </FiltrosCredenciais>
    );
}

const bars = [
    { dataKey: "casal", fill: "var(--chart-2)" },
    { dataKey: "individual", fill: "var(--chart-3)" },
];
export function GraficosCredenciais() {
    const {
        responsesMemo: { cardsCredenciais, listaGraficosCredenciais },
    } = useDataContext();
    const isMobile = useResize(480);
    const cards = useMemo(() => {
        const c: (CardOpcaoProps | CardProps | CardCustomProps)[] = [
            {
                icon: <Users />,
                number: cardsCredenciais.totalCredenciais,
                title: "Total Credenciais",
                className: "card--center",
            },
            {
                icon: <Box />,
                children: (
                    <GraficoRosca
                        cor="var(--chart-3)"
                        porcentagem={cardsCredenciais.lotacaoPercentual * 100}
                    />
                ),
                title: "Capacidade Atingida",
                className: "card--center",
            },
            {
                icon: <Church />,
                number: cardsCredenciais.congregacoesAlcancadas,
                title: "Igrejas Alcançadas",
                className: "card--center",
            },
        ];
        return c;
    }, [cardsCredenciais]);

    console.log(listaGraficosCredenciais.inscricoes);
    return (
        <div className="credenciais__graficos">
            <BaseCardsContainer>
                {cards.map((v, i) =>
                    !("number" in v) ? (
                        <CardCustom {...v} key={`card-${i}`} />
                    ) : (
                        <Card {...v} key={`card-${i}`} />
                    ),
                )}
            </BaseCardsContainer>
            <motion.div
                initial={{ display: "none" }}
                animate={{ display: "block" }}
                transition={{ delay: 1 }}
            >
                <div className="credenciais__graficos__graficos">
                    <div className="credenciais__graficos__graficos__grafico">
                        <h3 className="credenciais__graficos__graficos__grafico__title">
                            Credencias Por Congregação
                        </h3>
                        <ChartBarPorCargos
                            isMobile={isMobile}
                            data={listaGraficosCredenciais.congregacoes}
                            onClick={() => undefined}
                            keyName="quantidadeCredenciais"
                            dataKey="quantidadeCredenciais"
                        />
                    </div>
                    <div className="credenciais__graficos__graficos__grafico">
                        <ChartPieCustom
                            isMobile={isMobile}
                            data={listaGraficosCredenciais.cargos}
                            type="qtd"
                        />
                    </div>

                    <div className="credenciais__graficos__graficos__grafico">
                        <h3 className="credenciais__graficos__graficos__grafico__title">
                            Ingressos Vendidos Por Dia
                        </h3>
                        <ChartFaturamento
                            data={listaGraficosCredenciais.inscricoes}
                            isMobile={isMobile}
                            areaKeyName="quantidadeTotal"
                            bars={bars}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function BodyCredenciais() {
    const params = useSearchParams();
    const mode = params.get("mode");
    const isChart = mode === "graficos";

    return isChart ? <GraficosCredenciais /> : <ListaCredenciais />;
}

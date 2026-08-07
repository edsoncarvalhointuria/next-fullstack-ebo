import { Card, CardOpcao, CardOpcaoProps, CardProps } from "@/components/ui/Card";
import { Banknote, Equal, HandCoins, Ticket, TicketCheck, Tickets, UsersRound } from "lucide-react";

export default function CardsAdmin({
    transacoesPorIngresso,
    transacoesPorStatus,
}: {
    transacoesPorStatus: CardsTransacaoStatus;
    transacoesPorIngresso: TransacaoPorIngresso;
}) {
    console.log("aaa");

    const cards: (CardOpcaoProps | CardProps)[] = [
        {
            icon: <TicketCheck />,
            title: "Ingressos Vendidos",
            number: 0,
            opcoes: [
                {
                    icon: <Equal />,
                    number: transacoesPorIngresso.total,
                    id: 1,
                    title: "Total Ingressos",
                },
                {
                    icon: <Ticket />,
                    number: transacoesPorIngresso.individual,
                    id: 2,
                    title: "Ingressos Individuais",
                },
                {
                    icon: <Tickets />,
                    number: transacoesPorIngresso.casal,
                    id: 3,
                    title: "Ingressos Casal",
                },
            ],
        },
        {
            icon: <UsersRound />,
            title: "Total de Transações",
            number: transacoesPorStatus.totalTransacoes,
            className: "card--short",
        },
        {
            icon: <Banknote />,
            title: "Total Arrecadado",
            number: transacoesPorStatus.totalArrecadado,
            className: "card--financeiro card--short",
            type: "currency",
        },
        {
            icon: <HandCoins />,
            title: "Pagamentos Pendentes",
            number: transacoesPorStatus.pendente.value || 0,
            className: "card--pendente card--short",
        },
    ];
    return (
        <div className="admin__cards">
            {cards.map((v, i) =>
                "opcoes" in v ? <CardOpcao key={`card-${i}`} {...v} /> : <Card key={`card-${i}`} {...v} />,
            )}
        </div>
    );
}

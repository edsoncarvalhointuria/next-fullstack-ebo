import { Calculator, UserRoundCheck, UserRoundX } from "lucide-react";
import { ItensListaDados, ListaDadosItensDefault } from "./ListaDados";
import MotionMain from "@/components/layout/MotionMain";
import { ReactNode, useMemo } from "react";
import { Card, CardProps } from "@/components/ui/Card";
import "./base-config.scss";
import BotaoAdd from "@/components/ui/btns/BotaoAdd";

interface BaseHeaderProps {
    title: string;
    icon: ReactNode;
    buttonTitle: string;
    buttonLink?: string;
    buttonIcon?: ReactNode;
}
interface BaseConfigProps extends BaseHeaderProps {
    icon: ReactNode;
    itens: ItensListaDados[];
    title: string;
}

export const BaseHeader = ({
    buttonTitle,
    icon,
    title,
    buttonIcon,
    buttonLink,
}: BaseHeaderProps) => {
    return (
        <section className="base-config__header">
            <h1>
                <i>{icon}</i>
                <span>{title}</span>
            </h1>

            <BotaoAdd title={buttonTitle} icon={buttonIcon} link={buttonLink} />
        </section>
    );
};

export const BaseCardsContainer = ({ children }: { children: ReactNode }) => {
    return <section className="base-config__cards">{children}</section>;
};
export const BaseCards = ({ itens }: { itens: ItensListaDados[] }) => {
    const cards = useMemo(() => {
        let ativos = 0;
        let inativos = 0;
        itens?.forEach((v) => (v.is_ativo ? ++ativos : ++inativos));
        const c: CardProps[] = [
            {
                icon: <Calculator />,
                number: itens?.length,
                title: "Total",
            },
            {
                icon: <UserRoundCheck />,
                number: ativos,
                title: "Ativos",
                className: "card--financeiro",
            },
            {
                icon: <UserRoundX />,
                number: inativos,
                title: "Inativos",
                className: "card--pendente",
            },
        ];

        return c;
    }, [itens]);
    return (
        <BaseCardsContainer>
            {cards.map((v, i) => (
                <Card key={`${i}-card}`} {...v} className="card--short" />
            ))}
        </BaseCardsContainer>
    );
};

export default function BaseConfig({
    icon,
    itens,
    title,
    buttonTitle,
    buttonIcon,
    buttonLink,
}: BaseConfigProps) {
    return (
        <MotionMain className="base-config">
            <BaseHeader
                buttonTitle={buttonTitle}
                icon={icon}
                title={title}
                buttonIcon={buttonIcon}
                buttonLink={buttonLink}
            />
            <BaseCards itens={itens} />
            <ListaDadosItensDefault itens={itens} />
        </MotionMain>
    );
}

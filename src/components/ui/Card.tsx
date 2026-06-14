"use client";

import React, { ReactNode, useState } from "react";
import CountUp from "./CountUp";
import "./card.scss";

export interface CardDefault {
    number: number;
    icon: ReactNode;
    type?: "currency" | "round" | "toFixed";
}
export interface CardProps extends CardDefault {
    title: string;
    children?: ReactNode;
    className?: string;
}
export interface CardOpcaoProps extends CardProps {
    opcoes: (CardDefault & { id: string | number; title?: string })[];
    defaultId?: string | number;
}
export interface CardCustomProps {
    title: string;
    icon: ReactNode;
    children: ReactNode;
    className?: string;
}

export const Card = React.memo(
    ({
        title,
        icon,
        number,
        children,
        className,
        type = "round",
    }: CardProps) => {
        return (
            <div className={`card ${className || ""}`}>
                <h2 className="card__title">
                    <i>{icon}</i>
                    <span>{title}</span>
                </h2>

                <div className="card__details">
                    <div className="card__info">
                        <p>
                            <CountUp valor={number} type={type} />
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        );
    },
);

export const CardOpcao = React.memo(
    ({
        title,
        icon,
        opcoes,
        defaultId,
        className,
        type = "round",
    }: CardOpcaoProps) => {
        const [current, setCurrent] = useState(
            opcoes.find((v) => v.id === defaultId) || opcoes[0],
        );
        const nome = title.replace(/\s/g, "-").toLocaleLowerCase();
        return (
            <Card
                icon={icon}
                number={current?.number || 0}
                title={current.title || title}
                type={type}
                className={className}
            >
                <>
                    {opcoes && (
                        <div className="card__opcoes">
                            {opcoes.map((v, i) => (
                                <div
                                    className="card__opcao"
                                    key={`input-${i}`}
                                    onClick={() => setCurrent(v)}
                                >
                                    <label htmlFor={`radio-opcao-${nome}`}>
                                        <i>{v.icon}</i>
                                    </label>
                                    <input
                                        type="radio"
                                        name={`radio-opcao-${nome}`}
                                        id={`${v.id}-${nome}`}
                                        checked={current.id === v.id}
                                        readOnly
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            </Card>
        );
    },
);

export const CardCustom = React.memo(
    ({ title, icon, children, className }: CardCustomProps) => {
        return (
            <div className={`card ${className || ""}`}>
                <h2 className="card__title">
                    <i>{icon}</i>
                    <span>{title}</span>
                </h2>

                <div className="card__details">{children}</div>
            </div>
        );
    },
);

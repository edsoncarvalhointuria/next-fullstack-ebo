import { ReactNode } from "react";
import "./botao-header-container.scss";

export default function BotaoHeaderContainer({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`botao-header-container ${className || ""}`}>
            {children}
        </div>
    );
}

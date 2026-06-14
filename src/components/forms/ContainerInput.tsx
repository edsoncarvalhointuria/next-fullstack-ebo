import { ReactNode } from "react";
import "./forms.scss";

export default function ContainerInput({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return <div className={`forms__input ${className}`}>{children}</div>;
}

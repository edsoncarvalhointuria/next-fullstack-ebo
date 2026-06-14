import { ReactNode } from "react";

export default function GroupInputContainer({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return <div className={`forms__group ${className}`}>{children}</div>;
}

import Menu from "@/components/layout/Menu";
import { ReactNode } from "react";

export default function LayoutAdm({ children }: { children: ReactNode }) {
    return (
        <>
            <Menu />
            {children}
        </>
    );
}

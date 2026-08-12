import WrapperMenu from "@/components/layout/MenuWrapper";
import { ReactNode } from "react";

export default function LayoutAdm({ children }: { children: ReactNode }) {
    return (
        <>
            <WrapperMenu />
            {children}
        </>
    );
}

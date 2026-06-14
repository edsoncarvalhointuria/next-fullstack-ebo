import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";

export default function Site({ children }: { children: ReactNode }) {
    return (
        <>
            {children}

            <Footer />
        </>
    );
}

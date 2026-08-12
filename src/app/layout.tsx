import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./main.scss";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    variable: "--font-serif",
});
const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Ingressos EBO | Ministério Vale das Virtudes",
    description:
        "Garanta seu ingresso para a Escola Bíblica de Obreiros (EBO) do Ministério Vale das Virtudes. O evento ocorrerá de 05 a 07 de setembro.",
    openGraph: {
        title: "EBO - Ministério Vale das Virtudes | Ingressos",
        description: "Participe da EBO de 05 a 07 de setembro. Garanta já o seu ingresso!",
        type: "website",
        locale: "pt_BR",
        siteName: "Ministério Vale das Virtudes",
        images: [
            {
                url: "/banner-ebo.jpg",
                width: 1200,
                height: 630,
                alt: "Banner do Evento EBO",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Ingressos EBO | Ministério Vale das Virtudes",
        description: "Participe da EBO de 05 a 07 de setembro. Garanta já o seu ingresso!",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="pt-BR"
            className={`${montserrat.variable} ${cormorant.variable}`}
            data-scroll-behavior="smooth" // Isso diz que aplicamos o scroll smooth na página para evitar saltos indesejados
        >
            <body>{children}</body>
        </html>
    );
}

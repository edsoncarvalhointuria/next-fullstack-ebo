interface CredencialInterface {
    id: number;
    nome: string;
    id_transacao: string;
    id_cargo: number | string;
    id_congregacao: number | string | null;
    is_outra_congregacao: boolean;
    nome_outra_congregacao: null | string;
    is_titular: boolean;
}

interface CredencialResponse {
    id: number | string;
    nome: string;
    id_transacao: string;
    is_titular: boolean;

    id_cargo: number | string;
    nome_cargo: string;

    id_congregacao: number | string | null;
    nome_congregacao: string | null;

    is_outra_congregacao: boolean;
    nome_outra_congregacao: string | null;
    nome_comprador: string;
    email_comprador: string;
    whatsapp_comprador?: string;

    tipo_ingresso: string;
}

interface MetricasCardsCredenciais {
    totalCredenciais: number;
    lotacaoPercentual: number;
    congregacoesAlcancadas: number;
}

interface GraficoCredenciaisIgrejas {
    name: string;
    quantidadeCredenciais: number;
}

interface GraficoCredenciaisCargos {
    name: string;
    qtd: number;
    fill: string;
}

interface CredenciaisTotal {
    name: string;
    quantidadeTotal: number;
}

interface GraficosCrendenciaisResponse {
    cards: MetricasCardsCredenciais;
    congregacoes: GraficoCredenciaisIgrejas[];
    cargos: GraficoCredenciaisCargos[];
    inscricoes: CredenciaisTotal[];
}

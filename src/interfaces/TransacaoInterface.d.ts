type TypeStatusPedido = "pendente" | "aprovado" | "cancelado";
type TypeMetodosPagamento = "pix" | "boleto" | "cartao" | "dinheiro";

interface TransacaoInterface {
    id: string;
    id_comprador: number | string;
    id_ingresso: number | string;
    id_pagamento_mp: string | null;
    status_pagamento: TypeStatusPedido;
    valor_pedido: number;
    data_hora_pedido: any;
    metodo_pagamento: TypeMetodosPagamento;
}

interface TransacaoResponseCrendencial {
    id_credencial: string;
    nome_titular: string;
    tipo_ingresso: string;
    nome_cargo: string;
    nome_congregacao: string | null;
    is_outra_congregacao: boolean;
    nome_outra_congregacao: string | null;
    checkins: { id: string; data: string }[];
}

interface TransacaoResponse {
    id_transacao: string;
    data_compra: string;
    comprador: {
        nome: string;
        cpf: string;
        email: string;
    };
    pagamento: {
        status: TypeStatusPedido;
        metodo_pagamento: TypeMetodosPagamento;
        valor_total: number;
    };
    credenciais: TransacaoResponseCrendencial[];
}

interface GraficosTransacoes {
    id_transacao: string;
    data_pedido: string;
    valor: number;
    status: "pendente" | "cancelado" | "aprovado";
    metodo_pagamento: "boleto" | "cartao" | "dinheiro" | "pix";
    tipo_ingresso: string;
    titular_cargo: string;
    titular_congregacao: string;
}

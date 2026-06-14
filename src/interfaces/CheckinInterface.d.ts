interface CheckinResponse {
    sucesso: boolean;
    dados: {
        credencial: {
            id: number;
            nome: string;
            is_titular: boolean;
            cargo: string;
            congregacao: string | null;
            is_outra_congregacao: boolean;
            nome_outra_congregacao: string | null;
        };
        transacao: {
            status_pagamento: TypeStatusPedido;
            cpf_comprador: string;
        };
        ingresso: {
            nome_tipo: string;
        };
        checkin_hoje: {
            quantidade_registros: number;
        };
    };
}

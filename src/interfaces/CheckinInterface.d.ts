interface CheckinResponse {
    id: number;
    nome: string;
    is_titular: boolean;
    cargo: string;
    congregacao: string | null;
    is_outra_congregacao: boolean;
    nome_outra_congregacao: string | null;
    status_pagamento: TypeStatusPedido;
    cpf_comprador: string;
    email: string;
    nome_tipo: string;
    quantidade_registros: number;
}

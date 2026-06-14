interface IngressosInterface {
    id: number;
    nome_tipo: string;
    descricao: string;
    observacao?: string;
    quantidade_pessoas: number;
    ordem: number;
    preco: number;
    data_fim_vendas: null | string;
    is_ativo: boolean;
}

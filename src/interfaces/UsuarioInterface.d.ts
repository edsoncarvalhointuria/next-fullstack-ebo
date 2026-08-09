interface UsuarioInterface {
    id: string;
    nome: string;
    nivel: "super_admin" | "financeiro" | "portaria";
    is_ativo: boolean;
}

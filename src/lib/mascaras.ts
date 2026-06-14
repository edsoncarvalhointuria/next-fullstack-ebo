export function mascaraCpf(valor: string, pularSlice?: boolean) {
    let texto = valor.replace(/\D/g, "");

    if (texto.length > 11 && !pularSlice) texto = texto.slice(0, 11);

    texto = texto.replace(/(\d{3})(\d)/, "$1.$2");
    texto = texto.replace(/(\d{3})(\d)/, "$1.$2");
    texto = texto.replace(/(\d{3})(\d{1,2})/, "$1-$2");

    return texto;
}

export function mascaraCnpj(valor: string) {
    let texto = valor.replace(/\D/g, "");

    if (texto.length > 14) texto = texto.slice(0, 14);

    texto = texto.replace(/(\d{2})(\d)/, "$1.$2");
    texto = texto.replace(/(\d{3})(\d)/, "$1.$2");
    texto = texto.replace(/(\d{3})(\d)/, "$1/$2");
    texto = texto.replace(/(\d{4})(\d{1,2})/, "$1-$2");

    return texto;
}

export function mascaraCpfCnpj(valor: string) {
    let texto = valor.replace(/\D/g, "");

    if (texto.length <= 11) return mascaraCpf(texto);
    return mascaraCnpj(texto);
}

export function mascaraTelefone(valor: string) {
    let texto = valor.replace(/\D/g, "");

    if (texto.length > 11) texto = texto.slice(0, 11);

    texto = texto.replace(/(\d{2})(\d)/, "($1) $2");
    texto = texto.replace(/(\d{1})(\d{4})/, "$1 $2");
    texto = texto.replace(/(\d{4})(\d)/, "$1-$2");

    return texto;
}

export function mascaraCartao(valor: string) {
    let text = valor.replace(/\D/g, "");

    if (text.length > 16) text = text.slice(0, 16);

    text = text.replace(/(\d{4})(\d)/, "$1 $2");
    text = text.replace(/(\d{4})(\d)/, "$1 $2");
    text = text.replace(/(\d{4})(\d{1,4})/, "$1 $2");

    return text;
}

export function mascaraDataCartao(valor: string) {
    let texto = valor.replace(/\D/g, "");

    if (texto.length > 4) texto = texto.slice(0, 4);

    texto = texto.replace(/(\d{2})(\d{1,2})/, "$1/$2");

    return texto;
}

export function mascaraCvvCartao(valor: string) {
    let texto = valor.replace(/\D/g, "");

    if (texto.length > 4) texto = texto.slice(0, 4);

    return texto;
}

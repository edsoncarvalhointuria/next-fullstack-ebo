export function toCurrency(num: number) {
    return num.toLocaleString("pt-BR", { currency: "BRL", style: "currency" });
}

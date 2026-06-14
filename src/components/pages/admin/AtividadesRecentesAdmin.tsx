"use client";
import { useDataContext } from "@/contexts/DataContext";
import { ScrollText } from "lucide-react";

export default function AtividadesRecentes() {
    const {
        responsesMemo: { responseTransacoes },
    } = useDataContext();
    const transacoesLista = responseTransacoes.slice(
        responseTransacoes.length - 5,
        responseTransacoes.length,
    );

    return (
        <div className="admin__atividades-recentes">
            <h2 className="admin__atividades-recentes__title">
                <i>
                    <ScrollText />
                </i>
                <span>Atividades Recentes</span>
            </h2>

            <table className="admin__atividades-recentes__table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Data da Compra</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {transacoesLista.map((v, i) => (
                        <tr key={`atvdd-${i}`}>
                            <td>
                                <div className="admin__atividades-recentes__info">
                                    <p>{v.comprador.nome}</p>
                                </div>
                            </td>
                            <td>
                                <div className="admin__atividades-recentes__info">
                                    <data value={v.data_compra}>
                                        {new Date(
                                            v.data_compra,
                                        ).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "2-digit",
                                        })}
                                    </data>
                                </div>
                            </td>
                            <td>
                                <div className="admin__atividades-recentes__info">
                                    <p>{v.pagamento.status}</p>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

import { CloudOff } from "lucide-react";
import "./lista-vazia.scss";

export const ListaVazia = () => {
    return (
        <div className="lista-dados__lista--vazio">
            <i aria-hidden="true">
                <CloudOff />
            </i>
            <p>Nenhum Item encontrado</p>
        </div>
    );
};

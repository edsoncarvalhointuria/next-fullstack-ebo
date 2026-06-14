import { Send } from "lucide-react";
import "./modal.scss";

export default function ModalButtonSubmit() {
    return (
        <div className="modal__form__submit">
            <button title="Enviar" type="submit" className="modal__form__btn">
                <i>
                    <Send />
                </i>
                <span>Salvar</span>
            </button>
        </div>
    );
}

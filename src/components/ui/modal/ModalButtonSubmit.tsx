import { Send } from "lucide-react";
import "./modal.scss";

export default function ModalButtonSubmit({ disabled }: { disabled?: boolean }) {
    return (
        <div className="modal__form__submit">
            <button title="Enviar" type="submit" className="modal__form__btn" disabled={disabled}>
                <i aria-hidden="true">
                    <Send />
                </i>
                <span>Salvar</span>
            </button>
        </div>
    );
}

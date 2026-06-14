import { ReactNode, useCallback } from "react";
import ModalBase, { ModalBaseProps } from "./ModalBase";
import { useSearchParams } from "next/navigation";
import "./modal.scss";

interface ModalDeletarProps extends Omit<ModalBaseProps, "children"> {
    text?: string | ReactNode;
    onConfirm: () => void;
}
export default function ModalDeletar(props: ModalDeletarProps) {
    return (
        <ModalBase {...props}>
            {(closeModal) => (
                <div className="modal__deletar">
                    <div className="modal__deletar__container">
                        {typeof props.text === "string" ? (
                            <h3 className="modal__deletar__title">
                                {props.text}
                            </h3>
                        ) : (
                            props.text
                        )}
                    </div>

                    <div className="modal__deletar__buttons">
                        <button
                            className="modal__deletar__button modal__deletar__button--cancelar"
                            onClick={closeModal}
                        >
                            Cancelar
                        </button>
                        <button
                            className="modal__deletar__button modal__deletar__button--sim"
                            onClick={() => {
                                props.onConfirm();
                                closeModal();
                            }}
                        >
                            Sim, deletar
                        </button>
                    </div>
                </div>
            )}
        </ModalBase>
    );
}

export function ModalDeletarText({ text }: { text: string | ReactNode }) {
    return (
        <div className="modal__deletar__message">
            <h3 className="modal__deletar__title">{text}</h3>
            <p className="modal__deletar__info">
                Dica: Se quiser apenas esconder esta pergunta, você pode{" "}
                <b>desativá-la</b> na tela de edição em vez de excluir.
            </p>
        </div>
    );
}

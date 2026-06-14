import { CircleX } from "lucide-react";
import { ReactNode } from "react";
import "./modal.scss";

interface ModalHeaderProps {
    title: string;
    icon?: ReactNode;
    onClose: () => void;
}
export default function ModalHeader({
    title,
    icon,
    onClose,
}: ModalHeaderProps) {
    return (
        <div className="modal__header">
            <h2 className="modal__header__title">
                {icon && <i>{icon}</i>}
                <span>{title}</span>
            </h2>

            <button title="fechar modal" type="button" onClick={onClose}>
                <i>
                    <CircleX />
                </i>
            </button>
        </div>
    );
}

import { ReactNode } from "react";
import "./modal.scss";

export default function ModalFormContainer({
    children,
}: {
    children: ReactNode;
}) {
    return <div className="modal__form-container">{children}</div>;
}

import { ReactNode } from "react";
import "./modal.scss";

export default function ModalBody({ children }: { children: ReactNode }) {
    return <div className="modal__body">{children}</div>;
}

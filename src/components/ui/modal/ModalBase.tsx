"use client";

import { useSearchParams } from "next/navigation";
import Modal from "./Modal";
import ModalHeader from "./ModalHeader";
import { ReactNode, useCallback } from "react";
import ModalBody from "./ModalBody";

export interface ModalBaseProps {
    keyName: string;
    title: string;
    icon?: ReactNode;
    children: ((closeModal: () => void) => ReactNode) | ReactNode;
}

export default function ModalBase({
    keyName,
    title,
    icon,
    children,
}: ModalBaseProps) {
    const params = useSearchParams();
    const isOpen = params.get("modal") === keyName;

    const closeModal = useCallback(() => {
        const currentParams = new URLSearchParams(params.toString());
        currentParams.delete("modal");
        window.history.pushState(null, "", "?" + currentParams.toString());
    }, [params]);
    return (
        <Modal isOpen={isOpen} onClose={closeModal}>
            <ModalHeader onClose={closeModal} title={title} icon={icon} />
            <ModalBody>
                {typeof children === "function"
                    ? children(closeModal)
                    : children}
            </ModalBody>
        </Modal>
    );
}

"use client";

import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { ReactNode } from "react";
import "./modal.scss";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ backdropFilter: "blur(4px)", opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    whileTap={{ backdropFilter: "blur(1px)" }}
                    onClick={onClose}
                    className="modal__overlay"
                >
                    <motion.div
                        initial={{ y: "50%", opacity: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import "./forms.scss";

const errorVariants: Variants = {
    initial: { opacity: 0, y: 10, height: 0 },
    animate: { opacity: 1, y: 0, height: "auto" },
    exit: { opacity: 0, y: 10, height: 0 },
};

export default function ErrorMessage({ message }: { message?: string }) {
    return (
        <AnimatePresence>
            {message && (
                <div style={{ overflow: "hidden" }}>
                    <motion.p
                        variants={errorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="forms__input-erro-message"
                    >
                        {message}
                    </motion.p>
                </div>
            )}
        </AnimatePresence>
    );
}

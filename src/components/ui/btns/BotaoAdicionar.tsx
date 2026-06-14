"use client";

import { motion } from "framer-motion";
import "./botao-adicionar.scss";

export default function BotaoAdicionar({
    className,
    text,
}: {
    className?: string;
    text: string;
}) {
    return (
        <motion.button
            className={`btn-acao ${className}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
        >
            {text}
        </motion.button>
    );
}

"use client";

import { motion } from "framer-motion";
import "./form-error-p.scss";

export default function FormErrorP() {
    return (
        <motion.p className="base-config__form--error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            Houve um erro, tente novamente
        </motion.p>
    );
}

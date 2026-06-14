"use client";
import { motion } from "framer-motion";
import Whatsapp from "@/components/ui/icons/Whatsapp";

export default function BotaoWhatsapp() {
    return (
        <motion.a
            href="#"
            className="ingressos__whats"
            whileHover={{
                backgroundColor: "#21be5c",
                rotate: "5deg",
                scale: 1.1,
            }}
            whileTap={{ scale: 0.95 }}
        >
            <Whatsapp />
        </motion.a>
    );
}

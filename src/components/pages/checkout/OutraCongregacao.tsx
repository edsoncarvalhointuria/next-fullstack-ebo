"use client";
import { useFormContext, useWatch } from "react-hook-form";
import { FormCheckout } from "./FormularioCheckout";
import { motion } from "framer-motion";
import TextInput from "@/components/forms/TextInput";
import { memo } from "react";

function OutraCongregacao({
    messageError,
    index,
}: {
    messageError?: string;
    index?: number;
}) {
    const { register, control } = useFormContext<FormCheckout>();
    const isAcompanhante = typeof index === "number";
    const congregacao = useWatch({
        control,
        name: isAcompanhante
            ? `acompanhantes.${index}.congregacao`
            : "congregacao",
    });

    return (
        congregacao === "outra" && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <TextInput
                    label={
                        isAcompanhante
                            ? "Digite a congregação"
                            : "Digite o nome da sua congregação"
                    }
                    nameForm={
                        isAcompanhante
                            ? `acompanhantes.${index}.nomeOutraCongregacao`
                            : "nomeOutraCongregacao"
                    }
                    messageError={messageError}
                    register={register}
                />
            </motion.div>
        )
    );
}

export default memo(OutraCongregacao);

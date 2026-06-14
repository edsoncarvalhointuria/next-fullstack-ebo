"use client";

import { motion, Variants } from "framer-motion";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import ContainerInput from "./ContainerInput";
import ErrorMessage from "./ErrorMessage";
import React, { HTMLInputTypeAttribute } from "react";

export interface GenericInputProps<T extends FieldValues> {
    label: string;
    nameForm: Path<T>;
    isRequired?: boolean;
    messageError?: string;
    placeholder?: string;
    type: HTMLInputTypeAttribute;
    register: UseFormRegister<T>;
    mascara?: (texto: string) => string;
}
const variantsInput: Variants = {
    initial: { x: 0 },
    animate: (m) => {
        if (!m) return {};
        return {
            x: [-50, 50, -50, 0],
            transition: { duration: 0.4, ease: "easeInOut" },
        };
    },
};
function GenericInput<T extends FieldValues>({
    type,
    label,
    register,
    nameForm,
    mascara,
    placeholder,
    messageError,
    isRequired = true,
}: GenericInputProps<T>) {
    const { onChange, ...r } = register(nameForm);

    return (
        <ContainerInput>
            <label className="forms__input-label" htmlFor={nameForm + "text"}>
                {label} {isRequired && <span>*</span>}
            </label>
            <motion.input
                type={type}
                id={nameForm + "text"}
                className={messageError ? "forms__input--error" : ""}
                variants={variantsInput}
                animate={"animate"}
                custom={messageError}
                {...r}
                onChange={(e) => {
                    if (mascara) e.target.value = mascara(e.target.value);
                    onChange(e);
                }}
                placeholder={placeholder}
                initial="initial"
            />

            <ErrorMessage message={messageError} />
        </ContainerInput>
    );
}

export default React.memo(GenericInput) as typeof GenericInput;

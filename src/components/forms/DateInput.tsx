"use client";

import { motion, Variants } from "framer-motion";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import ContainerInput from "./ContainerInput";
import ErrorMessage from "./ErrorMessage";
import React, { HTMLInputTypeAttribute } from "react";

export interface DateInputProps<T extends FieldValues> {
    label: string;
    nameForm: Path<T>;
    isRequired?: boolean;
    messageError?: string;
    placeholder?: string;
    type?: "date" | "datetime-local";
    register: UseFormRegister<T>;
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
function DateInput<T extends FieldValues>({
    label,
    register,
    nameForm,
    placeholder,
    messageError,
    type = "date",
    isRequired = true,
}: DateInputProps<T>) {
    return (
        <ContainerInput className="forms__input__date">
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
                {...register(nameForm)}
                placeholder={placeholder}
                initial="initial"
            />

            <ErrorMessage message={messageError} />
        </ContainerInput>
    );
}

export default React.memo(DateInput) as typeof DateInput;

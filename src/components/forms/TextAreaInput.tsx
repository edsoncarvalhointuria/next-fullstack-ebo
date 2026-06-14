"use client";
import { motion, Variants } from "framer-motion";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import ContainerInput from "./ContainerInput";
import ErrorMessage from "./ErrorMessage";
import { memo } from "react";

export interface GenericInputProps<T extends FieldValues> {
    label: string;
    nameForm: Path<T>;
    isRequired?: boolean;
    messageError?: string;
    placeholder?: string;
    register: UseFormRegister<T>;
}
const variantsInput: Variants = {
    initial: { x: 0 },
    animate: (m) => {
        if (!m) return {};
        return {
            x: [-5, 5, -5, 5, 0],
            transition: { duration: 0.4, ease: "easeInOut" },
        };
    },
};
function TextAreaInput<T extends FieldValues>({
    label,
    register,
    nameForm,
    placeholder,
    messageError,
    isRequired = true,
}: GenericInputProps<T>) {
    return (
        <ContainerInput className="forms__input__area">
            <label className="forms__input-label" htmlFor={nameForm + "area"}>
                {label} {isRequired && <span>*</span>}
            </label>
            <motion.div
                variants={variantsInput}
                initial="initial"
                animate={"animate"}
                custom={messageError}
            >
                <textarea
                    id={nameForm + "area"}
                    className={messageError ? "forms__input--error" : ""}
                    {...register(nameForm)}
                    placeholder={placeholder}
                />
            </motion.div>

            <ErrorMessage message={messageError} />
        </ContainerInput>
    );
}

export default memo(TextAreaInput) as typeof TextAreaInput;

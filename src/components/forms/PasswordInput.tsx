"use client";

import { motion, Variants } from "framer-motion";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import ContainerInput from "./ContainerInput";
import ErrorMessage from "./ErrorMessage";
import React, { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import "./forms.scss";

export interface PasswordInputProps<T extends FieldValues> {
    label: string;
    nameForm: Path<T>;
    isRequired?: boolean;
    messageError?: string;
    placeholder?: string;
    register: UseFormRegister<T>;
    mascara?: (texto: string) => string;
}
const variantsInput: Variants = {
    initial: { x: 0 },
    animate: (m) => {
        if (!m) return {};
        return {
            x: [-3, 3, -3, 0],
            transition: { duration: 0.4, ease: "easeInOut" },
        };
    },
};
function PasswordInput<T extends FieldValues>({
    label,
    register,
    nameForm,
    mascara,
    placeholder,
    messageError,
    isRequired = true,
}: PasswordInputProps<T>) {
    const [show, setShow] = useState(false);
    const { onChange, ...r } = register(nameForm);

    return (
        <ContainerInput className="forms__input__password">
            <label className="forms__input-label" htmlFor={nameForm + "text"}>
                {label} {isRequired && <span>*</span>}
            </label>
            <motion.div
                className="forms__input__password-container"
                variants={variantsInput}
                initial="initial"
                animate={"animate"}
                custom={messageError}
            >
                <input
                    type={show ? "text" : "password"}
                    id={nameForm + "text"}
                    className={messageError ? "forms__input--error" : ""}
                    {...r}
                    onChange={(e) => {
                        if (mascara) e.target.value = mascara(e.target.value);
                        onChange(e);
                    }}
                    placeholder={placeholder}
                />

                <motion.i onTap={() => setShow((v) => !v)}>
                    {show ? <Eye size={24} /> : <EyeClosed size={24} />}
                </motion.i>
            </motion.div>

            <ErrorMessage message={messageError} />
        </ContainerInput>
    );
}

export default React.memo(PasswordInput) as typeof PasswordInput;

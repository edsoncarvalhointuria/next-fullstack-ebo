"use client";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import ContainerInput from "./ContainerInput";
import ErrorMessage from "./ErrorMessage";
import { AnimatePresence, motion, Variants } from "framer-motion";
import "./forms.scss";
import React, { HTMLInputAutoCompleteAttribute } from "react";

export interface InputTextProps<T extends FieldValues> {
    label: string;
    nameForm: Path<T>;
    isRequired?: boolean;
    messageError?: string;
    placeholder?: string;
    inputMode?: InputModeType;
    autoComplete?: HTMLInputAutoCompleteAttribute;
    register: UseFormRegister<T>;
    mascara?: (texto: string) => string;
    info?: string;
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
function TextInput<T extends FieldValues>({
    label,
    register,
    nameForm,
    mascara,
    info,
    placeholder,
    messageError,
    inputMode,
    autoComplete,
    isRequired = true,
}: InputTextProps<T>) {
    const { onChange, ...r } = register(nameForm);

    return (
        <ContainerInput>
            <label className="forms__input-label" htmlFor={nameForm + "text"}>
                {label} {isRequired && <span>*</span>}
            </label>
            <motion.input
                type="text"
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
                inputMode={inputMode}
                autoComplete={autoComplete}
            />

            {!messageError && info && (
                <p className="forms__input-message">{info}</p>
            )}

            <ErrorMessage message={messageError} />
        </ContainerInput>
    );
}

export default React.memo(TextInput) as typeof TextInput;

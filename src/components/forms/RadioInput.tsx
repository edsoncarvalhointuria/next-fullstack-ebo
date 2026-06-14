"use client";

import React, { ReactNode } from "react";
import { FormCheckout } from "../pages/checkout/FormularioCheckout";
import { UseFormRegister } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import "./forms.scss";

export interface InputRadioProps {
    label: string;
    nameForm: keyof FormCheckout;
    messageError?: string;
    register: UseFormRegister<FormCheckout>;
    icon?: ReactNode;
    className?: string;
    value: string;
}

function RadioInput({
    label,
    nameForm,
    register,
    className,
    icon,
    messageError,
    value,
}: InputRadioProps) {
    return (
        <div className={`forms__input__radio ${className}`}>
            <input
                type="radio"
                id={`forms-radio-${label}`}
                value={value}
                {...register(nameForm)}
            />
            <label htmlFor={`forms-radio-${label}`}>
                {!!icon && <i>{icon}</i>}
                <span>{label}</span>
            </label>
            <ErrorMessage message={messageError} />
        </div>
    );
}

export default React.memo(RadioInput) as typeof RadioInput;

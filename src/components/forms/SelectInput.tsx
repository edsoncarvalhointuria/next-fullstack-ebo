"use client";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import Dropdown, { ItemDropdownDefault } from "../ui/Dropdown";
import ContainerInput from "./ContainerInput";
import ErrorMessage from "./ErrorMessage";
import React, { ReactNode } from "react";

export interface SelectInputProps<T extends FieldValues> {
    lista: ItemDropdownDefault[];
    control: Control<T>;
    children?: ReactNode;

    nameForm: Path<T>;
    label: string;
    isRequired?: boolean;
    placeholder?: string;
    messageError?: string;
}
function SelectInput<T extends FieldValues>({
    lista,
    control,
    nameForm,
    placeholder,
    messageError,
    label,
    isRequired = true,
    children,
}: SelectInputProps<T>) {
    return (
        <ContainerInput className="forms__input--message">
            <p className="forms__input-label">
                {label} {isRequired && <span>*</span>}
            </p>

            <Controller
                control={control}
                name={nameForm}
                render={({ field }) => (
                    <Dropdown
                        currentValue={lista.find((v) => v.id == field.value)}
                        onSelected={(v: any) => field.onChange(String(v.id))}
                        lista={lista}
                        placeholder={placeholder}
                        classError={
                            messageError ? "forms__input--error" : undefined
                        }
                    />
                )}
            />

            <ErrorMessage message={messageError} />

            {children}
        </ContainerInput>
    );
}

export default React.memo(SelectInput) as typeof SelectInput;

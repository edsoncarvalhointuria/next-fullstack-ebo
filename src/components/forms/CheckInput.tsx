import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import ContainerInput from "./ContainerInput";
import ErrorMessage from "./ErrorMessage";
import "./forms.scss";
import { memo } from "react";

interface InputCheckProps<T extends FieldValues> {
    label: string;
    nameForm: Path<T>;
    isRequired?: boolean;
    messageError?: string;
    register: UseFormRegister<T>;
}

function CheckInput<T extends FieldValues>({
    label,
    nameForm,
    register,
    messageError,
    isRequired = true,
}: InputCheckProps<T>) {
    const { onChange, ...r } = register(nameForm);
    return (
        <ContainerInput className="forms__input--check">
            <p className="forms__input-label">
                {label} {isRequired && <span>*</span>}
            </p>
            <div className="forms__input--toggle">
                <input
                    type="checkbox"
                    {...r}
                    id={`form-is-ativo-${nameForm}`}
                    onChange={onChange}
                />
                <label htmlFor={`form-is-ativo-${nameForm}`}></label>
            </div>
            <ErrorMessage message={messageError} />
        </ContainerInput>
    );
}

export default memo(CheckInput) as typeof CheckInput;

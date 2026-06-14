"use no memo";
"use client";

import { mascaraTelefone } from "@/lib/mascaras";
import TextInput from "@/components/forms/TextInput";
import SelectInput from "@/components/forms/SelectInput";
import { useFormContext, useFormState } from "react-hook-form";
import { FormCheckout } from "./FormularioCheckout";
import { ItemDropdownDefault } from "@/components/ui/Dropdown";
import OutraCongregacao from "./OutraCongregacao";
import ContainerInput from "@/components/forms/ContainerInput";
import { HTMLInputAutoCompleteAttribute, useMemo } from "react";
import { useDataContext } from "@/contexts/DataContext";

interface ItensFormularioPadrao<T> {
    nameForm: keyof T;
    label: string;
    isRequired?: boolean;
    placeholder?: string;
}

interface ItensFormularioTexto<T> extends ItensFormularioPadrao<T> {
    type: "texto";
    mascara?: (texto: string) => string;
    info?: string;
    inputMode?: InputModeType;
    autoComplete?: HTMLInputAutoCompleteAttribute;
}
interface ItensFormularioSelect<T> extends ItensFormularioPadrao<T> {
    type: "select";
    lista: ItemDropdownDefault[];
    isOutraCongregacao?: boolean;
}

export const getInputsComprador = <T,>(
    congregacoes: CongregacaoInterface[],
    cargos: CargosInterface[],
): (ItensFormularioSelect<T> | ItensFormularioTexto<T>)[] => {
    return [
        {
            type: "texto",
            label: "Seu Nome Completo",
            nameForm: "nomeCompleto" as keyof T,
            info: "Seu nome será utilizado na personalização de materiais exclusivos da EBO",
            autoComplete: "name",
        },
        {
            type: "select",
            lista: [{ id: "outra", nome: "outra" }, ...congregacoes],
            nameForm: "congregacao" as keyof T,
            label: "Sua Congregação",
            isOutraCongregacao: true,
        },
        {
            type: "select",
            lista: cargos,
            nameForm: "cargo" as keyof T,
            label: "Seu Cargo",
        },
        {
            type: "texto",
            label: "Seu E-mail",
            nameForm: "email" as keyof T,
            placeholder: "email@email.com",
            info: "O comprovante será enviado para o email",
            inputMode: "email",
            autoComplete: "email",
        },
        {
            type: "texto",
            label: "Seu Whatsapp",
            nameForm: "whatsapp" as keyof T,
            isRequired: false,
            placeholder: "(11) 99999-9999",
            mascara: mascaraTelefone,
            inputMode: "tel",
            autoComplete: "tel",
        },
    ];
};

export default function InputsComprador() {
    const { congregacoes, cargos } = useDataContext();
    const { register, control } = useFormContext<FormCheckout>();
    const { errors } = useFormState({ control });

    const inputsComprador = useMemo(
        () => getInputsComprador<FormCheckout>(congregacoes, cargos),
        [congregacoes, cargos],
    );

    return inputsComprador.map((v, i) => {
        return v.type === "texto" ? (
            <TextInput<FormCheckout>
                key={i + v.nameForm}
                {...v}
                register={register}
                messageError={errors?.[v.nameForm]?.message}
            />
        ) : v.isOutraCongregacao ? (
            <ContainerInput key={i + v.nameForm}>
                <SelectInput
                    {...v}
                    control={control}
                    messageError={errors?.[v.nameForm]?.message}
                />

                <OutraCongregacao
                    messageError={errors?.["nomeOutraCongregacao"]?.message}
                />
            </ContainerInput>
        ) : (
            <SelectInput
                {...v}
                control={control}
                key={i + v.nameForm}
                messageError={errors?.[v.nameForm]?.message}
            />
        );
    });
}

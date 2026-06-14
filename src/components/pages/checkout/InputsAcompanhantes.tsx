"use no memo";
"use client";
import TextInput from "@/components/forms/TextInput";
import SelectInput from "@/components/forms/SelectInput";
import OutraCongregacao from "./OutraCongregacao";
import {
    FieldValues,
    useFormContext,
    useFormState,
    useWatch,
} from "react-hook-form";
import { FormCheckout } from "./FormularioCheckout";
import ContainerInput from "@/components/forms/ContainerInput";
import { useEffect, useMemo } from "react";
import { useDataContext } from "@/contexts/DataContext";

export default function InputsAcompanhantes({ qtd }: { qtd: number }) {
    const { cargos, congregacoes } = useDataContext();
    const { register, control, setValue } = useFormContext<FormCheckout>();
    const { errors } = useFormState({ control });
    const congregacao = useWatch({ control, name: "congregacao" });
    const congregacoesMemo = useMemo(
        () => [{ id: "outra", nome: "outra" }, ...congregacoes],
        [congregacao],
    );
    useEffect(() => {
        if (congregacao) {
            Array.from({ length: qtd }).forEach((_, i) =>
                setValue(`acompanhantes.${i}.congregacao`, congregacao),
            );
        }
    }, [congregacao]);
    return Array.from({
        length: qtd,
    }).map((_, i) => (
        <div key={i} className="checkout__form-acompanhante">
            <h2>Acompanhante</h2>
            <TextInput
                key={`acompanhante-nome-${i}`}
                label="Nome Acompanhante"
                nameForm={`acompanhantes.${i}.nomeCompleto`}
                register={register}
                messageError={errors?.acompanhantes?.[i]?.nomeCompleto?.message}
                autoComplete="companion-name"
            />
            <ContainerInput>
                <SelectInput
                    nameForm={`acompanhantes.${i}.congregacao`}
                    label={"Congregação"}
                    control={control}
                    key={"congregacaoAcompanhante" + i}
                    messageError={
                        errors?.acompanhantes?.[i]?.congregacao?.message
                    }
                    lista={congregacoesMemo}
                />
                <OutraCongregacao
                    index={i}
                    messageError={
                        errors.acompanhantes?.[i]?.nomeOutraCongregacao?.message
                    }
                />
            </ContainerInput>

            <SelectInput
                control={control}
                key={"cargoAcompanhante" + i}
                messageError={errors?.acompanhantes?.[i]?.cargo?.message}
                lista={cargos}
                nameForm={`acompanhantes.${i}.cargo`}
                label={"Cargo"}
            />
        </div>
    ));
}

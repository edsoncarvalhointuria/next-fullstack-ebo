"use no memo";
"use client";

import Pix from "@/components/ui/icons/Pix";
import { CreditCard, ReceiptText } from "lucide-react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { FormCheckout } from "./FormularioCheckout";
import RadioInput from "@/components/forms/RadioInput";
import ErrorMessage from "@/components/forms/ErrorMessage";
import ContainerInput from "@/components/forms/ContainerInput";
import TextInput from "@/components/forms/TextInput";
import {
    mascaraCartao,
    mascaraCpf,
    mascaraCpfCnpj,
    mascaraCvvCartao,
    mascaraDataCartao,
} from "@/lib/mascaras";
import GroupInputContainer from "@/components/forms/GroupInput";
import { AnimatePresence, motion } from "framer-motion";

export default function InputsPagamento() {
    const { control, register } = useFormContext<FormCheckout>();
    const { errors } = useFormState({ control });
    const pagamento = useWatch({ control, name: "opcaoPagamento" });

    return (
        <div className="checkout__pagamentos">
            <h4>Escolha a forma de pagamento</h4>
            <div className="checkout__pagamentos-opcoes">
                <ErrorMessage message={errors.opcaoPagamento?.message} />

                <RadioInput
                    label="Pix"
                    value="pix"
                    nameForm="opcaoPagamento"
                    register={register}
                    icon={<Pix />}
                    className="checkout__pagamento--pix"
                />
                <RadioInput
                    label="Boleto"
                    value="boleto"
                    nameForm="opcaoPagamento"
                    register={register}
                    icon={<ReceiptText />}
                    className="checkout__pagamento--boleto"
                />
                <RadioInput
                    label="Cartão de Crédito"
                    value="cartao"
                    nameForm="opcaoPagamento"
                    register={register}
                    icon={<CreditCard />}
                    className="checkout__pagamento--cartao"
                />
            </div>

            <div className="checkout__pagamentos-inputs">
                <TextInput
                    label="CPF/CNPJ"
                    nameForm="cpf_cnpj"
                    register={register}
                    messageError={errors.cpf_cnpj?.message}
                    mascara={mascaraCpfCnpj}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                />

                <AnimatePresence>
                    {pagamento === "cartao" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10, height: 0 }}
                            style={{ display: "grid", gap: "1rem" }}
                        >
                            <TextInput
                                label="Nome do Titular"
                                nameForm="nomeTitular"
                                register={register}
                                messageError={errors.nomeTitular?.message}
                                autoComplete="name"
                            />

                            <TextInput
                                label="Número do cartão"
                                nameForm="numeroCartao"
                                register={register}
                                messageError={errors.numeroCartao?.message}
                                mascara={mascaraCartao}
                                placeholder="0000 0000 0000 0000"
                                inputMode="numeric"
                                autoComplete="cc-number"
                            />

                            <GroupInputContainer>
                                <TextInput
                                    label="Data de validade"
                                    nameForm="dataValidade"
                                    register={register}
                                    messageError={errors.dataValidade?.message}
                                    mascara={mascaraDataCartao}
                                    placeholder="MM/AA"
                                    inputMode="numeric"
                                    autoComplete="cc-exp"
                                />

                                <TextInput
                                    label="CVV"
                                    nameForm="cvv"
                                    register={register}
                                    messageError={errors.cvv?.message}
                                    mascara={mascaraCvvCartao}
                                    placeholder="123"
                                    autoComplete="cc-csc"
                                />
                            </GroupInputContainer>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="checkout__pagamentos-footer">
                <div className="checkout__pagamentos-termos">
                    <ContainerInput className="forms__input__check">
                        <input
                            type="checkbox"
                            id="termos"
                            {...register("termos")}
                        />
                        <label
                            className={`forms__input-label ${errors.termos?.message ? "forms__input-label--erro" : ""}`}
                            htmlFor="termos"
                        >
                            Li e concordo com os <a href="#">termos de uso</a>
                        </label>
                    </ContainerInput>
                    <ErrorMessage message={errors.termos?.message} />
                </div>
                <button className="checkout__comprar">Finalizar Compra</button>
            </div>
        </div>
    );
}

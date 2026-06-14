"use client";

import MotionMain from "@/components/layout/MotionMain";
import {
    CalendarCheck2,
    Church,
    CircleCheck,
    CircleX,
    Clock,
    CreditCard,
    FolderSearch,
    HousePlus,
    Scroll,
    SquareUserRound,
    TicketCheck,
    X,
} from "lucide-react";
import Dropdown, { ItemDropdownDefault } from "@/components/ui/Dropdown";
import "./checkin.scss";
import { Controller, useForm, useWatch } from "react-hook-form";
import TextInput from "@/components/forms/TextInput";
import { mascaraCpfCnpj } from "@/lib/mascaras";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Search from "@/components/ui/Search";
import { Suspense, useCallback, useState } from "react";
import { testeCheckinResponses } from "../../../../../../config/datasTeste";
import { useSearchParams } from "next/navigation";
import Modal from "@/components/ui/modal/Modal";
import { useDataContext } from "@/contexts/DataContext";

const opcoes: ItemDropdownDefault[] = [
    { nome: "Todos", id: "todos" },
    { nome: "CPF/CNPJ Comprador", id: "cpf-comprador" },
    { nome: "Email Comprador", id: "email-comprador" },
    { nome: "Código", id: "codigo" },
    { nome: "Nome Completo", id: "nome-completo" },
];

const schema = z.object({
    search: z.string().min(3, "Campo obrigatório"),
    tipo: z.object({ nome: z.string(), id: z.string() }).optional(),
});
type FormCheckin = z.infer<typeof schema>;

const ModalCheckin = () => {
    const { addCheckin } = useDataContext();
    const params = useSearchParams();
    const id = params.get("id");
    const modal = params.get("modal");
    const item = testeCheckinResponses.find(
        (v) => String(v.dados.credencial.id) === id,
    );
    const credencial = item?.dados.credencial;
    const isOpen = modal === "checkin" && id;

    const closeModal = useCallback(() => {
        const url = new URLSearchParams(params.toString());
        url.delete("modal");
        url.delete("id");

        window.history.pushState(null, "", `?${url.toString()}`);
    }, []);
    return (
        <Modal isOpen={!!isOpen} onClose={closeModal}>
            <div
                className={`checkin__modal ${credencial?.is_outra_congregacao ? "checkin__modal--visitante" : ""}`}
            >
                <button
                    className="checkin__modal__close"
                    title="Fechar Modal"
                    type="button"
                    onClick={closeModal}
                >
                    <i>
                        <X size={34} />
                    </i>
                </button>

                <div className="checkin__modal__conteudo">
                    {(item?.dados.checkin_hoje.quantidade_registros || 0) >
                        0 && (
                        <div className="checkin__modal__aviso">
                            <p>Usuário já fez checkin hoje</p>
                        </div>
                    )}

                    <h2
                        className={`checkin__modal__title checkin__modal__title--${item?.dados.transacao.status_pagamento}`}
                    >
                        <span>
                            Pagamento:
                            <strong>
                                {item?.dados.transacao.status_pagamento}
                            </strong>
                        </span>
                        <i>
                            {item?.dados.transacao.status_pagamento ===
                            "aprovado" ? (
                                <CircleCheck />
                            ) : item?.dados.transacao.status_pagamento ===
                              "pendente" ? (
                                <Clock />
                            ) : (
                                <CircleX />
                            )}
                        </i>
                    </h2>

                    <div className="checkin__modal__credencial">
                        <h3 className="checkin__modal__nome">
                            <i>
                                <SquareUserRound size={44} />
                            </i>
                            <span>{credencial?.nome}</span>
                        </h3>

                        {credencial?.is_outra_congregacao ? (
                            <p className="checkin__modal__congregacao checkin__modal__outra-congregacao">
                                <i>
                                    <HousePlus />
                                </i>
                                {credencial?.nome_outra_congregacao}
                            </p>
                        ) : (
                            <p className="checkin__modal__congregacao">
                                <i>
                                    <Church />
                                </i>
                                {credencial?.congregacao}
                            </p>
                        )}

                        <p className="checkin__modal__cargo">
                            <i>
                                <Scroll />
                            </i>
                            {credencial?.cargo}
                        </p>
                    </div>

                    <div className="checkin__modal__infos">
                        <p className="checkin__modal__titular">
                            <span>
                                {item?.dados.credencial.is_titular
                                    ? "Titular"
                                    : "Não é titular"}
                            </span>
                        </p>
                        <p className="checkin__modal__cpf">
                            <span>CPF PAGADOR: </span>
                            <strong>
                                {item?.dados.transacao.cpf_comprador}
                            </strong>
                        </p>

                        <p className="checkin__modal__tipo-ingresso">
                            <i>
                                <TicketCheck />
                            </i>
                            <span>Tipo Ingresso:</span>
                            <strong>{item?.dados.ingresso.nome_tipo}</strong>
                        </p>
                    </div>
                </div>
                <div className="checkin__modal__button">
                    <button
                        className="checkin__modal__checkin"
                        title="Fazer Checkin"
                        type="button"
                        onClick={() => {
                            addCheckin({
                                data_hora_checkin: new Date().toISOString(),
                                id: Date.now(),
                                id_credencial: credencial!.id,
                                id_usuario: "dfsdfsd",
                            });
                            closeModal();
                        }}
                    >
                        FAZER CHECKIN
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default function Checkin() {
    const [_, setPesquisa] = useState("");

    const methods = useForm<FormCheckin>({ resolver: zodResolver(schema) });
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = methods;

    const onSubmit = (v: FormCheckin) => {
        console.log(v);
    };

    const tipo = useWatch({ control, name: "tipo" });
    let mascara = undefined;
    let inputMode = undefined;
    let placeholder = undefined;
    switch (tipo?.id) {
        case "cpf-comprador":
            mascara = mascaraCpfCnpj;
            inputMode = "numeric";
            placeholder = "000.000.000-00";
            break;
        case "email-comprador":
            inputMode = "email";
            placeholder = "email@email.com";
            break;
        case "codigo":
            placeholder = "Código enviado por email";
            break;
        case "nome-completo":
            placeholder = "Digite o nome completo";
            break;
        default:
            placeholder = "Digite para pesquisar";
            inputMode = "text";
    }
    return (
        <>
            <MotionMain className="checkin">
                <section className="checkin__header">
                    <h1>
                        <i>
                            <CalendarCheck2 size={34} />
                        </i>
                        <span>Checkin</span>
                    </h1>
                </section>

                <section className="checkin__body">
                    <form
                        className="checkin__filtros"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="checkin__drop">
                            <Controller
                                control={control}
                                name="tipo"
                                render={({ field }) => (
                                    <Dropdown
                                        lista={opcoes}
                                        currentValue={field.value}
                                        onSelected={(v: any) => {
                                            field.onChange(v);
                                            setValue("search", "");
                                        }}
                                        key={"form-tipo"}
                                        placeholder="Selecione o tipo de valor"
                                    />
                                )}
                            />
                        </div>
                        <div className="checkin__text">
                            <TextInput
                                label="Pesquisa"
                                register={register}
                                isRequired
                                nameForm="search"
                                inputMode={inputMode as any}
                                mascara={mascara}
                                messageError={errors.search?.message}
                                placeholder={placeholder}
                            />
                        </div>

                        <button
                            className="checkin__pesquisar"
                            type="submit"
                            title="pesquisar"
                        >
                            <i>
                                <FolderSearch />
                            </i>
                            <span>Consultar</span>
                        </button>
                    </form>

                    <div className="checkin__lista">
                        <div className="checkin__lista__pesquisa">
                            <Search
                                onSearch={setPesquisa}
                                placeholder="Pesquisar Credencial"
                            />
                        </div>

                        <div className="checkin__lista__itens">
                            {testeCheckinResponses.map((v) => (
                                <button
                                    key={v.dados.credencial.id}
                                    className="checkin__lista__item"
                                    type="button"
                                    title={`Selecionar ${v.dados.credencial.nome}`}
                                    onClick={() =>
                                        window.history.pushState(
                                            null,
                                            "",
                                            `?modal=checkin&id=${v.dados.credencial.id}`,
                                        )
                                    }
                                >
                                    <strong className="checkin__lista__item__nome">
                                        {v.dados.credencial.nome}
                                    </strong>
                                    <span
                                        className={`checkin__lista__item__pagamento checkin__lista__item__pagamento--${v.dados.transacao.status_pagamento}`}
                                    >
                                        <span>Status Pagamento:</span>
                                        <i>
                                            {v.dados.transacao
                                                .status_pagamento ===
                                            "aprovado" ? (
                                                <CircleCheck size={34} />
                                            ) : v.dados.transacao
                                                  .status_pagamento ===
                                              "pendente" ? (
                                                <Clock size={34} />
                                            ) : (
                                                <CircleX />
                                            )}
                                        </i>
                                    </span>

                                    <span className="checkin__lista__item__congregacao">
                                        {v.dados.credencial.congregacao ||
                                            `Visitante: ${v.dados.credencial.nome_outra_congregacao}`}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            </MotionMain>
            <Suspense>
                <ModalCheckin />
            </Suspense>
        </>
    );
}

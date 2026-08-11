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
import { Suspense, useCallback, useMemo, useState } from "react";
import Modal from "@/components/ui/modal/Modal";
import { fazerCheckin, searchCredenciais } from "@/actions/checkin";
import { ListaVazia } from "@/components/pages/config-site/ListaVazia";

const opcoes: ItemDropdownDefault[] = [
    { nome: "Todos", id: "todos" },
    { nome: "CPF/CNPJ Comprador", id: "cpf_comprador" },
    { nome: "Email Comprador", id: "email" },
    { nome: "Nome Completo", id: "nome" },
    // { nome: "Código", id: "codigo" },
];

const schema = z.object({
    search: z.string().min(3, "Campo obrigatório"),
    tipo: z.object({ nome: z.string(), id: z.string() }).optional(),
});
type FormCheckin = z.infer<typeof schema>;

const ModalCheckin = ({ checkin, closeModal }: { checkin: CheckinResponse | null; closeModal: () => void }) => {
    return (
        <Modal isOpen={!!checkin} onClose={closeModal}>
            <div className={`checkin__modal ${checkin?.is_outra_congregacao ? "checkin__modal--visitante" : ""}`}>
                <button className="checkin__modal__close" title="Fechar Modal" type="button" onClick={closeModal}>
                    <i aria-hidden="true">
                        <X size={30} />
                    </i>
                </button>

                <div className="checkin__modal__conteudo">
                    {(checkin?.quantidade_registros || 0) > 0 && (
                        <div className="checkin__modal__aviso">
                            <p>Usuário já fez checkin hoje</p>
                        </div>
                    )}

                    <h2 className={`checkin__modal__title checkin__modal__title--${checkin?.status_pagamento}`}>
                        <span>
                            Pagamento:
                            <strong>{checkin?.status_pagamento}</strong>
                        </span>
                        <i aria-hidden="true">
                            {checkin?.status_pagamento === "aprovado" ? (
                                <CircleCheck />
                            ) : checkin?.status_pagamento === "pendente" ? (
                                <Clock />
                            ) : (
                                <CircleX />
                            )}
                        </i>
                    </h2>

                    <div className="checkin__modal__credencial">
                        <h3 className="checkin__modal__nome">
                            <i aria-hidden="true">
                                <SquareUserRound size={44} />
                            </i>
                            <span>{checkin?.nome}</span>
                        </h3>

                        {checkin?.is_outra_congregacao ? (
                            <p className="checkin__modal__congregacao checkin__modal__outra-congregacao">
                                <i aria-hidden="true">
                                    <HousePlus />
                                </i>
                                {checkin?.nome_outra_congregacao}
                            </p>
                        ) : (
                            <p className="checkin__modal__congregacao">
                                <i aria-hidden="true">
                                    <Church />
                                </i>
                                {checkin?.congregacao}
                            </p>
                        )}

                        <p className="checkin__modal__cargo">
                            <i aria-hidden="true">
                                <Scroll />
                            </i>
                            {checkin?.cargo}
                        </p>
                    </div>

                    <div className="checkin__modal__infos">
                        <p className="checkin__modal__titular">
                            <span>{checkin?.is_titular ? "Titular" : "Não é titular"}</span>
                        </p>
                        <p className="checkin__modal__cpf">
                            <span>CPF PAGADOR: </span>
                            <strong>{checkin?.cpf_comprador}</strong>
                        </p>

                        <p className="checkin__modal__tipo-ingresso">
                            <i aria-hidden="true">
                                <TicketCheck />
                            </i>
                            <span>Tipo Ingresso:</span>
                            <strong>{checkin?.nome_tipo}</strong>
                        </p>
                    </div>
                </div>
                <div className="checkin__modal__button">
                    <button
                        className="checkin__modal__checkin"
                        title="Fazer Checkin"
                        type="button"
                        onClick={() => {
                            if (checkin?.id) {
                                fazerCheckin(checkin.id);
                                closeModal();
                            }
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
    const [checkinResponse, setCheckinResponse] = useState<CheckinResponse[]>([]);
    const [current, setCurrent] = useState<CheckinResponse | null>(null);

    const methods = useForm<FormCheckin>({ resolver: zodResolver(schema) });
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = methods;

    const onSubmit = async (v: FormCheckin) => {
        console.log(v);

        const data = await searchCredenciais(v.search, v.tipo?.id !== "todos" ? v.tipo?.id : undefined);

        setCheckinResponse(data);
    };
    const closeModal = useCallback(() => {
        setCurrent(null);
    }, []);
    const tipo = useWatch({ control, name: "tipo" });
    const objSearch = useMemo((): { mascara?: (v: string) => any; inputMode?: InputModeType; placeholder?: string } => {
        switch (tipo?.id) {
            case "cpf_comprador":
                return { mascara: mascaraCpfCnpj, inputMode: "numeric", placeholder: "000.000.000-00" };
            case "email":
                return { inputMode: "email", placeholder: "email@email.com" };
            case "codigo":
                return { placeholder: "Código enviado por email" };
            case "nome":
                return { placeholder: "Digite o nome completo" };
            default:
                return { placeholder: "Digite para pesquisar", inputMode: "text" };
        }
    }, [tipo]);

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
                    <form className="checkin__filtros" onSubmit={handleSubmit(onSubmit)}>
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
                                inputMode={objSearch.inputMode}
                                mascara={objSearch.mascara}
                                messageError={errors.search?.message}
                                placeholder={objSearch.placeholder}
                            />
                        </div>

                        <button className="checkin__pesquisar" type="submit" title="pesquisar" disabled={isSubmitting}>
                            <i aria-label="true">
                                <FolderSearch />
                            </i>
                            <span>{!isSubmitting ? "Consultar" : "Procurando..."}</span>
                        </button>
                    </form>

                    <div className="checkin__lista">
                        <div className="checkin__lista__pesquisa">
                            <Search onSearch={setPesquisa} placeholder="Pesquisar Credencial" />
                        </div>

                        <div className="checkin__lista__itens">
                            {checkinResponse.length ? (
                                checkinResponse.map((v) => (
                                    <button
                                        key={v.id}
                                        className="checkin__lista__item"
                                        type="button"
                                        title={`Selecionar ${v.nome}`}
                                        onClick={() => setCurrent(v)}
                                    >
                                        <strong className="checkin__lista__item__nome">{v.nome}</strong>
                                        <span
                                            className={`checkin__lista__item__pagamento checkin__lista__item__pagamento--${v.status_pagamento}`}
                                        >
                                            <span>Status Pagamento:</span>
                                            <i>
                                                {v.status_pagamento === "aprovado" ? (
                                                    <CircleCheck size={34} />
                                                ) : v.status_pagamento === "pendente" ? (
                                                    <Clock size={34} />
                                                ) : (
                                                    <CircleX />
                                                )}
                                            </i>
                                        </span>

                                        <span className="checkin__lista__item__congregacao">
                                            {v.congregacao || `Visitante: ${v.nome_outra_congregacao}`}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <ListaVazia />
                            )}
                        </div>
                    </div>
                </section>
            </MotionMain>
            <Suspense>
                <ModalCheckin checkin={current} closeModal={closeModal} />
            </Suspense>
        </>
    );
}

"use client";

import { ReactNode, useCallback, useState } from "react";
import "./menu.scss";
import {
    Box,
    CalendarCheck,
    ChevronDown,
    ChevronRight,
    Church,
    Cog,
    Coins,
    House,
    IdCard,
    LogOut,
    MessageCircleQuestionMark,
    Settings,
    Tickets,
} from "lucide-react";
import {
    animate,
    AnimatePresence,
    getValueTransition,
    motion,
    TargetAndTransition,
    Variants,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface OpcoesDefault {
    icon?: ReactNode;
    title: string;
    link: string;
}
interface OpcoesOpcao extends OpcoesDefault {
    isDropDown: false;
}
interface OpcoesDropdown extends Omit<OpcoesDefault, "link"> {
    isDropDown: true;
    itens: OpcoesDefault[];
}

const variantsArrow: Variants = {
    animate: (isOpen: boolean) => {
        const obj: TargetAndTransition = {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3, ease: "backOut", delay: 0.2 },
        };

        if (isOpen) return { rotate: 180, ...obj };
        return { rotate: 0, ...obj };
    },
};
const variantsBtn: Variants = {
    initial: { x: -100 },
    animate: { x: 0, transition: { duration: 1 } },
};

const variantsBtnDrop: Variants = {
    initial: { rotate: 0 },
    animate: (isOpen: boolean) => (isOpen ? { rotate: 180 } : { rotate: 360 }),
};
const variantsMenuContainer: Variants = {
    animate: (isOpen) =>
        isOpen
            ? { width: "auto", transition: { duration: 0.4 } }
            : { width: 0 },
};
const variantsMenu: Variants = {
    initial: { x: "-100%", opacity: 1 },
    animate: {
        x: 0,
        opacity: 1,
        transition: { duration: 1, type: "spring", bounce: 0.3 },
    },
    exit: {
        x: "-100%",
        opacity: 1,
        transition: { type: "tween" },
    },
};
const variantsMenuDrop: Variants = {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
};

const OPCOES: (OpcoesOpcao | OpcoesDropdown)[] = [
    {
        icon: <House size={24} />,
        title: "Início",
        isDropDown: false,
        link: "/admin",
    },
    {
        icon: <CalendarCheck size={24} />,
        isDropDown: false,
        link: "/admin/checkin",
        title: "Checkin",
    },
    {
        icon: <Coins size={24} />,
        isDropDown: false,
        link: "/admin/transacoes",
        title: "Transações e Pagamentos",
    },
    {
        isDropDown: false,
        title: "Inscritos (Credenciais)",
        icon: <IdCard size={24} />,
        link: "/admin/credenciais",
    },
    {
        isDropDown: false,
        title: "Gerenciar Ingressos",
        icon: <Tickets size={24} />,
        link: "/admin/ingressos",
    },
    {
        isDropDown: true,
        icon: <Settings size={24} />,
        title: "Config Site",
        itens: [
            {
                link: "/admin/cargos",
                icon: <IdCard size={20} />,
                title: "Cargos",
            },
            {
                link: "/admin/congregacoes",
                icon: <Church size={20} />,
                title: "Congregações",
            },
            {
                link: "/admin/perguntas-frequentes",
                icon: <MessageCircleQuestionMark size={20} />,
                title: "Perguntas Frequentes",
            },
            {
                link: "/admin/capacidade-maxima",
                icon: <Box size={20} />,
                title: "Capacidade Máxima",
            },
        ],
    },
];

const MenuItem = ({
    link,
    title,
    icon,
    onClick,
}: OpcoesDefault & { onClick: () => void }) => {
    const path = usePathname();
    return (
        <li className="menu__lista-item">
            <Link
                onClick={onClick}
                href={link}
                className={`menu__lista-item__link ${path === link ? "menu__lista-item__link--active" : ""}`}
            >
                {icon && <i>{icon}</i>}
                <span>{title}</span>
            </Link>
        </li>
    );
};
const MenuDrop = ({
    itens,
    title,
    icon,
    onClick,
}: OpcoesDropdown & { onClick: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const path = usePathname();
    const isActive = itens.find((v) => v.link === path);

    return (
        <div className={`menu__lista-drop`}>
            <button
                title="abrir dropdown"
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className={`menu__lista-drop-btn ${isActive ? "menu__lista-drop-btn--active" : ""}`}
            >
                {icon && <i>{icon}</i>}
                <span>{title}</span>
                <motion.i
                    variants={variantsBtnDrop}
                    initial={"initial"}
                    animate={"animate"}
                    custom={isOpen}
                >
                    <ChevronDown size={14} />
                </motion.i>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div>
                        <div style={{ overflow: "hidden" }}>
                            <motion.div
                                variants={variantsMenuDrop}
                                initial={"initial"}
                                animate={"animate"}
                                exit={"exit"}
                                className="menu__lista-drop__opcoes"
                            >
                                {itens.map((v, i) => (
                                    <MenuItem
                                        onClick={onClick}
                                        {...v}
                                        key={i}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const closeMenu = useCallback(() => setIsOpen(false), []);
    return (
        <div className="menu">
            <motion.div
                className={`menu__container`}
                variants={variantsMenuContainer}
                animate={"animate"}
                custom={isOpen}
            >
                <motion.button
                    onClick={() => setIsOpen((v) => !v)}
                    className={`menu__btn ${!isOpen ? "menu__btn--close" : ""}`}
                    type="button"
                    title="Abrir Menu"
                    variants={variantsBtn}
                    initial="initial"
                    animate="animate"
                >
                    <motion.i
                        variants={variantsArrow}
                        custom={isOpen}
                        initial="initial"
                        animate="animate"
                    >
                        <ChevronRight />
                    </motion.i>
                </motion.button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="menu__opcoes"
                            variants={variantsMenu}
                            initial={"initial"}
                            animate={"animate"}
                            exit={"exit"}
                        >
                            <ul className="menu__lista">
                                {OPCOES.map((v, i) =>
                                    v.isDropDown ? (
                                        <MenuDrop
                                            onClick={closeMenu}
                                            {...v}
                                            key={i}
                                        />
                                    ) : (
                                        <MenuItem
                                            onClick={closeMenu}
                                            key={i}
                                            {...v}
                                        />
                                    ),
                                )}
                            </ul>

                            <button
                                className="menu__sair"
                                title="sair da conta"
                                type="button"
                            >
                                <i>
                                    <LogOut size={24} />
                                </i>
                                <span>Sair</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

"use client";

import { createContext, ReactNode, useContext, useState } from "react";

const context = createContext({});
export const useAuthContext: () => {
    handleLogin: () => void;
    login: boolean;
} = () => useContext(context as any);

export default function AuthContext({ children }: { children: ReactNode }) {
    const [login, setLogin] = useState(false);
    const handleLogin = () => {
        setLogin((v) => !v);
    };

    return (
        <context.Provider value={{ handleLogin, login }}>
            {children}
        </context.Provider>
    );
}

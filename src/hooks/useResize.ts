import { useEffect, useState } from "react";

export default function useResize(breakPoint: number = 480) {
    const [isBreak, setIsBreak] = useState(false);

    useEffect(() => {
        const resize = () => {
            setIsBreak(window.innerWidth <= breakPoint);
        };
        resize();

        window.addEventListener("resize", resize);

        return () => window.removeEventListener("resize", resize);
    }, []);

    return isBreak;
}

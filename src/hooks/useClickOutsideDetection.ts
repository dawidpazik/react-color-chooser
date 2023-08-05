import { useRef, useEffect } from "react";

export function useClickOutsideDetection(callback: () => void) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (elementRef.current && event.target instanceof Node && !elementRef.current.contains(event.target)) {
                callback();
            }
        };

        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, [callback, elementRef]);

    return elementRef;
}

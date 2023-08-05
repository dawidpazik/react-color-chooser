import { useEffect } from "react";

export function useKeyDownDetection(keyName: string, callback: () => void) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === keyName) {
                callback();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [keyName, callback]);
}

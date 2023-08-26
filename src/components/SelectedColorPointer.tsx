import React, { ForwardedRef } from "react";
import styles from "./SelectedColorPointer.module.css";

const pointerRadius = 7;

export type PointerPosition = {
    x: number;
    y: number;
};

export type SelectedColorPointerProps = {
    position: PointerPosition;
};

export const SelectedColorPointer = React.forwardRef(
    ({ position }: SelectedColorPointerProps, ref: ForwardedRef<HTMLDivElement>) => {
        const display = position ? "initial" : "none";
        const x = position ? position.x - pointerRadius : null;
        const y = position ? position.y - pointerRadius : null;
        const width = 2 * pointerRadius;
        const height = 2 * pointerRadius;

        return (
            <div
                className={styles.selectedColorPointer}
                style={{ left: x, top: y, display: display, width: width, height: height }}
                ref={ref}
            ></div>
        );
    }
);

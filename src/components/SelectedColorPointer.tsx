import React from "react";
import styles from "./SelectedColorPointer.module.css";

const pointerRadius = 6;

export type PointerPosition = {
    x: number;
    y: number;
};

export type SelectedColorPointerProps = {
    position: PointerPosition;
};

export const SelectedColorPointer = ({ position }: SelectedColorPointerProps) => {
    const x = position ? position.x - pointerRadius : null;
    const y = position ? position.y - pointerRadius : null;
    const display = position ? "initial" : "none";

    return (
        <div className={styles.selectedColorPointer} style={{ left: x, top: y, display: display }}>
            <svg>
                <circle
                    className={styles.outerPointerCircle}
                    cx={pointerRadius}
                    cy={pointerRadius}
                    r={pointerRadius - 1}
                ></circle>
                <circle
                    className={styles.innerPointerCircle}
                    cx={pointerRadius}
                    cy={pointerRadius}
                    r={pointerRadius - 2}
                ></circle>
            </svg>
        </div>
    );
};

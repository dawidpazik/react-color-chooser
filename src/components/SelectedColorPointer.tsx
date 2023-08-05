import React from "react";
import styles from "./SelectedColorPointer.module.css";

const pointerRadius = 6;

export type SelectedColorPointerProps = {
    position: { x: number; y: number };
};

export const SelectedColorPointer = ({ position }: SelectedColorPointerProps) => {
    return (
        <div
            className={styles.selectedColorPointer}
            style={{ top: position.y - pointerRadius, left: position.x - pointerRadius }}
        >
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

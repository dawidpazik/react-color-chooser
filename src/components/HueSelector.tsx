import React, { useRef, useEffect, useState, MutableRefObject } from "react";
import styles from "./HueSelector.module.css";
import { HsvColor, rgbToHsv } from "../utils/Color";
import { PointerPosition, SelectedColorPointer } from "./SelectedColorPointer";

export type HueSelectorProps = {
    selectedColor: HsvColor;
    onColorSelected: (color: HsvColor) => void;
};

export const HueSelector = ({ selectedColor, onColorSelected }: HueSelectorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pointerPosition, setPointerPosition] = useState<PointerPosition>(null);

    useEffect(() => {
        setPointerPosition(calculatePointerPosition(canvasRef.current, selectedColor.h));
    }, [selectedColor.h]);

    return (
        <div className={styles.canvasContainer}>
            <HueSelectorCanvas canvasRef={canvasRef} selectedColor={selectedColor} onColorSelected={onColorSelected} />
            <SelectedColorPointer position={pointerPosition} />
        </div>
    );
};

type HueSelectorCanvasProps = {
    canvasRef: MutableRefObject<HTMLCanvasElement>;
    selectedColor: HsvColor;
    onColorSelected: (color: HsvColor) => void;
};

const HueSelectorCanvas = ({ canvasRef, selectedColor, onColorSelected }: HueSelectorCanvasProps) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        canvas.height = canvas.offsetHeight;
        canvas.width = canvas.offsetWidth;

        const gradient = context.createLinearGradient(0, 0, 0, context.canvas.height);
        gradient.addColorStop(0, "red");
        gradient.addColorStop(0.17, "yellow");
        gradient.addColorStop(0.33, "lime");
        gradient.addColorStop(0.5, "cyan");
        gradient.addColorStop(0.66, "blue");
        gradient.addColorStop(0.83, "magenta");
        gradient.addColorStop(1, "red");
        context.fillStyle = gradient;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        const handleClick = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.x;
            const y = event.clientY - rect.y;
            const pixel = context.getImageData(x, y, 1, 1).data;
            onColorSelected({
                h: rgbToHsv({ r: pixel[0], g: pixel[1], b: pixel[2] }).h,
                s: selectedColor.s,
                v: selectedColor.v,
            });
        };

        canvas.addEventListener("click", handleClick);

        return () => {
            canvas.removeEventListener("click", handleClick);
        };
    }, [onColorSelected, selectedColor.h, selectedColor.s, selectedColor.v, canvasRef]);

    return <canvas ref={canvasRef} className={styles.canvas} />;
};

function calculatePointerPosition(canvas: HTMLCanvasElement, selectedHue: number) {
    const relativePointerVerticalPositionInFraction = selectedHue / 360;
    const relativeVerticalPointerPosition = canvas.height * relativePointerVerticalPositionInFraction;
    const canvasBoundingRect = canvas.getBoundingClientRect();

    return {
        x: canvasBoundingRect.left + canvas.width / 2,
        y: canvasBoundingRect.top + relativeVerticalPointerPosition,
    };
}

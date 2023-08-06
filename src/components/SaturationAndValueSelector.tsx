import React, { useRef, useEffect, useState } from "react";
import styles from "./SaturationAndValueSelector.module.css";
import { HsvColor, hsvToRgbHex, rgbToHsv } from "../utils/Color";
import { SelectedColorPointer } from "./SelectedColorPointer";

export type SaturationAndValueSelectorProps = {
    selectedColor: HsvColor;
    onColorSelected: (color: HsvColor) => void;
};

export const SaturationAndValueSelector = ({ selectedColor, onColorSelected }: SaturationAndValueSelectorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pointerPosition, setPointerPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        canvas.height = canvas.offsetHeight;
        canvas.width = canvas.offsetWidth;

        const handleClick = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const pixel = context.getImageData(x, y, 1, 1).data;
            onColorSelected(rgbToHsv({ r: pixel[0], g: pixel[1], b: pixel[2] }));
        };

        canvas.addEventListener("click", handleClick);

        return () => {
            canvas.removeEventListener("click", handleClick);
        };
    }, [onColorSelected]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        const mainColor = hsvToRgbHex({ h: selectedColor.h, s: 1, v: 1 });
        const horizontalGradient = context.createLinearGradient(0, 0, context.canvas.width, 0);
        horizontalGradient.addColorStop(0, "#FFFFFFFF");
        horizontalGradient.addColorStop(1, mainColor);
        context.fillStyle = horizontalGradient;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        const verticalGradient = context.createLinearGradient(0, 0, 0, context.canvas.height);
        verticalGradient.addColorStop(0, "#00000000");
        verticalGradient.addColorStop(1, "#000000FF");
        context.fillStyle = verticalGradient;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        const relativePointerHorizontalPositionInFraction = selectedColor.s;
        const relativeHorizontalPointerPosition = canvas.width * relativePointerHorizontalPositionInFraction;
        const relativePointerVerticalPositionInFraction = 1 - selectedColor.v;
        const relativeVerticalPointerPosition = canvas.height * relativePointerVerticalPositionInFraction;
        const canvasBoundingRect = canvas.getBoundingClientRect();
        setPointerPosition({
            x: canvasBoundingRect.left + relativeHorizontalPointerPosition,
            y: canvasBoundingRect.top + relativeVerticalPointerPosition,
        });
    }, [selectedColor.h, selectedColor.s, selectedColor.v]);

    return (
        <div className={styles.canvasContainer}>
            <canvas ref={canvasRef} className={styles.canvas} />
            <SelectedColorPointer position={pointerPosition} />
        </div>
    );
};

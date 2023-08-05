import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import styles from "./CustomColorChooser.module.css";
import { HexColor, HsvColor, hexToHsv, hsvToRgbHex, rgbToHsv } from "../utils/Color";
import { SelectedColorPointer } from "./SelectedColorPointer";

export type CustomColorChooserProps = {
    selectedColor: HexColor;
    onColorSelected: (color: HexColor) => void;
    portalRootId?: string;
};

export const CustomColorChooser = ({ selectedColor, onColorSelected }: CustomColorChooserProps) => {
    const selectedColorHsv = useMemo(() => hexToHsv(selectedColor), [selectedColor]);
    const handleColorSelected = useCallback(
        (hsvColor: HsvColor) => onColorSelected(hsvToRgbHex(hsvColor)),
        [onColorSelected]
    );

    return (
        <div className={styles.customColorChooserContainer}>
            <ColorCanvas selectedColor={selectedColorHsv} onColorSelected={handleColorSelected} />
            <HueSlider selectedColor={selectedColorHsv} onColorSelected={handleColorSelected} />
        </div>
    );
};

export type ColorCanvasProps = {
    selectedColor: HsvColor;
    onColorSelected: (color: HsvColor) => void;
};

export const ColorCanvas = ({ selectedColor, onColorSelected }: ColorCanvasProps) => {
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
            <canvas ref={canvasRef} className={styles.colorCanvas} />
            <SelectedColorPointer position={pointerPosition} />
        </div>
    );
};

export type HueSliderProps = {
    selectedColor: HsvColor;
    onColorSelected: (color: HsvColor) => void;
};

export const HueSlider = ({ selectedColor, onColorSelected }: HueSliderProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pointerPosition, setPointerPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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
    }, [onColorSelected, selectedColor.h, selectedColor.s, selectedColor.v]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const relativePointerVerticalPositionInFraction = selectedColor.h / 360;
        const relativeVerticalPointerPosition = canvas.height * relativePointerVerticalPositionInFraction;
        const canvasBoundingRect = canvas.getBoundingClientRect();
        setPointerPosition({
            x: canvasBoundingRect.left + canvas.width / 2,
            y: canvasBoundingRect.top + relativeVerticalPointerPosition,
        });
    }, [selectedColor.h]);

    return (
        <div className={styles.canvasContainer}>
            <canvas ref={canvasRef} className={styles.hueSlider} />
            <SelectedColorPointer position={pointerPosition} />
        </div>
    );
};

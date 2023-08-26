import React, { useRef, useEffect, MutableRefObject, useState } from "react";
import styles from "./SaturationAndValueSelector.module.css";
import { HsvColor, hsvToRgbHex, rgbToHsv } from "../utils/Color";
import { PointerPosition, SelectedColorPointer } from "./SelectedColorPointer";

const defaultHue = 0;

export type SaturationAndValueSelectorProps = {
    selectedHue: number;
    selectedSaturation: number;
    selectedValue: number;
    onColorSelected: (color: HsvColor) => void;
};

export const SaturationAndValueSelector = ({
    selectedHue,
    selectedSaturation,
    selectedValue,
    onColorSelected,
}: SaturationAndValueSelectorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>();
    const pointerRef = useRef<HTMLDivElement>();
    const [pointerPosition, setPointerPosition] = useState<PointerPosition>();
    const [isPointerBeingMoved, setIsPointerBeingMoved] = useState(false);

    useEffect(() => {
        setPointerPosition(calculatePointerPosition(canvasRef.current, selectedSaturation, selectedValue));
    }, [selectedSaturation, selectedValue]);

    useEffect(() => {
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove);

        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove);
        };
    });

    const handleMouseDown = (e: MouseEvent) => {
        if (pointerRef.current.contains(document.elementFromPoint(e.clientX, e.clientY))) {
            setIsPointerBeingMoved(true);
        }
    };

    const handleMouseUp = () => {
        setIsPointerBeingMoved(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isPointerBeingMoved) {
            return;
        }
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const effectiveX = Math.max(Math.min(x, rect.width - 1), 0);
        const effectiveY = Math.max(Math.min(y, rect.height - 1), 0);
        const pixel = canvasRef.current.getContext("2d").getImageData(effectiveX, effectiveY, 1, 1).data;
        onColorSelected(rgbToHsv({ r: pixel[0], g: pixel[1], b: pixel[2] }));
    };

    return (
        <div className={styles.canvasContainer}>
            <SaturationAndValueSelectorCanvas
                canvasRef={canvasRef}
                selectedHue={selectedHue}
                onColorSelected={onColorSelected}
            />
            <SelectedColorPointer position={pointerPosition} ref={pointerRef} />
        </div>
    );
};

type SaturationAndValueSelectorCanvasProps = {
    canvasRef: MutableRefObject<HTMLCanvasElement>;
    selectedHue: number;
    onColorSelected: (color: HsvColor) => void;
};

const SaturationAndValueSelectorCanvas = ({
    canvasRef,
    selectedHue,
    onColorSelected,
}: SaturationAndValueSelectorCanvasProps) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.height = canvas.offsetHeight;
        canvas.width = canvas.offsetWidth;
    }, [canvasRef]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const mainColor = hsvToRgbHex({ h: selectedHue ?? defaultHue, s: 1, v: 1 });
        const horizontalGradient = context.createLinearGradient(0, 0, context.canvas.width, 0);
        horizontalGradient.addColorStop(0, "#ffffffff");
        horizontalGradient.addColorStop(1, mainColor);
        context.fillStyle = horizontalGradient;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        const verticalGradient = context.createLinearGradient(0, 0, 0, context.canvas.height);
        verticalGradient.addColorStop(0, "#00000000");
        verticalGradient.addColorStop(1, "#000000ff");
        context.fillStyle = verticalGradient;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }, [selectedHue, canvasRef]);

    const handleClick = (event: React.MouseEvent) => {
        const canvas = event.target as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const pixel = context.getImageData(x, y, 1, 1).data;
        onColorSelected(rgbToHsv({ r: pixel[0], g: pixel[1], b: pixel[2] }));
    };

    return <canvas ref={canvasRef} className={styles.canvas} onClick={handleClick} />;
};

function calculatePointerPosition(
    canvas: HTMLCanvasElement,
    selectedColorSaturation: number,
    selectedColorValue: number
) {
    if (selectedColorSaturation == null || selectedColorValue == null) {
        return null;
    }

    const relativePointerHorizontalPositionInFraction = selectedColorSaturation;
    const relativeHorizontalPointerPosition = canvas.width * relativePointerHorizontalPositionInFraction;
    const relativePointerVerticalPositionInFraction = 1 - selectedColorValue;
    const relativeVerticalPointerPosition = canvas.height * relativePointerVerticalPositionInFraction;

    return {
        x: relativeHorizontalPointerPosition,
        y: relativeVerticalPointerPosition,
    };
}

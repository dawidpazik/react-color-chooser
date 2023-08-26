import React, { useRef, useEffect, useState, MutableRefObject } from "react";
import styles from "./HueSelector.module.css";
import { HsvColor, rgbToHsv } from "../utils/Color";
import { PointerPosition, SelectedColorPointer } from "./SelectedColorPointer";

export type HueSelectorProps = {
    selectedHue: number;
    selectedSaturation: number;
    selectedValue: number;
    onColorSelected: (color: HsvColor) => void;
};

export const HueSelector = ({ selectedHue, selectedSaturation, selectedValue, onColorSelected }: HueSelectorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerRef = useRef<HTMLDivElement>();
    const [pointerPosition, setPointerPosition] = useState<PointerPosition>();
    const [isPointerBeingMoved, setIsPointerBeingMoved] = useState(false);

    useEffect(() => {
        setPointerPosition(calculatePointerPosition(canvasRef.current, selectedHue));
    }, [selectedHue]);

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
        const y = e.clientY - rect.top;
        const effectiveY = Math.max(Math.min(y, rect.height - 1), 0);
        const pixel = canvasRef.current.getContext("2d").getImageData(pointerPosition.x, effectiveY, 1, 1).data;
        onColorSelected({
            h: rgbToHsv({ r: pixel[0], g: pixel[1], b: pixel[2] }).h,
            s: selectedSaturation,
            v: selectedValue,
        });
    };

    return (
        <div className={styles.canvasContainer}>
            <HueSelectorCanvas
                canvasRef={canvasRef}
                selectedSaturation={selectedSaturation}
                selectedValue={selectedValue}
                onColorSelected={onColorSelected}
            />
            <SelectedColorPointer position={pointerPosition} ref={pointerRef} />
        </div>
    );
};

type HueSelectorCanvasProps = {
    canvasRef: MutableRefObject<HTMLCanvasElement>;
    selectedSaturation: number;
    selectedValue: number;
    onColorSelected: (color: HsvColor) => void;
};

const offsetToColorNameMap = new Map<number, string>([
    [0, "red"],
    [0.17, "yellow"],
    [0.33, "lime"],
    [0.5, "cyan"],
    [0.66, "blue"],
    [0.83, "magenta"],
    [1, "red"],
]);

const HueSelectorCanvas = ({
    canvasRef,
    selectedSaturation,
    selectedValue,
    onColorSelected,
}: HueSelectorCanvasProps) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        canvas.height = canvas.offsetHeight;
        canvas.width = canvas.offsetWidth;

        const gradient = context.createLinearGradient(0, 0, 0, context.canvas.height);
        offsetToColorNameMap.forEach((colorName: string, offset: number) => gradient.addColorStop(offset, colorName));
        context.fillStyle = gradient;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }, [canvasRef]);

    const handleClick = (event: React.MouseEvent) => {
        const canvas = event.target as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.x;
        const y = event.clientY - rect.y;
        const pixel = context.getImageData(x, y, 1, 1).data;
        onColorSelected({
            h: rgbToHsv({ r: pixel[0], g: pixel[1], b: pixel[2] }).h,
            s: selectedSaturation,
            v: selectedValue,
        });
    };

    return <canvas ref={canvasRef} className={styles.canvas} onClick={handleClick} />;
};

function calculatePointerPosition(canvas: HTMLCanvasElement, selectedHue: number) {
    if (selectedHue == null) {
        return null;
    }

    const relativePointerVerticalPositionInFraction = selectedHue / 360;
    const relativeVerticalPointerPosition = canvas.height * relativePointerVerticalPositionInFraction;

    return {
        x: canvas.width / 2,
        y: relativeVerticalPointerPosition,
    };
}

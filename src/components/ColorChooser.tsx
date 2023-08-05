import React, { useCallback, useRef, useState, MouseEvent } from "react";
import { HexColor } from "../utils/Color";
import { CustomColorChooser } from "./CustomColorChooser";
import { Modal, ModalPosition } from "./Modal";
import styles from "./ColorChooser.module.css";
import { PredefinedColorChooser } from "./PredefinedColorChooser";
import { useClickOutsideDetection } from "../hooks/useClickOutsideDetection";
import { useScrollDetection } from "../hooks/useScrollDetection";
import { useKeyDownDetection } from "../hooks/useKeyDownDetection";

export type ColorChooserMode =
    | { allowCustomColors: false; predefinedColors: HexColor[] }
    | { allowCustomColors: true; predefinedColors?: HexColor[] };

export type ColorChooserProps = {
    mode?: ColorChooserMode;
    selectedColor: HexColor;
    onColorSelected: (color: HexColor) => void;
    portalRootId?: string;
    className?: string;
};

export const ColorChooser = ({
    selectedColor,
    onColorSelected,
    portalRootId,
    className,
    mode = { allowCustomColors: true },
}: ColorChooserProps) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalPosition, setModalPosition] = useState<ModalPosition>({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleButtonClick = useCallback(
        (event: MouseEvent<HTMLElement>) => {
            const rect = buttonRef.current.getBoundingClientRect();
            setModalPosition({ x: rect.x, y: rect.bottom });
            setIsModalOpen((isModalOpen) => !isModalOpen);
            event.stopPropagation();
        },
        [buttonRef]
    );

    const hideModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const modalContentRef = useClickOutsideDetection(hideModal);
    useScrollDetection(hideModal);
    useKeyDownDetection("Escape", hideModal);

    return (
        <div className={className}>
            <button ref={buttonRef} onClick={handleButtonClick} className={styles.button}>
                <div className={styles.colorPreview} style={{ backgroundColor: selectedColor }}></div>
            </button>
            {isModalOpen && (
                <Modal position={modalPosition} portalRootId={portalRootId}>
                    <div className={styles.modalContent} ref={modalContentRef}>
                        {mode.predefinedColors && mode.predefinedColors.length && (
                            <PredefinedColorChooser
                                predefinedColors={mode.predefinedColors}
                                selectedColor={selectedColor}
                                onColorSelected={onColorSelected}
                            />
                        )}
                        {mode.allowCustomColors && (
                            <CustomColorChooser selectedColor={selectedColor} onColorSelected={onColorSelected} />
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

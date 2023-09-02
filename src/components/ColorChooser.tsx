import React, { useRef, useState, MouseEvent } from "react";
import { HexColor } from "../utils/Color";
import { CustomColorChooser } from "./CustomColorChooser";
import { Modal, ModalPosition } from "./Modal";
import styles from "./ColorChooser.module.css";
import { PredefinedColorChooser } from "./PredefinedColorChooser";
import { useClickOutsideDetection } from "../hooks/useClickOutsideDetection";
import { useScrollDetection } from "../hooks/useScrollDetection";
import { useKeyDownDetection } from "../hooks/useKeyDownDetection";
import classNames from "classnames";

export type ColorChooserMode =
    | { allowCustomColors: false; predefinedColors: HexColor[] }
    | { allowCustomColors: true; predefinedColors?: HexColor[] };

export type ColorChooserProps = {
    mode?: ColorChooserMode;
    selectedColor: HexColor;
    onColorSelected: (color: HexColor) => void;
    onClose?: () => void;
    portalRootId?: string;
    className?: string;
    disabled?: boolean;
};

export const ColorChooser = ({
    selectedColor,
    onColorSelected,
    onClose,
    portalRootId,
    className,
    disabled,
    mode = { allowCustomColors: true },
}: ColorChooserProps) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalPosition, setModalPosition] = useState<ModalPosition>({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleButtonClick = (event: MouseEvent<HTMLElement>) => {
        const rect = buttonRef.current.getBoundingClientRect();
        setModalPosition({ x: rect.x, y: rect.bottom });
        if (isModalOpen) {
            hideModal();
        } else {
            showModal();
        }
        event.stopPropagation();
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const hideModal = () => {
        if (isModalOpen) {
            setIsModalOpen(false);
            onClose?.();
        }
    };

    const modalContentRef = useClickOutsideDetection(hideModal);
    useScrollDetection(hideModal);
    useKeyDownDetection("Escape", hideModal);

    return (
        <div className={className}>
            <button ref={buttonRef} onClick={handleButtonClick} className={styles.button} disabled={disabled}>
                <div
                    className={classNames(styles.colorPreview, { [styles.empty]: !selectedColor })}
                    style={{ backgroundColor: selectedColor }}
                ></div>
            </button>
            {isModalOpen && (
                <Modal position={modalPosition} portalRootId={portalRootId}>
                    <div className={styles.modalContent} ref={modalContentRef}>
                        {mode.predefinedColors && (
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

import React, { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

export type ModalPosition = {
    x: number;
    y: number;
};

export type ModalProps = PropsWithChildren<{
    position: ModalPosition;
    portalRootId?: string;
}>;

export const Modal = ({ position, portalRootId, children }: ModalProps) => {
    const portalRoot = portalRootId ? document.getElementById(portalRootId) : document.body;

    return createPortal(
        <div className={styles.contentContainer} style={{ left: position.x, top: position.y }}>
            {children}
        </div>,
        portalRoot
    );
};

import React, { useMemo, useCallback } from "react";
import styles from "./CustomColorChooser.module.css";
import { HexColor, HsvColor, hexToHsv, hsvToRgbHex } from "../utils/Color";
import { HueSelector } from "./HueSelector";
import { SaturationAndValueSelector } from "./SaturationAndValueSelector";

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
            <SaturationAndValueSelector selectedColor={selectedColorHsv} onColorSelected={handleColorSelected} />
            <HueSelector selectedColor={selectedColorHsv} onColorSelected={handleColorSelected} />
        </div>
    );
};

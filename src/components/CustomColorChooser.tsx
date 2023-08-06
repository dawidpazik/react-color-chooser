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
    const selectedColorHsv = useMemo(() => selectedColor && hexToHsv(selectedColor), [selectedColor]);
    const handleColorSelected = useCallback(
        (hsvColor: HsvColor) => onColorSelected(hsvToRgbHex(hsvColor)),
        [onColorSelected]
    );

    return (
        <div className={styles.customColorChooserContainer}>
            <SaturationAndValueSelector
                selectedHue={selectedColorHsv?.h}
                selectedSaturation={selectedColorHsv?.s}
                selectedValue={selectedColorHsv?.v}
                onColorSelected={handleColorSelected}
            />
            <HueSelector
                selectedHue={selectedColorHsv?.h}
                selectedSaturation={selectedColorHsv?.s}
                selectedValue={selectedColorHsv?.v}
                onColorSelected={handleColorSelected}
            />
        </div>
    );
};

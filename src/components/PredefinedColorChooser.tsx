import classNames from "classnames";
import React from "react";
import styles from "./PredefinedColorChooser.module.css";
import { HexColor } from "../utils/Color";

export type PredefinedColorChooserProps = {
    predefinedColors: HexColor[];
    selectedColor: HexColor;
    onColorSelected: (color: HexColor) => void;
    className?: string;
};

export const PredefinedColorChooser = ({ predefinedColors, onColorSelected }: PredefinedColorChooserProps) => {
    return (
        <div className={classNames(styles.predefinedColorChooserContainer)}>
            {predefinedColors.length > 0
                ? predefinedColors.map((x) => (
                      <div key={x} onClick={() => onColorSelected(x)}>
                          <div
                              className={styles.predefinedColor}
                              style={{ backgroundColor: x }}
                              onClick={() => onColorSelected(x)}
                          ></div>
                      </div>
                  ))
                : "No colors defined"}
        </div>
    );
};

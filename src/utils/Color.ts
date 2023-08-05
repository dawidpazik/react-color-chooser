export type HexColor = string;

export type RgbColor = {
    r: number;
    g: number;
    b: number;
};
export type HslColor = {
    h: number;
    s: number;
    l: number;
};

export type HsvColor = {
    h: number;
    s: number;
    v: number;
};

export function rgbToHex(rgbColor: RgbColor) {
    const { r, g, b } = rgbColor;

    return `#${formatHex(r)}${formatHex(g)}${formatHex(b)}`;
}

export function hexToHsl(hexColor: HexColor) {
    return rgbToHsl(hexToRgb(hexColor));
}

export function hexToHsv(hexColor: HexColor) {
    return rgbToHsv(hexToRgb(hexColor));
}

export function hexToRgb(hexColor: HexColor) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);

    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    };
}

export function rgbToHsl(rgbColor: RgbColor) {
    let { r, g, b } = rgbColor;

    r /= 255;
    g /= 255;
    b /= 255;

    const xMin = Math.min(r, g, b);
    const xMax = Math.max(r, g, b);
    const c = xMax - xMin;

    const h = calculateHue(rgbColor);
    const l = (xMin + xMax) / 2;
    const s = c === 0 ? 0 : c / (1 - Math.abs(2 * l - 1));

    return { h, s, l };
}

export function hslToRgb(hslColor: HslColor): RgbColor {
    const { h, s, l } = hslColor;

    const k = (n: number) => (n + h / 30) % 12;
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    const a = s * Math.min(l, 1 - l);

    return { r: Math.trunc(255 * f(0)), g: Math.trunc(255 * f(8)), b: Math.trunc(255 * f(4)) };
}

export function hslToRgbHex(hslColor: HslColor): HexColor {
    return rgbToHex(hslToRgb(hslColor));
}

export function hsvToRgbHex(hsvColor: HsvColor): HexColor {
    return rgbToHex(hsvToRgb(hsvColor));
}

export function rgbToHsv(rgbColor: RgbColor): HsvColor {
    let { r, g, b } = rgbColor;

    r /= 255;
    g /= 255;
    b /= 255;

    const xMin = Math.min(r, g, b);
    const xMax = Math.max(r, g, b);
    const c = xMax - xMin;

    const h = calculateHue(rgbColor);
    const v = xMax;
    const s = v === 0 ? 0 : c / v;

    return { h, s, v };
}

export function hsvToRgb(hsvColor: HsvColor): RgbColor {
    const { h, s, v } = hsvColor;
    const f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);

    return { r: Math.trunc(255 * f(5)), g: Math.trunc(255 * f(3)), b: Math.trunc(255 * f(1)) };
}

function calculateHue(rgbColor: RgbColor): number {
    let { r, g, b } = rgbColor;

    r /= 255;
    g /= 255;
    b /= 255;

    const xMin = Math.min(r, g, b);
    const xMax = Math.max(r, g, b);
    const c = xMax - xMin;
    let h = 0;

    if (c === 0) {
        h = 0;
    } else if (xMax === r) {
        h = ((g - b) / c) % 6;
    } else if (xMax === g) {
        h = (b - r) / c + 2;
    } else {
        h = (r - g) / c + 4;
    }

    h = Math.round(h * 60);

    if (h < 0) {
        h += 360;
    }

    return h;
}

function formatHex(x: number) {
    return x.toString(16).padStart(2, "0");
}

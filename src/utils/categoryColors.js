// Derives the dark/mid/light/text shades a category needs for card theming
// from a single admin-picked base color, so categories.json only has to
// store one hex value per category.

function hexToHsl(hex) {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            default: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h, s, l };
}

function hslToHex(h, s, l) {
    const hueToRgb = (p, q, t) => {
        let tt = t;
        if (tt < 0) tt += 1;
        if (tt > 1) tt -= 1;
        if (tt < 1 / 6) return p + (q - p) * 6 * tt;
        if (tt < 1 / 2) return q;
        if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
        return p;
    };

    let r;
    let g;
    let b;

    if (s === 0) {
        r = l; g = l; b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    const toHex = (c) => {
        const v = Math.round(Math.min(1, Math.max(0, c)) * 255);
        return v.toString(16).padStart(2, '0');
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function withLightness(hex, lightness) {
    const { h, s } = hexToHsl(hex);
    return hslToHex(h, s, lightness);
}

function darkenBy(hex, amount) {
    const { h, s, l } = hexToHsl(hex);
    return hslToHex(h, s, Math.max(0, l - amount));
}

export function getCategoryColors(baseHex) {
    return {
        dark: baseHex,
        mid: withLightness(baseHex, 0.78),
        light: withLightness(baseHex, 0.90),
        text: darkenBy(baseHex, 0.10)
    };
}

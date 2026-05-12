export function formatComplex(real, imag) {
    const sign = imag >= 0 ? "+" : "-";

    return `${real} ${sign} ${Math.abs(imag)}i`;
}
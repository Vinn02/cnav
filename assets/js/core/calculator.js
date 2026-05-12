export function calculateComplex(real1, imag1, real2, imag2, operation) {
    let resultReal = 0;
    let resultImag = 0;
    let error = null;

    switch (operation) {
        case "add":
            resultReal = real1 + real2;
            resultImag = imag1 + imag2;
            break;

        case "sub":
            resultReal = real1 - real2;
            resultImag = imag1 - imag2;
            break;

        case "mul":
            resultReal = (real1 * real2) - (imag1 * imag2);
            resultImag = (real1 * imag2) + (imag1 * real2);
            break;

        case "div":
            const denominator = (real2 * real2) + (imag2 * imag2);

            if (denominator === 0) {
                error = "Tidak dapat melakukan pembagian dengan 0 + 0i";
                break;
            }

            resultReal = ((real1 * real2) + (imag1 * imag2)) / denominator;
            resultImag = ((imag1 * real2) - (real1 * imag2)) / denominator;
            break;
    }

    return {
        resultReal,
        resultImag,
        error
    };
}
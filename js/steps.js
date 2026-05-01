function generateSteps(real1, imag1, real2, imag2, resultReal, resultImag, operation) {
    switch (operation) {
        case "add":
            return `
                <h3>Penjumlahan Bilangan Kompleks</h3>
                <p>Z₁ = ${formatComplex(real1, imag1)}</p>
                <p>Z₂ = ${formatComplex(real2, imag2)}</p>

                <br>

                <p>Rumus:</p>
                <p>(a + bi) + (c + di) = (a + c) + (b + d)i</p>

                <br>

                <p>Hasil:</p>
                <p>${formatComplex(resultReal, resultImag)}</p>
            `;

        case "sub":
            return `
                <h3>Pengurangan Bilangan Kompleks</h3>
                <p>Z₁ = ${formatComplex(real1, imag1)}</p>
                <p>Z₂ = ${formatComplex(real2, imag2)}</p>

                <br>

                <p>Rumus:</p>
                <p>(a + bi) - (c + di) = (a - c) + (b - d)i</p>

                <br>

                <p>Hasil:</p>
                <p>${formatComplex(resultReal, resultImag)}</p>
            `;

        case "mul":
            return `
                <h3>Perkalian Bilangan Kompleks</h3>

                <p>Rumus:</p>
                <p>(a + bi)(c + di) = (ac - bd) + (ad + bc)i</p>

                <br>

                <p>Hasil:</p>
                <p>${formatComplex(resultReal, resultImag)}</p>
            `;

        case "div":
            return `
                <h3>Pembagian Bilangan Kompleks</h3>

                <p>Rumus:</p>
                <p>((a + bi) / (c + di))</p>
                <p>= ((a + bi)(c - di)) / (c² + d²)</p>

                <br>

                <p>Hasil:</p>
                <p>${formatComplex(resultReal, resultImag)}</p>
            `;
    }

    return "";
}
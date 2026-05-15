// Biarin ini, dipake buat nulis rumus di langkah penyelesaian
function formatComplex(real, imag) {
    const sign = imag >= 0 ? "+" : "-";
    return `${real} ${sign} ${Math.abs(imag)}i`;
}

// Nyalain canvas pas web pertama kali dibuka
document.addEventListener("DOMContentLoaded", function () {
    ArgandChart.init("complexCanvas");
});

// Pas tombol "Hitung" diklik
document.getElementById("calculateBtn").addEventListener("click", function () {
    const real1Input = document.getElementById("real1").value;
    const imag1Input = document.getElementById("imag1").value;
    const real2Input = document.getElementById("real2").value;
    const imag2Input = document.getElementById("imag2").value;

    if (real1Input === "" || imag1Input === "" || real2Input === "" || imag2Input === "") {
        alert("Silakan isi semua bidang input sebelum menghitung.");
        return;
    }

    const operation = document.getElementById("operation").value;

    if (!operation) {
        document.getElementById("steps").innerHTML = "<p>Silakan pilih operasi terlebih dahulu.</p>";
        return;
    }

    const real1 = parseFloat(real1Input);
    const imag1 = parseFloat(imag1Input);
    const real2 = parseFloat(real2Input);
    const imag2 = parseFloat(imag2Input);

    // Minta tolong file calculator.js buat ngitung
    const calculation = calculateComplex(real1, imag1, real2, imag2, operation);

    if (calculation.error) {
        document.getElementById("steps").innerHTML = `<h3>Error</h3><p>${calculation.error}</p>`;
        return;
    }

    const resultReal = calculation.resultReal;
    const resultImag = calculation.resultImag;

    // Tulis langkah penyelesaiannya
    document.getElementById("steps").innerHTML = generateSteps(
        real1, imag1, real2, imag2, resultReal, resultImag, operation
    );

    // Kirim hasilnya ke grafik baru buat digambar
    ArgandChart.updatePoints([
        { x: real1, y: imag1, label: "Z₁", color: "blue" },
        { x: real2, y: imag2, label: "Z₂", color: "green" },
        { x: resultReal, y: resultImag, label: "Hasil", color: "red" }
    ]);
});
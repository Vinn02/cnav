const canvas = document.getElementById("complexCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function drawGrid() {
    resizeCanvas();

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const step = 40; // jarak grid

    ctx.clearRect(0, 0, width, height);

    // background putih
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // grid tipis
    ctx.strokeStyle = "#dddddd";
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // sumbu utama
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 2;

    // sumbu X
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // sumbu Y
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
}

function drawPoint(real, imag, color, label) {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 40; // skala per 1 satuan

    // konversi koordinat matematika → canvas
    const x = centerX + (real * scale);
    const y = centerY - (imag * scale);

    // titik
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // label titik
    ctx.font = "14px Poppins";
    ctx.fillStyle = color;
    ctx.fillText(label, x + 10, y - 10);
}

function drawVector(real, imag, color) {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 40;

    const x = centerX + (real * scale);
    const y = centerY - (imag * scale);

    // garis dari pusat ke titik
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawDashedLine(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.setLineDash([6, 4]); // garis putus-putus

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.setLineDash([]); // reset
}

function drawParallelogram(real1, imag1, real2, imag2) {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 40;

    // titik Z1
    const x1 = centerX + (real1 * scale);
    const y1 = centerY - (imag1 * scale);

    // titik Z2
    const x2 = centerX + (real2 * scale);
    const y2 = centerY - (imag2 * scale);

    // titik hasil
    const xr = centerX + ((real1 + real2) * scale);
    const yr = centerY - ((imag1 + imag2) * scale);

    // garis bantu putus-putus
    drawDashedLine(x1, y1, xr, yr, "#999");
    drawDashedLine(x2, y2, xr, yr, "#999");
}

function formatComplex(real, imag) {
    let sign = imag >= 0 ? "+" : "-";
    let imagDisplay = Math.abs(imag);

    return `${real} ${sign} ${imagDisplay}i`;
}

drawGrid();
window.addEventListener("resize", drawGrid);

document.getElementById("calculateBtn").addEventListener("click", function () {
    // ambil nilai input
    let real1 = parseFloat(document.getElementById("real1").value) || 0;
    let imag1 = parseFloat(document.getElementById("imag1").value) || 0;

    let real2 = parseFloat(document.getElementById("real2").value) || 0;
    let imag2 = parseFloat(document.getElementById("imag2").value) || 0;

    let operation = document.getElementById("operation").value;

    let resultReal = 0;
    let resultImag = 0;
    let steps = "";

    // validasi operasi
    if (!operation) {
        document.getElementById("steps").innerHTML =
            "<p>Silakan pilih operasi terlebih dahulu.</p>";
        return;
    }

    // proses operasi
    switch (operation) {
        case "add":
            resultReal = real1 + real2;
            resultImag = imag1 + imag2;

            steps = `
                <h3>Penjumlahan Bilangan Kompleks</h3>
                <p>Z₁ = ${real1} + ${imag1}i</p>
                <p>Z₂ = ${real2} + ${imag2}i</p>
                <br>
                <p>Rumus:</p>
                <p>(a + bi) + (c + di) = (a + c) + (b + d)i</p>
                <br>
                <p>Substitusi:</p>
                <p>(${real1} + ${imag1}i) + (${real2} + ${imag2}i)</p>
                <p>= (${real1} + ${real2}) + (${imag1} + ${imag2})i</p>
                <p>= ${formatComplex(resultReal, resultImag)}</p>
            `;
            break;

        case "sub":
            resultReal = real1 - real2;
            resultImag = imag1 - imag2;

            steps = `
                <h3>Pengurangan Bilangan Kompleks</h3>
                <p>Z₁ = ${real1} + ${imag1}i</p>
                <p>Z₂ = ${real2} + ${imag2}i</p>
                <br>
                <p>Rumus:</p>
                <p>(a + bi) - (c + di) = (a - c) + (b - d)i</p>
                <br>
                <p>Hasil:</p>
                <p>= ${formatComplex(resultReal, resultImag)}</p>
            `;
            break;

        case "mul":
            resultReal = (real1 * real2) - (imag1 * imag2);
            resultImag = (real1 * imag2) + (imag1 * real2);

            steps = `
                <h3>Perkalian Bilangan Kompleks</h3>
                <p>Rumus:</p>
                <p>(a + bi)(c + di)</p>
                <p>= (ac - bd) + (ad + bc)i</p>
                <br>
                <p>Hasil:</p>
                <p>= ${formatComplex(resultReal, resultImag)}</p>
            `;
            break;

        case "div":
    const denominator = (real2 * real2) + (imag2 * imag2);

    // validasi pembagi nol
    if (denominator === 0) {
        document.getElementById("steps").innerHTML = `
            <h3>Error</h3>
            <p>Tidak dapat melakukan pembagian dengan 0 + 0i</p>
        `;
        drawGrid();
        return;
    }

    resultReal = ((real1 * real2) + (imag1 * imag2)) / denominator;
    resultImag = ((imag1 * real2) - (real1 * imag2)) / denominator;

    steps = `
        <h3>Pembagian Bilangan Kompleks</h3>

        <p>Z₁ = ${real1} + ${imag1}i</p>
        <p>Z₂ = ${real2} + ${imag2}i</p>

        <br>

        <p>Rumus:</p>
        <p>((a + bi) / (c + di))</p>

        <p>= ((a + bi)(c - di)) / (c² + d²)</p>

        <br>

        <p>Penyebut:</p>
        <p>= (${real2}² + ${imag2}²)</p>
        <p>= ${denominator}</p>

        <br>

        <p>Hasil:</p>
        <p>= ${formatComplex(resultReal, resultImag)}</p>
    `;
    break;
    }

    drawGrid();

if (operation === "add") {
    drawParallelogram(real1, imag1, real2, imag2);
}

drawVector(real1, imag1, "blue");
drawVector(real2, imag2, "green");
drawVector(resultReal, resultImag, "red");

// titik Z1
drawPoint(real1, imag1, "blue", "Z₁");

// titik Z2
drawPoint(real2, imag2, "green", "Z₂");

// titik hasil
drawPoint(resultReal, resultImag, "red", "Hasil");
    // tampilkan langkah
    document.getElementById("steps").innerHTML = steps;
});
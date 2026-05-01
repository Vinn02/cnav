const canvas = document.getElementById("complexCanvas");
const ctx = canvas.getContext("2d");

let scale = 40;

let savedReal1 = 0;
let savedImag1 = 0;
let savedReal2 = 0;
let savedImag2 = 0;
let savedResultReal = 0;
let savedResultImag = 0;
let savedOperation = "";

let offsetX = 0;
let offsetY = 0;

let isDragging = false;
let startX = 0;
let startY = 0;

const minScale = 10;
const maxScale = 150;
const zoomStep = 10;

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function drawDashedLine(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.setLineDash([6, 4]);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawParallelogram(real1, imag1, real2, imag2) {
    const centerX = canvas.width / 2 + offsetX;
    const centerY = canvas.height / 2 + offsetY;

    const x1 = centerX + (real1 * scale);
    const y1 = centerY - (imag1 * scale);

    const x2 = centerX + (real2 * scale);
    const y2 = centerY - (imag2 * scale);

    const xr = centerX + ((real1 + real2) * scale);
    const yr = centerY - ((imag1 + imag2) * scale);

    drawDashedLine(x1, y1, xr, yr, "#999");
    drawDashedLine(x2, y2, xr, yr, "#999");
}

function formatComplex(real, imag) {
    const sign = imag >= 0 ? "+" : "-";
    return `${real} ${sign} ${Math.abs(imag)}i`;
}

function renderGraph() {
    drawGrid();

    if (savedOperation === "add") {
        drawParallelogram(
            savedReal1,
            savedImag1,
            savedReal2,
            savedImag2
        );
    }

    drawVector(savedReal1, savedImag1, "blue");
    drawVector(savedReal2, savedImag2, "green");

    drawPoint(savedReal1, savedImag1, "blue", "Z₁");
    drawPoint(savedReal2, savedImag2, "green", "Z₂");

    if (savedOperation !== "") {
        drawVector(savedResultReal, savedResultImag, "red");
        drawPoint(savedResultReal, savedResultImag, "red", "Hasil");
    }
}

resizeCanvas();
drawGrid();
initControls();

window.addEventListener("resize", function () {
    resizeCanvas();
    renderGraph();
});

document.getElementById("calculateBtn").addEventListener("click", function () {
    const real1Input = document.getElementById("real1").value;
    const imag1Input = document.getElementById("imag1").value;
    const real2Input = document.getElementById("real2").value;
    const imag2Input = document.getElementById("imag2").value;

    if (
        real1Input === "" ||
        imag1Input === "" ||
        real2Input === "" ||
        imag2Input === ""
    ) {
        alert("Silakan isi semua bidang input sebelum menghitung.");
        return;
    }

    const operation = document.getElementById("operation").value;

    if (!operation) {
        document.getElementById("steps").innerHTML =
            "<p>Silakan pilih operasi terlebih dahulu.</p>";
        return;
    }

    const real1 = parseFloat(real1Input);
    const imag1 = parseFloat(imag1Input);
    const real2 = parseFloat(real2Input);
    const imag2 = parseFloat(imag2Input);

    const calculation = calculateComplex(
        real1,
        imag1,
        real2,
        imag2,
        operation
    );

    if (calculation.error) {
        document.getElementById("steps").innerHTML = `
            <h3>Error</h3>
            <p>${calculation.error}</p>
        `;
        return;
    }

    const resultReal = calculation.resultReal;
    const resultImag = calculation.resultImag;

    savedReal1 = real1;
    savedImag1 = imag1;
    savedReal2 = real2;
    savedImag2 = imag2;
    savedResultReal = resultReal;
    savedResultImag = resultImag;
    savedOperation = operation;

    document.getElementById("steps").innerHTML = generateSteps(
        real1,
        imag1,
        real2,
        imag2,
        resultReal,
        resultImag,
        operation
    );

    renderGraph();
});
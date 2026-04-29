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

function drawGrid() {
    resizeCanvas();

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2 + offsetX;
    const centerY = height / 2 + offsetY;
    const step = scale;
    let labelStep = 1;

    if (scale <= 20) {
        labelStep = 5;
    } else if (scale <= 30) {
        labelStep = 2;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#e8e8e8";
    ctx.lineWidth = 0.8;
    
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

    ctx.fillStyle = "#666";
    ctx.font = "12px Poppins";
    ctx.fillStyle = "#666";
    ctx.font = "12px Poppins";

    for (let x = centerX; x < width; x += step) {
        let value = Math.round((x - centerX) / scale);
        if (value !== 0 && value % labelStep === 0) {
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText(value, x, centerY + 8);
        }
    }

    for (let x = centerX; x > 0; x -= step) {
        let value = Math.round((x - centerX) / scale);
        if (value !== 0 && value % labelStep === 0) {
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText(value, x, centerY + 8);
        }
    }
    
    for (let y = centerY; y < height; y += step) {
        let value = Math.round((centerY - y) / scale);
        if (value !== 0 && value % labelStep === 0) {
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(value, centerX + 8, y);
        }
    }
    
    for (let y = centerY; y > 0; y -= step) {
        let value = Math.round((centerY - y) / scale);
        if (value !== 0 && value % labelStep === 0) {
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(value, centerX + 8, y);
        }
    }
    
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2.2;
    ctx.fillStyle = "#222";
    ctx.font = "14px Poppins";
    ctx.fontWeight = "600";
    ctx.font = "15px Poppins";
    ctx.fillStyle = "#222";
    ctx.textAlign = "right";
    ctx.fillText("Real Axis", width - 25, centerY - 12);
    ctx.textAlign = "left";
    ctx.fillText("Imaginary Axis", centerX + 12, 24);

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
}

function drawPoint(real, imag, color, label) {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2 + offsetX;
    const centerY = height / 2 + offsetY;
    const x = centerX + (real * scale);
    const y = centerY - (imag * scale);
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.font = "14px Poppins";
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + 12, y - 14);
}

function drawVector(real, imag, color) {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2 + offsetX;
    const centerY = height / 2 + offsetY;
    const x = centerX + (real * scale);
    const y = centerY - (imag * scale);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
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
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2 + offsetX;
    const centerY = height / 2 + offsetY;
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
    let sign = imag >= 0 ? "+" : "-";
    let imagDisplay = Math.abs(imag);
    return `${real} ${sign} ${imagDisplay}i`;
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
    drawVector(savedResultReal, savedResultImag, "red");
    drawPoint(savedReal1, savedImag1, "blue", "Z₁");
    drawPoint(savedReal2, savedImag2, "green", "Z₂");

    if (savedOperation !== "") {
        drawPoint(savedResultReal, savedResultImag, "red", "Hasil");
    }
}

drawGrid();
window.addEventListener("resize", drawGrid);
document.getElementById("calculateBtn").addEventListener("click", function () {
    let real1 = parseFloat(document.getElementById("real1").value) || 0;
    let imag1 = parseFloat(document.getElementById("imag1").value) || 0;
    let real2 = parseFloat(document.getElementById("real2").value) || 0;
    let imag2 = parseFloat(document.getElementById("imag2").value) || 0;
    let operation = document.getElementById("operation").value;
    let resultReal = 0;
    let resultImag = 0;
    let steps = "";

    if (!operation) {
        document.getElementById("steps").innerHTML =
            "<p>Silakan pilih operasi terlebih dahulu.</p>";
        return;
    }

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

    savedReal1 = real1;
    savedImag1 = imag1;
    savedReal2 = real2;
    savedImag2 = imag2;
    savedResultReal = resultReal;
    savedResultImag = resultImag;
    savedOperation = operation;

    renderGraph()
    document.getElementById("steps").innerHTML = steps;
});

document.getElementById("zoomIn").addEventListener("click", function () {
    if (scale < maxScale) {
        scale += zoomStep;
        renderGraph();
    }
});

document.getElementById("zoomOut").addEventListener("click", function () {
    if (scale > minScale) {
        scale -= zoomStep;
        renderGraph();
    }
});

canvas.addEventListener("wheel", function (e) {
    e.preventDefault();

    if (e.deltaY < 0) {
        // scroll ke atas → zoom in
        if (scale < maxScale) {
            scale += zoomStep;
        }
    } else {
        // scroll ke bawah → zoom out
        if (scale > minScale) {
            scale -= zoomStep;
        }
    }

    renderGraph();
});

canvas.addEventListener("mousedown", function (e) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener("mousemove", function (e) {
    if (!isDragging) return;

    let dx = e.clientX - startX;
    let dy = e.clientY - startY;

    offsetX += dx;
    offsetY += dy;

    startX = e.clientX;
    startY = e.clientY;

    renderGraph();
});

canvas.addEventListener("mouseup", function () {
    isDragging = false;
});

canvas.addEventListener("mouseleave", function () {
    isDragging = false;
});

document.getElementById("resetBtn").addEventListener("click", function () {
    document.getElementById("real1").value = "";
    document.getElementById("imag1").value = "";
    document.getElementById("real2").value = "";
    document.getElementById("imag2").value = "";
    document.getElementById("operation").value = "";
    document.getElementById("steps").innerHTML = "";

    savedReal1 = 0;
    savedImag1 = 0;
    savedReal2 = 0;
    savedImag2 = 0;
    savedResultReal = 0;
    savedResultImag = 0;
    savedOperation = "";

    scale = 40;

    offsetX = 0;
    offsetY = 0;

    renderGraph();
});

document.getElementById("saveGraphBtn").addEventListener("click", function () {
    const link = document.createElement("a");
    link.download = "complex-graph.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});
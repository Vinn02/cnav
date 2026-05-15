import { DOM } from "../ui/dom.js";
import { appState } from "../core/state.js";

const canvas = DOM.canvas;
const ctx = canvas.getContext("2d");

let skala = 40;
let geserX = 0;
let geserY = 0;
let sensorAktif = false;

export function resizeCanvas() {
    canvas.width = canvas.offsetWidth || 800;
    canvas.height = canvas.offsetHeight || 500;
    if (geserX === 0) {
        geserX = canvas.width / 2;
        geserY = canvas.height / 2;
    }
    if (!sensorAktif) {
        aktifkanInteraksi();
        sensorAktif = true;
    }
}

function aktifkanInteraksi() {
    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        const mx = (e.offsetX - geserX) / skala;
        const my = (e.offsetY - geserY) / skala;
        if (e.deltaY < 0) skala *= 1.1;
        else skala /= 1.1;
        geserX = e.offsetX - mx * skala;
        geserY = e.offsetY - my * skala;
        renderGraph();
    }, { passive: false });

    let drag = false;
    let ax, ay;
    canvas.addEventListener("mousedown", (e) => {
        drag = true;
        canvas.style.cursor = "grabbing";
        ax = e.clientX - geserX;
        ay = e.clientY - geserY;
    });
    window.addEventListener("mousemove", (e) => {
        if (!drag) return;
        geserX = e.clientX - ax;
        geserY = e.clientY - ay;
        renderGraph();
    });
    window.addEventListener("mouseup", () => {
        drag = false;
        canvas.style.cursor = "default";
    });
}

function hitungLangkahGrid() {
    let target = 60 / skala;
    return Math.pow(10, Math.ceil(Math.log10(target)));
}

function drawGrid() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    const step = hitungLangkahGrid();
    const subStep = step / 5;

    // 1. Grid Halus (Kotak Kecil - Kontras Tinggi)
    ctx.strokeStyle = "#dcdcdc"; 
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = Math.floor(-geserX / (skala * subStep)) * subStep; x * skala + geserX < w; x += subStep) {
        ctx.moveTo(x * skala + geserX, 0); ctx.lineTo(x * skala + geserX, h);
    }
    for (let y = Math.floor(-geserY / (skala * subStep)) * subStep; y * skala + geserY < h; y += subStep) {
        ctx.moveTo(0, y * skala + geserY); ctx.lineTo(w, y * skala + geserY);
    }
    ctx.stroke();

    // 2. Grid Utama (Kotak Besar - Sangat Jelas)
    ctx.strokeStyle = "#999999"; 
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = Math.floor(-geserX / (skala * step)) * step; x * skala + geserX < w; x += step) {
        ctx.moveTo(x * skala + geserX, 0); ctx.lineTo(x * skala + geserX, h);
    }
    for (let y = Math.floor(-geserY / (skala * step)) * step; y * skala + geserY < h; y += step) {
        ctx.moveTo(0, y * skala + geserY); ctx.lineTo(w, y * skala + geserY);
    }
    ctx.stroke();

    // 3. Label Angka (Hitam Pekat)
    ctx.fillStyle = "#000";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    for (let x = Math.floor(-geserX / (skala * step)) * step; x * skala + geserX < w; x += step) {
        if (Math.abs(x) > 1e-10) ctx.fillText(parseFloat(x.toPrecision(12)), x * skala + geserX, geserY + 22);
    }
    ctx.textAlign = "left";
    for (let y = Math.floor(-geserY / (skala * step)) * step; y * skala + geserY < h; y += step) {
        if (Math.abs(y) > 1e-10) ctx.fillText(parseFloat((-y).toPrecision(12)), geserX + 15, y * skala + geserY);
    }

    // 4. Sumbu Utama (Hitam Tebal Maksimal)
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, geserY); ctx.lineTo(w, geserY);
    ctx.moveTo(geserX, 0); ctx.lineTo(geserX, h);
    ctx.stroke();

    // 5. Label Axis (Posisinya Tetap)
    ctx.fillStyle = "#000";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "right";
    ctx.fillText("Real Axis", w - 25, geserY - 15);
    ctx.textAlign = "left";
    ctx.fillText("Imaginary Axis", geserX + 25, 40);
}

function drawDashedLine(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.setLineDash([6, 4]);
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawParallelogram(r1, i1, r2, i2) {
    const x1 = geserX + (r1 * skala);
    const y1 = geserY - (i1 * skala);
    const x2 = geserX + (r2 * skala);
    const y2 = geserY - (i2 * skala);
    const xr = geserX + ((r1 + r2) * skala);
    const yr = geserY - ((i1 + i2) * skala);
    drawDashedLine(x1, y1, xr, yr, "#666");
    drawDashedLine(x2, y2, xr, yr, "#666");
}

function drawVector(real, imag, warna, label) {
    const tx = geserX + (real * skala);
    const ty = geserY - (imag * skala);
    drawDashedLine(tx, ty, tx, geserY, "#aaa");
    drawDashedLine(tx, ty, geserX, ty, "#aaa");
    
    ctx.strokeStyle = warna;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(geserX, geserY); ctx.lineTo(tx, ty);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(tx, ty, 8, 0, Math.PI * 2);
    ctx.fillStyle = warna;
    ctx.fill();

    ctx.font = "bold 16px Arial";
    ctx.fillText(label, tx + 15, ty - 15);
}

export function zoomIn() { skala *= 1.2; renderGraph(); }
export function zoomOut() { skala /= 1.2; renderGraph(); }

export function renderGraph() {
    drawGrid();
    if (!appState.savedOperation || appState.savedOperation === "") {
        drawVector(0, 0, "#008000", "Z");
    } else {
        // Fitur Jajar Genjang Penjumlahan
        if (appState.savedOperation === "add") {
            drawParallelogram(
                appState.savedReal1, appState.savedImag1,
                appState.savedReal2, appState.savedImag2
            );
        }
        drawVector(appState.savedReal1, appState.savedImag1, "blue", "Z₁");
        drawVector(appState.savedReal2, appState.savedImag2, "green", "Z₂");
        drawVector(appState.savedResultReal, appState.savedResultImag, "red", "Hasil");
    }
}
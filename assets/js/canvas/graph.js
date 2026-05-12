import { DOM } from "../ui/dom.js";
import { appState } from "../core/state.js";

const canvas = DOM.canvas;
const ctx = canvas.getContext("2d");

export function resizeCanvas() {
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
    const centerX = canvas.width / 2 + appState.offsetX;
    const centerY = canvas.height / 2 + appState.offsetY;

    const x1 = centerX + (real1 * appState.scale);
    const y1 = centerY - (imag1 * appState.scale);

    const x2 = centerX + (real2 * appState.scale);
    const y2 = centerY - (imag2 * appState.scale);

    const xr = centerX + ((real1 + real2) * appState.scale);
    const yr = centerY - ((imag1 + imag2) * appState.scale);

    drawDashedLine(x1, y1, xr, yr, "#999");
    drawDashedLine(x2, y2, xr, yr, "#999");
}

function drawGrid() {
    const width = canvas.width;
    const height = canvas.height;

    const centerX = width / 2 + appState.offsetX;
    const centerY = height / 2 + appState.offsetY;

    let step = appState.scale;

    let unitValue = 1;

    if (step < 10) {
        unitValue = Math.round(10 / step);
        step = 10;
    }

    let labelStep = 1;

    if (appState.scale <= 30) {
        labelStep = 2;
    }

    if (appState.scale <= 15) {
        labelStep = 5;
    }

    if (appState.scale <= 8) {
        labelStep = 10;
    }

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = appState.scale <= 10 ? "#f1f1f1" : "#e8e8e8";
    ctx.lineWidth = 0.8;

    const startX = centerX % step;

    const worldStartX = -Math.floor(centerX / step) * unitValue;
    for (let x = startX; x < width; x += step) {
        const worldValue = worldStartX + Math.round((x- startX) / step) * unitValue;
        const isMajor = worldValue % 5 === 0;
        ctx.beginPath();
        ctx.strokeStyle = isMajor ? "#c0c0c0" : "#e7e7e7";
        ctx.lineWidth = isMajor ? 1.2 : 0.8;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    const startY = centerY % step;

    const worldStartY = Math.floor(centerY / step) * unitValue;
    for (let y = startY; y < height; y += step) {
        const worldValue = worldStartY - Math.round((y - startY) / step) * unitValue;
        const isMajor = worldValue % 5 === 0;
        ctx.beginPath();
        ctx.strokeStyle = isMajor ? "#c0c0c0" : "#e7e7e7";
        ctx.lineWidth = isMajor ? 1.2 : 0.8;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    ctx.fillStyle = "#666";
    ctx.font = appState.scale <= 10 ? "10px Poppins" : "12px Poppins";

    for (let x = startX; x < width; x += step) {
        let value = worldStartX + Math.round((x - startX) / step) * unitValue;

        if (value !== 0 && value % labelStep === 0) {
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText(value, x, centerY + 8);
        }
    }

    for (let x = startX; x > 0; x -= step) {
        let value = worldStartX + Math.round((x - startX) / step) * unitValue;

        if (value !== 0 && value % labelStep === 0) {
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText(value, x, centerY + 8);
        }
    }

    for (let y = startY; y < height; y += step) {
        let value = worldStartY - Math.round((y - startY) / step) * unitValue;

        if (value !== 0 && value % labelStep === 0) {
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(value, centerX + 8, y);
        }
    }

    for (let y = startY; y > 0; y -= step) {
        let value = worldStartY + Math.round((startY - y) / step) * unitValue;

        if (value !== 0 && value % labelStep === 0) {
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(value, centerX + 8, y);
        }
    }

    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2.2;
    ctx.fillStyle = "#222";
    ctx.font = "600 15px Poppins";

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
    const centerX = canvas.width / 2 + appState.offsetX;
    const centerY = canvas.height / 2 + appState.offsetY;

    const x = centerX + (real * appState.scale);
    const y = centerY - (imag * appState.scale);

    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);

    ctx.fillStyle = color;
    ctx.fill();

    ctx.font = "14px Poppins";
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + 12, y - 14);
}

function drawVector(real, imag, color) {
    const centerX = canvas.width / 2 + appState.offsetX;
    const centerY = canvas.height / 2 + appState.offsetY;

    const x = centerX + (real * appState.scale);
    const y = centerY - (imag * appState.scale);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

export function renderGraph() {
    drawGrid();

    if (appState.savedOperation === "add") {
        drawParallelogram(
            appState.savedReal1,
            appState.savedImag1,
            appState.savedReal2,
            appState.savedImag2
        );
    }

    drawVector(appState.savedReal1, appState.savedImag1, "blue");
    drawVector(appState.savedReal2, appState.savedImag2, "green");

    drawPoint(appState.savedReal1, appState.savedImag1, "blue", "Z₁");
    drawPoint(appState.savedReal2, appState.savedImag2, "green", "Z₂");

    if (appState.savedOperation !== "") {
        drawVector(appState.savedResultReal, appState.savedResultImag, "red");
        drawPoint(appState.savedResultReal, appState.savedResultImag, "red", "Hasil");
    }
}
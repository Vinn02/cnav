import { DOM } from "./dom.js";
import { appState } from "../core/state.js";
import { renderGraph, zoomIn, zoomOut } from "../canvas/graph.js";

const canvas = DOM.canvas;

export function initControls() {
    // Tombol Zoom In (+)
    DOM.zoomIn.addEventListener("click", function () {
        zoomIn();
    });

    // Tombol Zoom Out (-)
    DOM.zoomOut.addEventListener("click", function () {
        zoomOut();
    });

    // Tombol Reset
    DOM.resetBtn.addEventListener("click", function () {
        // Kosongkan Input UI
        DOM.real1.value = "";
        DOM.imag1.value = "";
        DOM.real2.value = "";
        DOM.imag2.value = "";
        DOM.operation.value = "";
        DOM.steps.innerHTML = "";

        // Reset Data di State
        appState.savedReal1 = 0;
        appState.savedImag1 = 0;
        appState.savedReal2 = 0;
        appState.savedImag2 = 0;
        appState.savedResultReal = 0;
        appState.savedResultImag = 0;
        appState.savedOperation = "";

        // Gambar ulang grafik (akan kembali ke titik hijau Z)
        renderGraph();
    });

    // Tombol Simpan Grafik
    DOM.saveGraphBtn.addEventListener("click", function () {
        const link = document.createElement("a");
        link.download = "complex-graph.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}
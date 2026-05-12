import { DOM } from "./dom.js";
import { appState } from "../core/state.js";
import { renderGraph } from "../canvas/graph.js";

const canvas = DOM.canvas;

export function initControls() {
    DOM.zoomIn.addEventListener("click", function () {
        if (appState.scale < appState.maxScale) {
            appState.scale += appState.zoomStep;
            renderGraph();
        }
    });

    DOM.zoomOut.addEventListener("click", function () {
        if (appState.scale > appState.minScale) {
            appState.scale -= appState.zoomStep;
            renderGraph();
        }
    });

    canvas.addEventListener("wheel", function (e) {
        e.preventDefault();

        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        const worldX = (mouseX - (canvas.width / 2 + appState.offsetX)) / appState.scale;
        const worldY = ((canvas.height / 2 + appState.offsetY) - mouseY) / appState.scale;
        
        let newScale = appState.scale;

        if (e.deltaY < 0) {
            newScale += appState.zoomStep;
            if (newScale > appState.maxScale) {
                newScale = appState.maxScale;
            }
        } else {
            newScale -= appState.zoomStep;
            if (newScale < appState.minScale) {
                newScale = appState.minScale;
            }
        }

        appState.scale = newScale;
        appState.offsetX = mouseX - canvas.width / 2 - (worldX * appState.scale);
        appState.offsetY = mouseY - canvas.height / 2 + (worldY * appState.scale);

        renderGraph();
    });

    canvas.addEventListener("mousedown", function (e) {
        appState.isDragging = true;
        appState.startX = e.clientX;
        appState.startY = e.clientY;
    });

    canvas.addEventListener("mousemove", function (e) {
        if (!appState.isDragging) return;

        let dx = e.clientX - appState.startX;
        let dy = e.clientY - appState.startY;

        appState.offsetX += dx;
        appState.offsetY += dy;

        appState.startX = e.clientX;
        appState.startY = e.clientY;

        renderGraph();
    });

    canvas.addEventListener("mouseup", function () {
        appState.isDragging = false;
    });

    canvas.addEventListener("mouseleave", function () {
        appState.isDragging = false;
    });

    DOM.resetBtn.addEventListener("click", function () {
        DOM.real1.value = "";
        DOM.imag1.value = "";
        DOM.real2.value = "";
        DOM.imag2.value = "";
        DOM.operation.value = "";

        DOM.steps.innerHTML = "";

        appState.savedReal1 = 0;
        appState.savedImag1 = 0;
        appState.savedReal2 = 0;
        appState.savedImag2 = 0;

        appState.savedResultReal = 0;
        appState.savedResultImag = 0;

        appState.savedOperation = "";

        appState.scale = 40;
        appState.offsetX = 0;
        appState.offsetY = 0;

        renderGraph();
    });

    DOM.saveGraphBtn.addEventListener("click", function () {
        const link = document.createElement("a");

        link.download = "complex-graph.png";
        link.href = canvas.toDataURL("image/png");

        link.click();
    });
}
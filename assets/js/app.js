import { DOM } from "./ui/dom.js";

import { appState } from "./core/state.js";
import { calculateComplex } from "./core/calculator.js";

import { generateSteps } from "./ui/steps.js";
import { initControls } from "./ui/controls.js";

import {
    resizeCanvas,
    renderGraph
} from "./canvas/graph.js";

resizeCanvas();
renderGraph();
initControls();

window.addEventListener("resize", function () {
    resizeCanvas();
    renderGraph();
});

DOM.calculateBtn.addEventListener("click", function () {
    const real1Input = DOM.real1.value;
    const imag1Input = DOM.imag1.value;
    const real2Input = DOM.real2.value;
    const imag2Input = DOM.imag2.value;

    if (
        real1Input === "" ||
        imag1Input === "" ||
        real2Input === "" ||
        imag2Input === ""
    ) {
        alert("Silakan isi semua bidang input sebelum menghitung.");
        return;
    }

    const operation = DOM.operation.value;

    if (!operation) {
        DOM.steps.innerHTML =
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
        DOM.steps.innerHTML = `
            <h3>Error</h3>
            <p>${calculation.error}</p>
        `;
        return;
    }

    const resultReal = calculation.resultReal;
    const resultImag = calculation.resultImag;

    appState.savedReal1 = real1;
    appState.savedImag1 = imag1;

    appState.savedReal2 = real2;
    appState.savedImag2 = imag2;

    appState.savedResultReal = resultReal;
    appState.savedResultImag = resultImag;

    appState.savedOperation = operation;

    DOM.steps.innerHTML = generateSteps(
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
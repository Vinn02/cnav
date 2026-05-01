function initControls() {
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
            if (scale < maxScale) {
                scale += zoomStep;
            }
        } else {
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
}
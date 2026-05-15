function initControls() {
    // Tombol +
    document.getElementById("zoomIn").addEventListener("click", function () {
        ArgandChart.zoomIn();
    });

    // Tombol -
    document.getElementById("zoomOut").addEventListener("click", function () {
        ArgandChart.zoomOut();
    });

    // Tombol Reset
    document.getElementById("resetBtn").addEventListener("click", function () {
        document.getElementById("real1").value = "";
        document.getElementById("imag1").value = "";
        document.getElementById("real2").value = "";
        document.getElementById("imag2").value = "";
        document.getElementById("operation").value = "";
        document.getElementById("steps").innerHTML = "";

        // Hapus titik di grafik
        ArgandChart.updatePoints([]);
    });

    // Tombol Download
    document.getElementById("saveGraphBtn").addEventListener("click", function () {
        const canvasElement = document.getElementById("complexCanvas");
        const link = document.createElement("a");
        link.download = "complex-graph.png";
        link.href = canvasElement.toDataURL("image/png");
        link.click();
    });
}

// Langsung aktifkan tombol pas web dibuka
document.addEventListener("DOMContentLoaded", function() {
    initControls();
});
const ArgandChart = (function() {
    let canvas, ctx;
    let scale = 40; // Skala zoom awal
    let offsetX = 0;
    let offsetY = 0;
    let points = []; // Tempat nyimpen data titik Z1, Z2, Hasil

    function init(canvasId) {
        canvas = document.getElementById(canvasId);
        ctx = canvas.getContext("2d");
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        setupInteractions();
        render();
    }

    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth || 800;
        canvas.height = canvas.parentElement.offsetHeight || 500;
        
        // Bikin titik 0,0 pas di tengah layar
        offsetX = canvas.width / 2;
        offsetY = canvas.height / 2;
        render();
    }

    // Fungsi biar jarak angka di grid gak numpuk pas di-zoom
    function getStepSize() {
        const targetDist = 80; 
        const rawStep = targetDist / scale;
        const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const normalized = rawStep / mag;
        
        if (normalized < 1.5) return 1 * mag;
        if (normalized < 3.5) return 2 * mag;
        if (normalized < 7.5) return 5 * mag;
        return 10 * mag;
    }

    function render() {
        // Hapus layar jadi putih lagi
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const step = getStepSize();
        
        // 1. Gambar Grid (Garis kotak-kotak tipis)
        ctx.strokeStyle = "#e8e8e8";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        
        ctx.fillStyle = "#666";
        ctx.font = "12px Poppins"; 
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        // Garis Vertikal & Angka
        const startX = Math.floor((-offsetX / scale) / step) * step;
        for (let x = startX; x * scale + offsetX < canvas.width; x += step) {
            let canvasX = x * scale + offsetX;
            ctx.moveTo(canvasX, 0); 
            ctx.lineTo(canvasX, canvas.height);
            
            if(Math.abs(x) > 0.0001) {
                let label = parseFloat(x.toPrecision(12)); 
                ctx.fillText(label, canvasX, offsetY + 8);
            }
        }
        
        // Garis Horizontal & Angka
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const startY = Math.floor((-offsetY / scale) / step) * step;
        for (let y = startY; y * scale + offsetY < canvas.height; y += step) {
            let canvasY = y * scale + offsetY;
            ctx.moveTo(0, canvasY); 
            ctx.lineTo(canvas.width, canvasY);
            
            let valY = -y; 
            if(Math.abs(valY) > 0.0001) {
                let label = parseFloat(valY.toPrecision(12));
                ctx.fillText(label, offsetX + 8, canvasY);
            }
        }
        ctx.stroke();

        // 2. Gambar Sumbu X dan Y (Garis hitam tebal)
        ctx.strokeStyle = "#222";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(0, offsetY); ctx.lineTo(canvas.width, offsetY); 
        ctx.moveTo(offsetX, 0); ctx.lineTo(offsetX, canvas.height); 
        ctx.stroke();

        // Tulisan Sumbu
        ctx.fillStyle = "#222";
        ctx.font = "600 15px Poppins";
        ctx.textAlign = "right";
        ctx.fillText("Real Axis", canvas.width - 25, offsetY - 12);
        ctx.textAlign = "left";
        ctx.fillText("Imaginary Axis", offsetX + 12, 24);

        // 3. Gambar titik dan garis vektornya
        points.forEach(p => drawVectorAndPoint(p));
    }

    function drawVectorAndPoint(p) {
        const targetX = p.x * scale + offsetX;
        const targetY = offsetY - (p.y * scale);

        // Garis lurus dari pusat ke titik
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(offsetX, offsetY);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();

        // Garis putus-putus ke sumbu
        ctx.beginPath();
        ctx.setLineDash([6, 4]); 
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 1.5;
        ctx.moveTo(targetX, targetY); ctx.lineTo(targetX, offsetY); 
        ctx.moveTo(targetX, targetY); ctx.lineTo(offsetX, targetY); 
        ctx.stroke();
        ctx.setLineDash([]); 

        // Titik bulat
        ctx.beginPath();
        ctx.arc(targetX, targetY, 6, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Teks Z1, Z2, dll
        ctx.font = "14px Poppins";
        ctx.fillStyle = p.color;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(p.label, targetX + 12, targetY - 14);
    }

    // Fungsi buat scroll zoom & geser-geser (drag)
    function setupInteractions() {
        canvas.addEventListener('wheel', e => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const mathX = (mouseX - offsetX) / scale;
            const mathY = (mouseY - offsetY) / scale;

            if (e.deltaY < 0) scale *= 1.1; // Scroll atas = zoom in
            else scale /= 1.1; // Scroll bawah = zoom out

            offsetX = mouseX - mathX * scale;
            offsetY = mouseY - mathY * scale;
            render();
        }, { passive: false });

        let isDragging = false;
        let startX, startY;

        canvas.addEventListener('mousedown', e => {
            isDragging = true;
            canvas.style.cursor = "grabbing";
            startX = e.clientX - offsetX;
            startY = e.clientY - offsetY;
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            canvas.style.cursor = "grab";
        });

        window.addEventListener('mousemove', e => {
            if(!isDragging) return;
            offsetX = e.clientX - startX;
            offsetY = e.clientY - startY;
            render();
        });

        canvas.style.cursor = "grab";
    }

    // Fitur yang bisa dipanggil dari file lain
    return {
        init,
        updatePoints: (newPoints) => { points = newPoints; render(); },
        zoomIn: () => { scale *= 1.2; render(); },
        zoomOut: () => { scale /= 1.2; render(); }
    };
})();
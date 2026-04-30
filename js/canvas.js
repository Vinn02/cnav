function drawGrid() {
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
    const centerX = canvas.width / 2 + offsetX;
    const centerY = canvas.height / 2 + offsetY;

    const x = centerX + (real * scale);
    const y = centerY - (imag * scale);

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
    const centerX = canvas.width / 2 + offsetX;
    const centerY = canvas.height / 2 + offsetY;

    const x = centerX + (real * scale);
    const y = centerY - (imag * scale);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}
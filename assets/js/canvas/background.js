const bgcanvas = document.getElementById("bgCanvas");
const bgctx = bgcanvas.getContext("2d");

bgcanvas.width = window.innerWidth;
bgcanvas.height = window.innerHeight;

let stars = [];

const STAR_COUNT = 120;

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * bgcanvas.width;
        this.y = Math.random() * bgcanvas.height;

        this.radius = Math.random() * 1.8;

        this.alpha = Math.random();

        this.speed = Math.random() * 0.2 + 0.05;
    }

    update() {
        this.y += this.speed;

        if (this.y > bgcanvas.height) {
            this.y = 0;
            this.x = Math.random() * bgcanvas.width;
        }
    }

    draw() {
        bgctx.beginPath();

        bgctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        bgctx.fillStyle = `rgba(255,255,255,${this.alpha})`;

        bgctx.fill();
    }
}

function initStars() {
    stars = [];

    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(new Star());
    }
}

function drawBackground() {
    const gradient = bgctx.createLinearGradient(
        0,
        0,
        0,
        bgcanvas.height
    );

    gradient.addColorStop(0, "#000000");
    gradient.addColorStop(1, "#03000f");

    bgctx.fillStyle = gradient;

    bgctx.fillRect(0, 0, bgcanvas.width, bgcanvas.height);
}

function animate() {
    drawBackground();

    stars.forEach((star) => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    bgcanvas.width = window.innerWidth;
    bgcanvas.height = window.innerHeight;

    initStars();
});

initStars();
animate();
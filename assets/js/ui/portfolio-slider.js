const slider = document.querySelector('.portfolio-slider');

let autoSlide;
let isDragging = false;
let startX;
let scrollLeft;

function startAutoSlide() {
    autoSlide = setInterval(() => {
        slider.scrollLeft += 1;
        if (
            slider.scrollLeft + slider.clientWidth
            >= slider.scrollWidth - 1
        ) {
            slider.scrollLeft = 0;
        }
    }, 15);
}

function stopAutoSlide() {
    clearInterval(autoSlide);
}

slider.addEventListener('mouseenter', stopAutoSlide);
slider.addEventListener('mouseleave', startAutoSlide);
slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    slider.classList.add('dragging');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
    isDragging = false;
    slider.classList.remove('dragging');
});

slider.addEventListener('mouseup', () => {
    isDragging = false;
    slider.classList.remove('dragging');
});

slider.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
});

startAutoSlide();
const revealElements = document.querySelectorAll(`
    .about-text,
    .about-image,
    .feature-card,
    .portfolio-card,
    .portfolio-title
`);

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }
        });
    },
    {
        threshold: 0.15
    }
);

revealElements.forEach((el) => {
    observer.observe(el);
});
window.addEventListener("load", () => {

    const elements = document.querySelectorAll(`
        .reveal-top,
        .reveal-left,
        .reveal-right,
        .reveal-bottom
    `);

    elements.forEach((el, index) => {

        setTimeout(() => {

            el.classList.add("show-app");

        }, index * 250);

    });

});
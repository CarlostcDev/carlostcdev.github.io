export function initAutoSelector() {
    const elementos = document.querySelectorAll('.edu, .course');

    if (elementos.length === 0 || !("IntersectionObserver" in window)) return;

    let activoActual = null;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                const primerLi = entry.target.querySelector('ul li:first-child');

                if (entry.isIntersecting) {
                    if (activoActual && activoActual !== entry.target) {
                        activoActual.classList.remove('activo');
                        const liAnterior = activoActual.querySelector('ul li:first-child');
                        if (liAnterior) liAnterior.classList.remove('activo-li');
                    }

                    entry.target.classList.add('activo');
                    if (primerLi) primerLi.classList.add('activo-li');

                    activoActual = entry.target;
                } else if (activoActual === entry.target) {
                        entry.target.classList.remove('activo');
                        if (primerLi) primerLi.classList.remove('activo-li');
                        activoActual = null;
                }
            });
        },
        {
            root: null,
            rootMargin: '-49% 0px -49% 0px',
            threshold: 0.01
        }
    );

    elementos.forEach(el => observer.observe(el));
}

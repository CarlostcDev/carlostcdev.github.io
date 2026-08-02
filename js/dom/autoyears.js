function dateToYear(timeZone) {
    try {
        return new Date().toLocaleDateString('es-ES', {
            timeZone: timeZone,
            year: 'numeric'
        });
    } catch {
        return new Date().getFullYear().toString();
    }
}

const year = document.getElementById("year");

if (year) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    year.textContent = dateToYear(timezone);
}
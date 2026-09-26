

document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', function(e){
        e.preventDefault();
        const destino = document.querySelector(this.getAttribute('href'));
        destino.scrollIntoView({ behavior: 'smooth' });
    });
});


const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.project-tarjeta').forEach(tarjeta => {
    observer.observe(tarjeta);
});
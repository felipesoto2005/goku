
document.addEventListener('DOMContentLoaded', () => {
    const botones = document.querySelectorAll('.filtro-btn');
    const productos = document.querySelectorAll('.producto-card');

    // Inicialmente todos visibles
    productos.forEach(producto => producto.style.display = 'block');

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            // Quitar active de todos los botones
            botones.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filtro = btn.dataset.filtro;

            productos.forEach(producto => {
                if (filtro === 'todos' || producto.dataset.categoria === filtro) {
                    producto.style.display = 'block';
                    setTimeout(() => producto.classList.add('visible'), 10);
                } else {
                    producto.classList.remove('visible');
                    setTimeout(() => producto.style.display = 'none', 300);
                }
            });
        });
    });
});
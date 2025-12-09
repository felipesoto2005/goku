
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

document.addEventListener("DOMContentLoaded", () => {
    const botonesComprar = document.querySelectorAll(".comprar-btn");
    const carritoCount = document.getElementById("carrito-count");

    // Cargar carrito desde localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Actualizar contador al cargar
    actualizarContador();

    // Agregar evento a cada botón
    botonesComprar.forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".producto-card");
            const producto = {
                id: card.dataset.id,
                nombre: card.dataset.nombre,
                precio: parseFloat(card.dataset.precio),
                cantidad: 1
            };

            agregarAlCarrito(producto);
        });
    });

    function agregarAlCarrito(producto) {
        // Revisar si ya existe el producto
        const existe = carrito.find(p => p.id === producto.id);
        if (existe) {
            existe.cantidad += 1;
        } else {
            carrito.push(producto);
        }

        // Guardar en localStorage
        localStorage.setItem("carrito", JSON.stringify(carrito));

        // Actualizar contador
        actualizarContador();
    }

    function actualizarContador() {
        const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        carritoCount.textContent = total;
    }
});
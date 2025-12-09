document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll('.filtro-btn');
    const productos = document.querySelectorAll('.producto-card');
    const botonesComprar = document.querySelectorAll(".comprar-btn");
    const carritoCount = document.getElementById("carrito-count");
    const comprarBtns = document.querySelectorAll('.comprar-btn');

comprarBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = '✓ Producto agregado al carrito';
        document.body.appendChild(notification);

        // Mostrar notificación con animación
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Eliminar notificación después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);

        // Efecto visual en el botón
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    });
});
    // Inicialmente todos visibles
    productos.forEach(producto => producto.style.display = 'block');

    // Función para convertir precio string a número
    function parsePrecio(precioTexto) {
        return parseFloat(precioTexto.replace(/\$|,/g, ''));
    }

    // ======================
    // FILTRO DE PRODUCTOS
    // ======================
    botones.forEach(btn => {
        btn.addEventListener('click', () => {
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

    // ======================
    // CARRITO
    // ======================
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    function actualizarContador() {
        const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        if (carritoCount) carritoCount.textContent = total;
    }

    actualizarContador();

    botonesComprar.forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".producto-card");
            const producto = {
                nombre: card.querySelector("h3").textContent,
                precio: parsePrecio(card.querySelector(".precio").textContent),
                img: card.querySelector("img").src,
                cantidad: 1
            };

            // Revisar si ya existe el producto
            const existe = carrito.find(p => p.nombre === producto.nombre);
            if (existe) {
                existe.cantidad += 1;
            } else {
                carrito.push(producto);
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarContador();
        });
    });
});


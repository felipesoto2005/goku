document.addEventListener("DOMContentLoaded", () => {
    const botonesComprar = document.querySelectorAll(".comprar-btn");
    const carritoCount = document.getElementById("carrito-count");

    // Cargar carrito desde localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Función para convertir precio string a número
    function parsePrecio(precioTexto) {
        return parseFloat(precioTexto.replace(/\$|,/g, ''));
    }

    // Actualizar contador
    function actualizarContador() {
        const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        if (carritoCount) carritoCount.textContent = total;
    }

    actualizarContador();

    // Agregar evento a cada botón
    botonesComprar.forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".producto-card");

            // Leer nombre y precio (si hay precio-actual o solo precio)
            const nombre = card.querySelector("h3").textContent;
            let precioEl = card.querySelector(".precio .precio-actual") || card.querySelector(".precio");
            const precio = parsePrecio(precioEl.textContent);
            const img = card.querySelector("img").src;

            const producto = {
                nombre,
                precio,
                img,
                cantidad: 1
            };

            // Revisar si ya existe el producto en el carrito
            const existe = carrito.find(p => p.nombre === producto.nombre);
            if (existe) {
                existe.cantidad += 1;
            } else {
                carrito.push(producto);
            }

            // Guardar en localStorage
            localStorage.setItem("carrito", JSON.stringify(carrito));

            // Actualizar contador
            actualizarContador();
        });
    });
});

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

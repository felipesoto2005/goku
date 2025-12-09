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
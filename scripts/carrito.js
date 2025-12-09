const carritoItems = document.getElementById('carrito-items');
const btnVaciar = document.getElementById('vaciar-carrito');
const carritoTotal = document.getElementById('carrito-total');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Mostrar carrito
function mostrarCarrito() {
    carritoItems.innerHTML = '';

    carrito.forEach((prod, index) => {
        const item = document.createElement('div');
        item.classList.add('carrito-item');

        item.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <div class="item-info">
                <h3>${prod.nombre}</h3>
                <p>Cantidad: <span class="cantidad">${prod.cantidad}</span></p>
                <p>Precio unitario: <span class="precio-unitario">$${prod.precio}</span></p>
                <p>Subtotal: <span class="subtotal">$${prod.precio * prod.cantidad}</span></p>
            </div>
            <div class="item-buttons">
                <button class="cantidad-mas">+</button>
                <button class="cantidad-menos">-</button>
                <button class="eliminar-item">Eliminar</button>
            </div>
        `;

        // Botones
        item.querySelector('.eliminar-item').addEventListener('click', () => {
            eliminarItem(index);
        });

        item.querySelector('.cantidad-mas').addEventListener('click', () => {
            carrito[index].cantidad++;
            guardarCarrito();
            mostrarCarrito();
        });

        item.querySelector('.cantidad-menos').addEventListener('click', () => {
            if(carrito[index].cantidad > 1) {
                carrito[index].cantidad--;
                guardarCarrito();
                mostrarCarrito();
            }
        });

        carritoItems.appendChild(item);
    });

    actualizarTotal();
}

// Actualizar total
function actualizarTotal() {
    const total = carrito.reduce((sum, prod) => sum + prod.precio * prod.cantidad, 0);
    carritoTotal.textContent = `Total: $${total}`;
}

// Eliminar item
function eliminarItem(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
}

// Vaciar carrito
btnVaciar.addEventListener('click', () => {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
});

// Guardar en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Inicializar
mostrarCarrito();
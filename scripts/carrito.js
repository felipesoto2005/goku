// Selecciones del DOM
const carritoItems = document.getElementById('carrito-items');
const btnVaciar = document.getElementById('vaciar-carrito');
const carritoTotal = document.getElementById('carrito-total');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para convertir precio a número, quitando $ y comas
function obtenerPrecio(str) {
    return parseFloat(str.replace(/[^0-9.-]+/g, "").replace(/,/g, ""));
}

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
                <p>Precio unitario: <span class="precio-unitario">$${prod.precio.toLocaleString()}</span></p>
                <p>Subtotal: <span class="subtotal">$${(prod.precio * prod.cantidad).toLocaleString()}</span></p>
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
            if (carrito[index].cantidad > 1) {
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
    carritoTotal.textContent = `Total: $${total.toLocaleString()}`;
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

// Función para agregar producto al carrito
function agregarAlCarrito(nombre, precio, imagen) {
    // Revisar si ya existe
    const existe = carrito.find(item => item.nombre === nombre);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: obtenerPrecio(precio),
            imagen: imagen,
            cantidad: 1
        });
    }
    guardarCarrito();
    mostrarCarrito();
}

// Asignar evento a todos los botones "comprar"
document.querySelectorAll('.comprar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const nombre = btn.dataset.nombre;
        const precio = parseFloat(btn.dataset.precio);
        const imagen = btn.dataset.imagen;

        const productoExistente = carrito.find(p => p.nombre === nombre);
        if(productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push({ nombre, precio, cantidad: 1, imagen });
        }
        guardarCarrito();
        mostrarCarrito();
    });
});
// Inicializar carrito al cargar
mostrarCarrito();
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('hardwareGrid');
  const btns = Array.from(document.querySelectorAll('.filtro-btn'));

  fetch('Zona-Hardware/catalogo.json')
    .then(r => r.json())
    .then(data => {
      renderItems(data.items);
      initFilters();
    })
    .catch(err => {
      console.error('Error cargando catálogo de hardware:', err);
      grid.innerHTML = '<p style="color:#f88">No se pudo cargar el catálogo.</p>';
    });

  function renderItems(items){
    grid.innerHTML = '';
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'producto-card';
      card.dataset.categoria = item.category;
      card.innerHTML = `
        <div class="producto-image">
          <img src="${item.image}" alt="${escapeHtml(item.title)}" class="product-img">
          <span class="badge">${badgeFor(item.category)}</span>
        </div>
        <div class="producto-content">
          <h3>${escapeHtml(item.title)}</h3>
          <p class="descripcion-vikinga">${escapeHtml(item.desc)}</p>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function initFilters(){
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filtro = btn.getAttribute('data-filtro');
        aplicarFiltro(filtro);
      });
    });
  }

  function aplicarFiltro(filtro){
    const cards = Array.from(grid.querySelectorAll('.producto-card'));
    cards.forEach(c => {
      if(filtro === 'todos' || c.dataset.categoria === filtro){
        c.style.display = '';
      } else {
        c.style.display = 'none';
      }
    });
  }

  function badgeFor(category){
    const map = {
      'procesadores': 'CPU',
      'tarjetas-graficas': 'GPU',
      'memoria': 'RAM',
      'almacenamiento': 'NVMe',
      'fuentes': 'PSU',
      'perifericos': 'GEAR',
      'monitores': 'DISPLAY',
      'gabinetes': 'CASE',
      'motherboard': 'MB'
    };
    return map[category] || '';
  }

  function escapeHtml(str){
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }
});
document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll('.filtro-btn');
    const productos = document.querySelectorAll('.producto-card');
    const botonesComprar = document.querySelectorAll(".comprar-btn");
    const carritoCount = document.getElementById("carrito-count");

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
// =============================================
// FUNCIÓN DE SCROLL A SECCIONES
// =============================================

function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// =============================================
// MENÚ HAMBURGUESA
// =============================================

const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (nav) {
            nav.classList.remove('active');
        }
        if (hamburger) {
            hamburger.classList.remove('active');
        }
    });
});

// =============================================
// ANIMACIÓN DE SCROLL
// =============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observar elementos de producto
document.querySelectorAll('.producto-card').forEach(card => {
    observer.observe(card);
});

document.querySelectorAll('.oferta-card').forEach(card => {
    observer.observe(card);
});

// =============================================
// EFECTO DE COMPRA
// =============================================

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

// =============================================
// ESTILOS PARA NOTIFICACIONES
// =============================================

const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, var(--accent-green), var(--accent-cyan));
        color: var(--primary-dark);
        padding: 15px 25px;
        border-radius: 50px;
        font-weight: bold;
        font-size: 1rem;
        box-shadow: 0 8px 32px rgba(0, 255, 136, 0.3);
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 2000;
        letter-spacing: 1px;
    }

    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }

    @media (max-width: 768px) {
        .notification {
            bottom: 20px;
            right: 20px;
            left: 20px;
            transform: translateY(200px);
            text-align: center;
        }

        .notification.show {
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// =============================================
// EFECTO PARALLAX EN HERO
// =============================================

window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    
    if (scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// =============================================
// ANIMACIÓN DE CARGA INICIAL
// =============================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Agregar estilos de animación de carga
const loadStyle = document.createElement('style');
loadStyle.textContent = `
    .producto-card,
    .oferta-card {
        opacity: 0;
        animation: fadeInUp 0.6s ease-out forwards;
    }

    .producto-card:nth-child(1) { animation-delay: 0.1s; }
    .producto-card:nth-child(2) { animation-delay: 0.2s; }
    .producto-card:nth-child(3) { animation-delay: 0.3s; }
    .producto-card:nth-child(4) { animation-delay: 0.4s; }
    .producto-card:nth-child(5) { animation-delay: 0.5s; }
    .producto-card:nth-child(6) { animation-delay: 0.6s; }
    .producto-card:nth-child(7) { animation-delay: 0.7s; }
    .producto-card:nth-child(8) { animation-delay: 0.8s; }
    .producto-card:nth-child(9) { animation-delay: 0.9s; }

    .oferta-card:nth-child(1) { animation-delay: 0.2s; }
    .oferta-card:nth-child(2) { animation-delay: 0.4s; }
    .oferta-card:nth-child(3) { animation-delay: 0.6s; }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(loadStyle);

// =============================================
// SCRIPT DE CARRITO - TRONVALK
// =============================================

// Contador de carrito en header
let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
const cartCounter = document.querySelector('#cart-counter'); // span en header

if (cartCounter) cartCounter.textContent = cartCount;

// Función para convertir precio string a número
function parsePrecio(precioTexto) {
    return parseFloat(precioTexto.replace(/\$|,/g, ''));
}

// No redeclarar comprarBtns, solo asegurarse que exista
// const comprarBtns = document.querySelectorAll('.comprar-btn');

comprarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const productoCard = btn.closest('.producto-card');
        const producto = {
            nombre: productoCard.querySelector('h3').textContent,
            precio: parsePrecio(productoCard.querySelector('.precio').textContent),
            img: productoCard.querySelector('img').src,
            cantidad: 1
        };

        // Guardar producto en localStorage
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const index = carrito.findIndex(p => p.nombre === producto.nombre);
        if (index > -1) {
            carrito[index].cantidad += 1;
        } else {
            carrito.push(producto);
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Actualizar contador
        cartCount++;
        localStorage.setItem('cartCount', cartCount);
        if (cartCounter) cartCounter.textContent = cartCount;
    });
});


// =============================================
// SMOOTH SCROLL MEJORADO
// =============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId !== '#' && targetId !== '') {
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// =============================================
// EFECTO DE ESCRIBIR EN EL TÍTULO HERO
// =============================================

function typeEffect(element, text, speed = 50) {
    let index = 0;
    element.textContent = '';
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Aplicar efecto al cargar
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeEffect(heroTitle, originalText, 30);
    }
});

// =============================================
// VALIDACIÓN DE FORMULARIO (FUTURA)
// =============================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// =============================================
// MODO OSCURO (ALTERNATIVA FUTURA)
// =============================================

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Cargar preferencia de modo
window.addEventListener('load', () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
});

// =============================================
// ESTADÍSTICAS Y TRACKING (OPCIONAL)
// =============================================

console.log('🎮 Bienvenido a Tronvalk - Tu tienda gamer premium');
console.log('🌟 Diseño moderno y responsivo');
console.log('⚡ Rendimiento optimizado');

// =============================================
// MANEJO DE ERRORES
// =============================================

window.addEventListener('error', (event) => {
    console.error('Error detectado:', event.error);
});

// =============================================
// PERFORMANCE MONITORING
// =============================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', function () {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⏱️ Tiempo de carga total: ${pageLoadTime}ms`);
    });
}

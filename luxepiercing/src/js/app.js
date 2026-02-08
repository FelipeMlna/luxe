import { products } from './products.js';
import { reviews, getReviewsByProduct, getGeneralReviews, addReview } from './reviews.js';

// Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let activeProduct = null;

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total-price');
const cartCountElement = document.getElementById('cart-count');
const cartToggle = document.getElementById('cart-toggle');
const closeCartBtn = document.getElementById('close-cart');
const checkoutBtn = document.getElementById('checkout-btn');

// Format Price in COP
const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
};

// product Modal Logic
const showProductDetails = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    activeProduct = product;
    const productReviews = getReviewsByProduct(id);

    // Create modal DOM structure dynamically
    const modalHTML = `
        <div class="product-modal-overlay" id="product-modal">
            <div class="product-modal-content">
                <button class="close-modal-btn" onclick="window.closeProductModal()">&times;</button>
                <div class="modal-body">
                    <img src="${product.image}" alt="${product.name}" class="modal-image">
                    <div class="modal-details">
                        <h2>${product.name}</h2>
                        <p class="modal-price">${formatPrice(product.price)}</p>
                        <p class="modal-desc">Joyería de alta calidad, material hipoalergénico. Ideal para perforaciones de ${product.category}.</p>
                        <button class="btn btn-primary" onclick="window.addToCart(${product.id}); window.closeProductModal();">Agregar al Carrito</button>
                        
                        <div class="reviews-section">
                            <h3>Reseñas</h3>
                            <div class="reviews-list">
                                ${productReviews.length > 0 ? productReviews.map(r => `
                                    <div class="review-item">
                                        <strong>${r.user}</strong> <span>${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                                        <p>${r.text}</p>
                                    </div>
                                `).join('') : '<p>No hay reseñas aún.</p>'}
                            </div>
                            <!-- Review Form removed for launch optimization -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.closeProductModal = () => {
    const modal = document.getElementById('product-modal');
    if (modal) modal.remove();
    activeProduct = null;
};

window.openProductDetail = (id) => {
    showProductDetails(id);
};

// Render Products
const renderProducts = () => {
    productGrid.innerHTML = products.map(product => `
        <article class="product-card">
            <div class="product-image-container" onclick="window.openProductDetail(${product.id})" style="cursor: pointer;">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <span class="product-price">${formatPrice(product.price)}</span>
                <button class="btn btn-primary full-width" onclick="window.addToCart(${product.id})">
                    Agregar al Carrito
                </button>
            </div>
        </article>
    `).join('');
};

// Cart Functions
const updateCartUI = () => {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    cartTotalElement.textContent = formatPrice(total);

    localStorage.setItem('cart', JSON.stringify(cart));

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Tu carrito está vacío.</p>';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">${formatPrice(item.price)} x ${item.quantity}</div>
                <button class="cart-item-remove" onclick="window.removeFromCart(${item.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
};

// Cart Actions
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    openCart();
};

window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
};

// UI Interactions
const openCart = () => {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
};

const closeCart = () => {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
};

cartToggle.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Mobile Menu Logic
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-link');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        // Optional: Change icon or animate
    });
}

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navList.classList.contains('active')) {
            navList.classList.remove('active');
        }
    });
});

// WhatsApp Integration
const generateWhatsAppLink = () => {
    const phoneNumber = "573024475751";
    let message = `Hola FA Luxe Piercing, quisiera realizar el siguiente pedido:\n\n`;

    cart.forEach(item => {
        message += `- (${item.quantity}) ${item.name}: ${formatPrice(item.price * item.quantity)}\n`;
    });

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    message += `\n*Total a Pagar: ${formatPrice(total)}*`;
    message += "\n\nQuedo atento para coordinar el pago y envío. Gracias.";

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Agrega productos antes de ir al checkout.');
        return;
    }
    // Open Checkout Modal
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) {
        checkoutModal.style.display = 'flex';
    }
});

// Testimonials Logic
const renderTestimonials = () => {
    const testimonialsContainer = document.getElementById('testimonials-grid');
    if (!testimonialsContainer) return;

    const generalReviews = getGeneralReviews();

    if (generalReviews.length === 0) {
        testimonialsContainer.innerHTML = '<p style="text-align:center; color:#888;">Sé el primero en dejar una opinión.</p>';
        return;
    }

    testimonialsContainer.innerHTML = generalReviews.map(r => `
        <div class="testimonial-card">
            <span class="testimonial-user">${r.user}</span>
            <span class="testimonial-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
            <p class="testimonial-text">"${r.text}"</p>
        </div>
    `).join('');
};

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    renderTestimonials();

    // Checkout Form Logic
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('checkout-name').value;
            const phone = document.getElementById('checkout-phone').value;
            const address = document.getElementById('checkout-address').value;
            const city = document.getElementById('checkout-city').value;
            const housing = document.getElementById('checkout-housing').value;
            const idDoc = document.getElementById('checkout-id').value;

            // Verify Data
            if (!name || !phone || !address || !idDoc || !city) {
                alert('Por favor completa todos los datos de envío.');
                return;
            }

            // Show Confirmation Alert
            alert('El pedido será enviado a la tienda para seguir con el proceso de compra.');

            // Generate WhatsApp Message with Shipping Details
            const phoneNumber = "573024475751";
            let message = `Hola FA Luxe Piercing, quisiera realizar el siguiente pedido: \n\n`;
            message += `* Datos de Envío:*\n`;
            message += `Nombre: ${name} \n`;
            message += `CC: ${idDoc} \n`;
            message += `Teléfono: ${phone} \n`;
            message += `Ciudad: ${city} \n`;
            message += `Dirección: ${address} (${housing}) \n\n`;
            message += `* Pedido:*\n`;

            cart.forEach(item => {
                message += `- (${item.quantity}) ${item.name}: ${formatPrice(item.price * item.quantity)} \n`;
            });

            const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            message += `\n * Total a Pagar: ${formatPrice(total)}* `;

            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

            // Close modal and open WhatsApp
            document.getElementById('checkout-modal').style.display = 'none';
            window.open(whatsappUrl, '_blank');
        });
    }
});

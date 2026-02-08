// Initial seed data
const defaultReviews = [
    {
        productId: 'general',
        user: "Camila R.",
        rating: 5,
        text: "Me encanta esta tienda, el servicio es impecable y las joyas son divinas."
    },
    {
        productId: 1,
        user: "Mariana G.",
        rating: 5,
        text: "Hermoso, el brillo es increíble."
    },
    {
        productId: 'general',
        user: "Andrés M.",
        rating: 5,
        text: "Llegó súper rápido a Medellín. Muy recomendados."
    },
    {
        productId: 3,
        user: "Juan P.",
        rating: 4,
        text: "Excelente calidad, aunque un poco difícil de poner."
    },
    {
        productId: 'general',
        user: "Laura V.",
        rating: 5,
        text: "La atención por WhatsApp fue súper rápida y me ayudaron a elegir el tamaño perfecto. ¡Feliz con mis joyas!"
    },
    {
        productId: 'general',
        user: "Sofía M.",
        rating: 5,
        text: "Me recomendaron esta tienda y no decepcionó. El empaque es hermoso y se nota la calidad del material."
    },
    {
        productId: 1,
        user: "Isabella T.",
        rating: 5,
        text: "Llevo 2 meses usando mi piercing y no se ha puesto negro ni me ha dado alergia. ¡Recomendadísimo!"
    },
    {
        productId: 'general',
        user: "Daniela R.",
        rating: 4,
        text: "Muy bonitos diseños, ojalá sacaran más variedad en oro rosa. Pero el envío fue 10/10."
    }
];

// Load from LocalStorage or use defaults
export let reviews = JSON.parse(localStorage.getItem('reviews')) || defaultReviews;

export const addReview = (newReview) => {
    reviews.unshift(newReview); // Add to top
    localStorage.setItem('reviews', JSON.stringify(reviews));
};

export const getReviewsByProduct = (productId) => {
    return reviews.filter(r => r.productId === productId);
};

export const getGeneralReviews = () => {
    return reviews.filter(r => r.productId === 'general');
};

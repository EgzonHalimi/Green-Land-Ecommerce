

const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
const foodContainer = document.querySelector('.food-container');


const renderCartItems = () => {
    foodContainer.innerHTML = '';


    cartItems.forEach(item => {
        const foodCard = document.createElement('div');
        foodCard.classList.add('food-card');
        
        foodCard.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="food-image">
            <div class="food-info">
                <h3 class="food-title">${item.title}</h3>
                <p class="food-description">${item.description}</p>
            </div>
            <div class="quantity">
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn">
                    <i class="fa-solid fa-caret-up"></i>
                    <i class="fa-solid fa-caret-down"></i>
                </button>
            </div>
            <span class="price">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
            <button class="delete-btn">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        `;

        foodContainer.appendChild(foodCard);
    });

    document.getElementById('cart-count').textContent = cartItems.length;
};


foodContainer.addEventListener('click', (e) => {
    const quantityBtn = e.target.closest('.quantity-btn');
    if (quantityBtn) {
        const foodCard = e.target.closest('.food-card');
        const foodTitle = foodCard.querySelector('.food-title').textContent;
        const quantityElement = foodCard.querySelector('.quantity-value');
        const action = e.target.closest('.fa-caret-up') ? 'increase' : 'decrease';
        const product = cartItems.find(item => item.title === foodTitle);

        if (product) {
            if (action === 'increase') {
                product.quantity++;
            } else if (action === 'decrease' && product.quantity > 1) {
                product.quantity--;
            }

            localStorage.setItem('cart', JSON.stringify(cartItems));

            quantityElement.textContent = product.quantity;

            foodCard.querySelector('.price').textContent = `$${(parseFloat(product.price) * product.quantity).toFixed(2)}`;
        }
    }

    if (e.target.closest('.delete-btn')) {
        const foodCard = e.target.closest('.food-card');
        const foodTitle = foodCard.querySelector('.food-title').textContent;
        const updatedCart = cartItems.filter(item => item.title !== foodTitle);

        localStorage.setItem('cart', JSON.stringify(updatedCart));

        renderCartItems();
    }
});


renderCartItems();
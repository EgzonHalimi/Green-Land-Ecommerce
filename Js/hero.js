document.addEventListener("DOMContentLoaded", async function () {
    const categoryButtons = document.querySelectorAll(".category-btn"); 
    const productContainer = document.querySelector(".product-container");
    const apiUrl = "https://dummyjson.com/products/";

    async function fetchProducts(category = "all") {
        let url = apiUrl;
        if (category !== "all") {
            url = `https://dummyjson.com/products/category/${category}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            displayProducts(data.products);
        } catch (error) {
            console.error("Error fetching product data", error);
        }
    }

    
    function displayProducts(products) {
        productContainer.innerHTML = "";
        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <h1>${product.title}</h1>
                <p class="product-des">${product.description.substring(0, 50)}...</p>
                <div class="product-buttons">
                    <span class="product-price">${product.price}$</span>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <span><i class="fa-solid fa-heart"></i></span>
                </div>
            `;
            productContainer.appendChild(productCard);
        });

        setupAddToCartButtons();
    }

    function setupCategoryButtons() {
        categoryButtons.forEach(button => {
            button.addEventListener("click", function () {
                categoryButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                const category = button.getAttribute("data-category");
                fetchProducts(category);
            });
        });
    }

    function setupAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll(".add-to-cart");

        addToCartButtons.forEach(button => {
            button.addEventListener("click", function () {
                const productCard = button.closest(".product-card");
                const product = {
                    id: button.getAttribute("data-id"),
                    title: productCard.querySelector("h1").textContent,
                    price: productCard.querySelector(".product-price").textContent,
                    image: productCard.querySelector("img").src,
                    quantity: 1
                };

                addToCart(product);
                updateCartCount(); 
            });
        });
    }

    
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;  
        } else {
            cart.push(product);  
        }

        localStorage.setItem("cart", JSON.stringify(cart));
    }

    
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0); 
        const cartCountElement = document.querySelector(".cart-count"); 
        if (cartCountElement) {
            cartCountElement.textContent = cartCount; 
        }
    }

    setupCategoryButtons(); 
    await fetchProducts("all"); 
    updateCartCount(); 
});
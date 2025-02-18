document.addEventListener("DOMContentLoaded", function () {
    const checkoutButton = document.querySelector(".checkout");
    const successModal = document.getElementById("success-modal");
    const cardNameInput = document.querySelector(".name-card input");
    const cardNumberInput = document.getElementById("card-nummer");
    const expirationInput = document.querySelector("#expiration-date");
    const cvvInput = document.querySelector("#cvv");
    const cartItems = document.querySelector(".food-container");
    const cartBadge = document.querySelector("#cart-count");
    const totalTaxElement = document.querySelector(".summary span");

    let subtotal = 1668;
    let shipping = 4;
    let tax = 0.1 * subtotal;
    let total = subtotal + shipping + tax;
    let cartCount = 3;

    function updateTotal() {
        total = subtotal + shipping + tax;

        document.querySelector(".summary span").textContent = `$${total.toFixed(2)}`;
        document.querySelector(".checkout").innerHTML = `$${total.toFixed(2)} <span>Checkout</span>`;
        totalTaxElement.textContent = `Tax incl.: $${tax.toFixed(2)}`;
    }

    function updateProductPrice() {
        const cartItemsList = document.querySelectorAll(".food-card");
        subtotal = 0; 

        cartItemsList.forEach(item => {
            const priceElement = item.querySelector(".price");
            const quantityElement = item.querySelector(".quantity span");
            let unitPrice = parseFloat(priceElement.textContent.replace("$", "")); 
            let quantity = parseInt(quantityElement.textContent);

            const totalPrice = unitPrice * quantity;
            priceElement.textContent = `$${totalPrice.toFixed(2)}`;

            subtotal += totalPrice;
        });

        tax = 0.1 * subtotal; 
        updateTotal(); 
    }

    document.querySelectorAll(".quantity-btn").forEach((button) => {
        button.addEventListener("click", function (event) {
            const product = this.closest(".food-card");
            const quantityElement = product.querySelector(".quantity span");
            let currentQuantity = parseInt(quantityElement.textContent);

            if (event.target.classList.contains("fa-caret-up")) {
                currentQuantity++;
            } else if (event.target.classList.contains("fa-caret-down")) {
                currentQuantity = Math.max(1, currentQuantity - 1);
            }

            quantityElement.textContent = currentQuantity;
            updateProductPrice();
        });
    });


    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const product = this.closest(".food-card");
            const priceElement = product.querySelector(".price");
            const quantityElement = product.querySelector(".quantity span");
            let unitPrice = parseFloat(priceElement.textContent.replace("$", ""));
            let quantity = parseInt(quantityElement.textContent);

            subtotal -= unitPrice * quantity;
            cartCount--;
            if (cartBadge) cartBadge.textContent = cartCount;
            product.remove();
            tax = 0.1 * subtotal;
            updateTotal();
        });
    });

    checkoutButton.addEventListener("click", function () {
        let isValid = true;

        if (cardNameInput.value.trim() === "") {
            cardNameInput.style.border = "2px solid red";
            isValid = false;
        } else {
            cardNameInput.style.border = "";
        }

        const cardNumberPattern = /^\d{4} \d{4} \d{4} \d{4}$/;
        if (!cardNumberPattern.test(cardNumberInput.value)) {
            cardNumberInput.style.border = "";
            isValid = false;
        } else {
            cardNumberInput.style.border = "";
        }

        const expirationPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expirationPattern.test(expirationInput.value)) {
            expirationInput.style.border = "";
            isValid = false;
        } else {
            expirationInput.style.border = "";
        }

        const cvvPattern = /^\d{3}$/;
        if (!cvvPattern.test(cvvInput.value)) {
            cvvInput.style.border = "";
            isValid = false;
        } else {
            cvvInput.style.border = "";
        }

        if (isValid) {
            successModal.style.display = "flex";
            setTimeout(() => {
                successModal.style.display = "none";
                cartItems.innerHTML = ""; 
                cartCount = 0;
                subtotal = 0;
                shipping = 0;
                tax = 0;
                total = 0;
                updateTotal();

                if (cartBadge) {
                    cartBadge.textContent = "0";
                }
            }, 3000);
        }
    });

    cardNumberInput.addEventListener("input", function (event) {
        let input = event.target.value.replace(/\D/g, "").substring(0, 16);
        event.target.value = input.match(/.{1,4}/g)?.join(" ") || input;
    });

    expirationInput.addEventListener("input", function (e) {
        let input = e.target.value.replace(/\D/g, "").substring(0, 4);
        e.target.value = input.length >= 3 ? `${input.substring(0, 2)}/${input.substring(2)}` : input;
    });

    cvvInput.addEventListener("input", function (event) {
        event.target.value = event.target.value.replace(/\D/g, "").substring(0, 3);
    });
});

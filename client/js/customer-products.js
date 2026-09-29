// =========================================================
// THARUNYA FURNITURE - CUSTOMER PRODUCTS
// =========================================================

const API_URL = "http://localhost:4000/api/products";
const ORDER_API = "http://localhost:4000/api/orders";


// =========================================================
// CHECK LOGIN
// =========================================================

const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser"));

if (
    !loggedInUser ||
    loggedInUser.role !== "customer"
) {
    window.location.href = "login.html";
}


// =========================================================
// GET HTML ELEMENTS
// =========================================================

const customerName =
    document.getElementById("customerName");

const productGrid =
    document.getElementById("productGrid");

const productMessage =
    document.getElementById("productMessage");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const priceFilter =
    document.getElementById("priceFilter");

const sortFilter =
    document.getElementById("sortFilter");

const cartButton =
    document.getElementById("cartButton");

const cartCount =
    document.getElementById("cartCount");

const cartModal =
    document.getElementById("cartModal");

const closeCart =
    document.getElementById("closeCart");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const checkoutButton =
    document.getElementById("checkoutButton");

const logoutButton =
    document.getElementById("logoutButton");


// =========================================================
// CUSTOMER NAME
// =========================================================

if (customerName) {

    customerName.textContent =
        loggedInUser.name;

}


// =========================================================
// VARIABLES
// =========================================================

let products = [];

let cart =
    JSON.parse(
        localStorage.getItem("furnitureCart")
    ) || [];


// =========================================================
// LOAD PRODUCTS FROM MONGODB
// =========================================================

async function loadProducts() {

    try {

        productMessage.textContent =
            "Loading furniture...";

        productMessage.style.color =
            "#8b5e34";


        const response =
            await fetch(API_URL);


        console.log(
            "Products response status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch products"
            );

        }


        products =
            await response.json();


        console.log(
            "Products received:",
            products
        );


        productMessage.textContent =
            `${products.length} furniture products available`;


        displayProducts();

        updateCartCount();


    } catch (error) {

        console.error(
            "Product loading error:",
            error
        );


        productMessage.textContent =
            "Cannot connect to backend server. Make sure port 4000 is running.";


        productMessage.style.color =
            "#d9534f";

    }

}


// =========================================================
// DISPLAY PRODUCTS
// =========================================================

function displayProducts() {

    if (!productGrid) {

        console.error(
            "ERROR: productGrid element not found"
        );

        return;

    }


    let filteredProducts =
        [...products];


    // =====================================================
    // SEARCH
    // =====================================================

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    if (searchText) {

        filteredProducts =
            filteredProducts.filter(
                product =>

                    product.name
                        .toLowerCase()
                        .includes(searchText)

            );

    }


    // =====================================================
    // CATEGORY FILTER
    // =====================================================

    const category =
        categoryFilter.value;


    if (category !== "") {

        filteredProducts =
            filteredProducts.filter(
                product =>
                    product.category === category
            );

    }


    // =====================================================
    // PRICE FILTER
    // =====================================================

    const price =
        priceFilter.value;


    if (price === "below10000") {

        filteredProducts =
            filteredProducts.filter(
                product =>
                    Number(product.price) < 10000
            );

    }


    else if (price === "10000to25000") {

        filteredProducts =
            filteredProducts.filter(
                product =>
                    Number(product.price) >= 10000 &&
                    Number(product.price) <= 25000
            );

    }


    else if (price === "25000to50000") {

        filteredProducts =
            filteredProducts.filter(
                product =>
                    Number(product.price) >= 25000 &&
                    Number(product.price) <= 50000
            );

    }


    else if (price === "above50000") {

        filteredProducts =
            filteredProducts.filter(
                product =>
                    Number(product.price) > 50000
            );

    }


    // =====================================================
    // SORT
    // =====================================================

    const sort =
        sortFilter.value;


    if (sort === "newest") {

        filteredProducts.sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );

    }


    else if (sort === "oldest") {

        filteredProducts.sort(
            (a, b) =>
                new Date(a.createdAt) -
                new Date(b.createdAt)
        );

    }


    else if (sort === "low") {

        filteredProducts.sort(
            (a, b) =>
                Number(a.price) -
                Number(b.price)
        );

    }


    else if (sort === "high") {

        filteredProducts.sort(
            (a, b) =>
                Number(b.price) -
                Number(a.price)
        );

    }


    // =====================================================
    // CLEAR OLD PRODUCTS
    // =====================================================

    productGrid.innerHTML = "";


    // =====================================================
    // NO PRODUCTS
    // =====================================================

    if (filteredProducts.length === 0) {

        productGrid.innerHTML = `

            <div class="empty-card">

                <h2>
                    No Furniture Found
                </h2>

                <p>
                    Try changing your search or filters.
                </p>

            </div>

        `;

        return;

    }


    // =====================================================
    // CREATE PRODUCT CARDS
    // =====================================================

    filteredProducts.forEach(
        product => {


            const card =
                document.createElement("div");


            card.className =
                "customer-product-card";


            const available =
                Number(product.quantity) > 0;


            // =================================================
            // IMAGE PATH
            // =================================================

            let imagePath =
                product.image || "";


            if (
                imagePath.startsWith("http://") ||
                imagePath.startsWith("https://")
            ) {

                // Keep URL as it is

            }

            else {

                if (
                    !imagePath.startsWith("/")
                ) {

                    imagePath =
                        "/" + imagePath;

                }

            }


            // =================================================
            // PRODUCT CARD HTML
            // =================================================

            card.innerHTML = `

                <div class="customer-product-image-area">

                    <img
                        src="${imagePath}"
                        alt="${product.name}"
                        class="customer-product-image"

                        onerror="
                            this.onerror=null;
                            this.src='/images/product1.jpg';
                        "
                    >


                    <span class="product-badge">

                        ${product.category}

                    </span>

                </div>



                <div class="customer-product-content">


                    <p class="product-category">

                        ${product.category}

                    </p>


                    <h2>

                        ${product.name}

                    </h2>


                    <p class="customer-product-price">

                        ₹${Number(product.price)
                            .toLocaleString("en-IN")}

                    </p>


                    <p class="${
                        available
                            ? "availability available"
                            : "availability unavailable"
                    }">

                        ${
                            available
                                ? `✓ Available (${product.quantity} left)`
                                : "✕ Out of Stock"
                        }

                    </p>



                    <!-- QUANTITY -->

                    <div class="quantity-area">

                        <label>
                            Quantity
                        </label>


                        <div class="quantity-control">


                            <button
                                class="quantity-minus"

                                ${
                                    !available
                                        ? "disabled"
                                        : ""
                                }

                                onclick="
                                    changeQuantity(
                                        '${product._id}',
                                        -1
                                    )
                                "
                            >
                                −
                            </button>



                            <input
                                type="number"

                                id="qty-${product._id}"

                                value="1"

                                min="1"

                                max="${product.quantity}"

                                ${
                                    !available
                                        ? "disabled"
                                        : ""
                                }
                            >



                            <button
                                class="quantity-plus"

                                ${
                                    !available
                                        ? "disabled"
                                        : ""
                                }

                                onclick="
                                    changeQuantity(
                                        '${product._id}',
                                        1
                                    )
                                "
                            >
                                +
                            </button>


                        </div>

                    </div>



                    <!-- BUTTONS -->

                    <div class="customer-product-actions">


                        <button
                            class="add-cart-button"

                            ${
                                !available
                                    ? "disabled"
                                    : ""
                            }

                            onclick="
                                addToCart(
                                    '${product._id}'
                                )
                            "
                        >
                            🛒 Add to Cart
                        </button>



                        <button
                            class="buy-now-button"

                            ${
                                !available
                                    ? "disabled"
                                    : ""
                            }

                            onclick="
                                buyNow(
                                    '${product._id}'
                                )
                            "
                        >
                            Buy Now
                        </button>


                    </div>


                </div>

            `;


            productGrid.appendChild(card);

        }
    );

}


// =========================================================
// CHANGE QUANTITY
// =========================================================

function changeQuantity(
    productId,
    change
) {

    const input =
        document.getElementById(
            `qty-${productId}`
        );


    if (!input) {
        return;
    }


    let quantity =
        Number(input.value) || 1;


    const product =
        products.find(
            item =>
                item._id === productId
        );


    if (!product) {
        return;
    }


    quantity += change;


    if (quantity < 1) {

        quantity = 1;

    }


    if (
        quantity >
        Number(product.quantity)
    ) {

        quantity =
            Number(product.quantity);

    }


    input.value =
        quantity;

}


// =========================================================
// GET SELECTED QUANTITY
// =========================================================

function getQuantity(productId) {

    const input =
        document.getElementById(
            `qty-${productId}`
        );


    if (!input) {
        return 1;
    }


    let quantity =
        Number(input.value);


    if (
        !quantity ||
        quantity < 1
    ) {

        quantity = 1;

    }


    return quantity;

}


// =========================================================
// ADD TO CART
// =========================================================

function addToCart(productId) {

    const product =
        products.find(
            item =>
                item._id === productId
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;

    }


    if (
        Number(product.quantity) <= 0
    ) {

        alert(
            "This product is out of stock."
        );

        return;

    }


    const quantity =
        getQuantity(productId);


    if (
        quantity >
        Number(product.quantity)
    ) {

        alert(
            "Requested quantity is not available."
        );

        return;

    }


    const existingItem =
        cart.find(
            item =>
                item.productId === productId
        );


    if (existingItem) {

        existingItem.quantity +=
            quantity;


        if (
            existingItem.quantity >
            Number(product.quantity)
        ) {

            existingItem.quantity =
                Number(product.quantity);

        }

    }

    else {

        cart.push({

            productId:
                product._id,

            name:
                product.name,

            price:
                Number(product.price),

            quantity:
                quantity,

            image:
                product.image

        });

    }


    saveCart();


    alert(
        `${product.name} added to cart.`
    );

}


// =========================================================
// BUY NOW
// =========================================================

function buyNow(productId) {

    const product =
        products.find(
            item =>
                item._id === productId
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;

    }


    if (
        Number(product.quantity) <= 0
    ) {

        alert(
            "This product is out of stock."
        );

        return;

    }


    const quantity =
        getQuantity(productId);


    if (
        quantity >
        Number(product.quantity)
    ) {

        alert(
            "Requested quantity is not available."
        );

        return;

    }


    const orderProducts = [

        {

            productId:
                product._id,

            quantity:
                quantity

        }

    ];


    placeOrder(
        orderProducts
    );

}


// =========================================================
// SAVE CART
// =========================================================

function saveCart() {

    localStorage.setItem(
        "furnitureCart",
        JSON.stringify(cart)
    );


    updateCartCount();

    displayCart();

}


// =========================================================
// CART COUNT
// =========================================================

function updateCartCount() {

    const count =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.quantity),
            0
        );


    if (cartCount) {

        cartCount.textContent =
            count;

    }

}


// =========================================================
// OPEN CART
// =========================================================

if (cartButton) {

    cartButton.addEventListener(
        "click",
        function () {

            displayCart();

            cartModal.style.display =
                "flex";

        }
    );

}


// =========================================================
// CLOSE CART
// =========================================================

if (closeCart) {

    closeCart.addEventListener(
        "click",
        function () {

            cartModal.style.display =
                "none";

        }
    );

}


// =========================================================
// CLOSE CART WHEN CLICKING OUTSIDE
// =========================================================

if (cartModal) {

    cartModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                cartModal
            ) {

                cartModal.style.display =
                    "none";

            }

        }
    );

}


// =========================================================
// DISPLAY CART
// =========================================================

function displayCart() {

    if (!cartItems) {
        return;
    }


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add some beautiful furniture!
                </p>

            </div>

        `;


        cartTotal.textContent =
            "₹0";


        return;

    }


    let total = 0;


    cart.forEach(
        (item, index) => {


            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            total += itemTotal;


            let imagePath =
                item.image || "";


            if (
                !imagePath.startsWith("http") &&
                !imagePath.startsWith("/")
            ) {

                imagePath =
                    "/" + imagePath;

            }


            const cartItem =
                document.createElement("div");


            cartItem.className =
                "cart-item";


            cartItem.innerHTML = `

                <img
                    src="${imagePath}"
                    alt="${item.name}"

                    onerror="
                        this.onerror=null;
                        this.src='/images/product1.jpg';
                    "
                >


                <div class="cart-item-details">

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ₹${Number(item.price)
                            .toLocaleString("en-IN")}
                    </p>

                    <p>
                        Quantity:
                        ${item.quantity}
                    </p>

                </div>


                <div class="cart-item-actions">

                    <strong>
                        ₹${itemTotal
                            .toLocaleString("en-IN")}
                    </strong>


                    <button
                        onclick="
                            removeFromCart(${index})
                        "
                    >
                        Remove
                    </button>

                </div>

            `;


            cartItems.appendChild(
                cartItem
            );

        }
    );


    cartTotal.textContent =
        `₹${total.toLocaleString("en-IN")}`;

}


// =========================================================
// REMOVE FROM CART
// =========================================================

function removeFromCart(index) {

    cart.splice(
        index,
        1
    );


    saveCart();

}


// =========================================================
// CHECKOUT CART
// =========================================================

if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        async function () {

            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            const orderProducts =
                cart.map(
                    item => ({

                        productId:
                            item.productId,

                        quantity:
                            item.quantity

                    })
                );


            await placeOrder(
                orderProducts,
                true
            );

        }
    );

}


// =========================================================
// PLACE ORDER
// =========================================================

async function placeOrder(
    orderProducts,
    clearCart = false
) {

    try {

        const response =
            await fetch(
                ORDER_API,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        customerId:
                            loggedInUser._id,

                        products:
                            orderProducts

                    })

                }
            );


        const data =
            await response.json();


        console.log(
            "Order response:",
            data
        );


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to place order."
            );

            return;

        }


        alert(
            "Order placed successfully!"
        );


        if (clearCart) {

            cart = [];

            saveCart();

        }


        if (cartModal) {

            cartModal.style.display =
                "none";

        }


        // Reload products so quantity updates
        await loadProducts();


    } catch (error) {

        console.error(
            "Order error:",
            error
        );


        alert(
            "Cannot connect to backend server."
        );

    }

}


// =========================================================
// FILTER EVENTS
// =========================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        displayProducts
    );

}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        displayProducts
    );

}


if (priceFilter) {

    priceFilter.addEventListener(
        "change",
        displayProducts
    );

}


if (sortFilter) {

    sortFilter.addEventListener(
        "change",
        displayProducts
    );

}


// =========================================================
// LOGOUT
// =========================================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "loggedInUser"
            );

            window.location.href =
                "login.html";

        }
    );

}


// =========================================================
// INITIAL LOAD
// =========================================================

displayCart();

loadProducts();
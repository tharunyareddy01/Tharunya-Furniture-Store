
// ========================================
// ADMIN PRODUCT MANAGEMENT
// ========================================

const API_URL =
    "http://localhost:4000/api/products";


// ========================================
// CHECK ADMIN LOGIN
// ========================================

const loggedInUser =
    JSON.parse(
        localStorage.getItem("loggedInUser")
    );


if (
    !loggedInUser ||
    loggedInUser.role !== "admin"
) {
    window.location.href = "login.html";
}


if (loggedInUser) {

    document.getElementById(
        "adminName"
    ).textContent = loggedInUser.name;

}


// ========================================
// ELEMENTS
// ========================================

const productForm =
    document.getElementById("productForm");

const productList =
    document.getElementById("productList");

const productMessage =
    document.getElementById("productMessage");


// ========================================
// LOAD PRODUCTS
// ========================================

async function loadProducts() {

    try {

        const response =
            await fetch(API_URL);

        const products =
            await response.json();

        displayProducts(products);

    } catch (error) {

        console.error(error);

        productList.innerHTML = `
            <p class="error-text">
                Cannot connect to server.
                Make sure port 4000 is running.
            </p>
        `;

    }

}


// ========================================
// DISPLAY PRODUCTS
// ========================================

function displayProducts(products) {

    const search =
        document.getElementById(
            "searchProduct"
        ).value
        .toLowerCase()
        .trim();


    const category =
        document.getElementById(
            "filterCategory"
        ).value;


    const availability =
        document.getElementById(
            "availabilityFilter"
        ).value;


    const filteredProducts =
        products.filter(function (product) {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                category === "all" ||
                product.category === category;


            let matchesAvailability = true;


            if (
                availability === "available"
            ) {

                matchesAvailability =
                    product.quantity > 0;

            }


            if (
                availability === "out"
            ) {

                matchesAvailability =
                    product.quantity === 0;

            }


            return (
                matchesSearch &&
                matchesCategory &&
                matchesAvailability
            );

        });


    if (filteredProducts.length === 0) {

        productList.innerHTML = `
            <div class="empty-card">
                <h3>No Products Found</h3>
                <p>
                    Try changing your search or filters.
                </p>
            </div>
        `;

        return;
    }


    productList.innerHTML =
        filteredProducts
            .map(function (product) {

                const availabilityText =
                    product.quantity > 0
                        ? "Available"
                        : "Out of Stock";


                const availabilityClass =
                    product.quantity > 0
                        ? "available"
                        : "out-of-stock";


                return `

                    <div class="admin-product-card">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            class="admin-product-image"
                        >

                        <div class="admin-product-content">

                            <span class="product-category">
                                ${product.category}
                            </span>

                            <h3>
                                ${product.name}
                            </h3>

                            <p>
                                Product ID:
                                <strong>
                                    ${product.productId}
                                </strong>
                            </p>

                            <p>
                                Price:
                                <strong>
                                    ₹${Number(
                                        product.price
                                    ).toLocaleString("en-IN")}
                                </strong>
                            </p>

                            <p>
                                Quantity:
                                <strong>
                                    ${product.quantity}
                                </strong>
                            </p>

                            <span
                                class="availability ${availabilityClass}"
                            >
                                ${availabilityText}
                            </span>

                            <div class="product-actions">

                                <button
                                    class="edit-button"
                                    onclick="editProduct(
                                        '${product._id}'
                                    )"
                                >
                                    Edit
                                </button>

                                <button
                                    class="delete-button"
                                    onclick="deleteProduct(
                                        '${product._id}'
                                    )"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>

                `;

            })
            .join("");

}


// ========================================
// ADD PRODUCT
// ========================================

productForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const editId =
            document.getElementById(
                "editProductId"
            ).value;


        const productData = {

            productId:
                document.getElementById(
                    "productId"
                ).value.trim(),

            name:
                document.getElementById(
                    "productName"
                ).value.trim(),

            category:
                document.getElementById(
                    "category"
                ).value,

            price:
                Number(
                    document.getElementById(
                        "price"
                    ).value
                ),

            quantity:
                Number(
                    document.getElementById(
                        "quantity"
                    ).value
                ),

            image:
                document.getElementById(
                    "image"
                ).value.trim()

        };


        const isEditing =
            editId !== "";


        try {

            const response =
                await fetch(
                    isEditing
                        ? `${API_URL}/${editId}`
                        : API_URL,
                    {

                        method:
                            isEditing
                                ? "PUT"
                                : "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                productData
                            )

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                productMessage.textContent =
                    data.message ||
                    "Operation failed.";

                productMessage.style.color =
                    "#d9534f";

                return;
            }


            productMessage.textContent =
                isEditing
                    ? "Product updated successfully!"
                    : "Product added successfully!";

            productMessage.style.color =
                "#3d7a4a";


            resetForm();

            loadProducts();


        } catch (error) {

            console.error(error);

            productMessage.textContent =
                "Cannot connect to server.";

            productMessage.style.color =
                "#d9534f";

        }

    }
);


// ========================================
// EDIT PRODUCT
// ========================================

async function editProduct(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        const product =
            await response.json();


        document.getElementById(
            "editProductId"
        ).value = product._id;


        document.getElementById(
            "productId"
        ).value = product.productId;


        document.getElementById(
            "productName"
        ).value = product.name;


        document.getElementById(
            "category"
        ).value = product.category;


        document.getElementById(
            "price"
        ).value = product.price;


        document.getElementById(
            "quantity"
        ).value = product.quantity;


        document.getElementById(
            "image"
        ).value = product.image;


        document.getElementById(
            "saveProductButton"
        ).textContent =
            "Update Product";


        document.getElementById(
            "cancelEditButton"
        ).style.display =
            "inline-block";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(error);

    }

}


// ========================================
// DELETE PRODUCT
// ========================================

async function deleteProduct(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmation) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Delete failed."
            );

            return;
        }


        alert(
            "Product deleted successfully."
        );


        loadProducts();


    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to server."
        );

    }

}


// ========================================
// CANCEL EDIT
// ========================================

function cancelEdit() {

    resetForm();

}


// ========================================
// RESET FORM
// ========================================

function resetForm() {

    productForm.reset();


    document.getElementById(
        "editProductId"
    ).value = "";


    document.getElementById(
        "saveProductButton"
    ).textContent =
        "Add Product";


    document.getElementById(
        "cancelEditButton"
    ).style.display =
        "none";

}


// ========================================
// FILTER EVENTS
// ========================================

document.getElementById(
    "searchProduct"
).addEventListener(
    "input",
    loadProducts
);


document.getElementById(
    "filterCategory"
).addEventListener(
    "change",
    loadProducts
);


document.getElementById(
    "availabilityFilter"
).addEventListener(
    "change",
    loadProducts
);


// ========================================
// LOGOUT
// ========================================

function logout() {

    localStorage.removeItem(
        "loggedInUser"
    );

    window.location.href =
        "login.html";

}


// ========================================
// INITIAL LOAD
// ========================================

loadProducts();


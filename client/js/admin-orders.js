
// ========================================
// ADMIN ORDER MANAGEMENT
// ========================================

const ORDER_API =
    "http://localhost:4000/api/orders";


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

const ordersList =
    document.getElementById("ordersList");


// ========================================
// LOAD ORDERS
// ========================================

async function loadOrders() {

    try {

        const response =
            await fetch(ORDER_API);

        const orders =
            await response.json();

        displayOrders(orders);

    } catch (error) {

        console.error(
            "Orders loading error:",
            error
        );

        ordersList.innerHTML = `
            <p class="error-text">
                Cannot connect to server.
                Make sure port 4000 is running.
            </p>
        `;

    }

}


// ========================================
// DISPLAY ORDERS
// ========================================

function displayOrders(orders) {

    const status =
        document.getElementById(
            "statusFilter"
        ).value;


    const search =
        document.getElementById(
            "orderSearch"
        ).value
        .toLowerCase()
        .trim();


    const filteredOrders =
        orders.filter(function (order) {

            const matchesStatus =
                status === "all" ||
                order.status === status;


            const matchesSearch =
                order.orderId
                    .toLowerCase()
                    .includes(search);


            return (
                matchesStatus &&
                matchesSearch
            );

        });


    if (filteredOrders.length === 0) {

        ordersList.innerHTML = `
            <div class="empty-card">

                <h3>
                    No Orders Found
                </h3>

                <p>
                    There are no orders matching
                    your filter.
                </p>

            </div>
        `;

        return;
    }


    ordersList.innerHTML =
        filteredOrders
            .map(function (order) {

                const customer =
                    order.customerId || {};


                const orderDate =
                    new Date(
                        order.orderDate
                    ).toLocaleString(
                        "en-IN"
                    );


                const productsHTML =
                    order.products
                        .map(function (product) {

                            return `
                                <div
                                    class="order-product-row"
                                >

                                    <img
                                        src="${product.image}"
                                        alt="${product.name}"
                                    >

                                    <div>

                                        <strong>
                                            ${product.name}
                                        </strong>

                                        <p>
                                            ₹${Number(
                                                product.price
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                            ×
                                            ${product.quantity}
                                        </p>

                                    </div>

                                </div>
                            `;

                        })
                        .join("");


                return `

                    <div class="admin-order-card">

                        <div class="order-header">

                            <div>

                                <span>
                                    ORDER
                                </span>

                                <h3>
                                    ${order.orderId}
                                </h3>

                            </div>

                            <span
                                class="order-status"
                            >
                                ${order.status}
                            </span>

                        </div>


                        <div class="order-customer">

                            <h4>
                                Customer Details
                            </h4>

                            <p>
                                Name:
                                <strong>
                                    ${customer.name || "N/A"}
                                </strong>
                            </p>

                            <p>
                                Email:
                                ${customer.email || "N/A"}
                            </p>

                            <p>
                                Customer Type:
                                ${customer.customerType || "N/A"}
                            </p>

                            <p>
                                Order Date:
                                ${orderDate}
                            </p>

                        </div>


                        <div class="order-products">

                            <h4>
                                Products
                            </h4>

                            ${productsHTML}

                        </div>


                        <div class="order-amount">

                            <div>
                                Original Amount:
                            </div>

                            <strong>
                                ₹${Number(
                                    order.originalAmount
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                            <div>
                                Discount:
                            </div>

                            <strong>
                                - ₹${Number(
                                    order.discount
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                            <div>
                                Final Amount:
                            </div>

                            <strong>
                                ₹${Number(
                                    order.totalAmount
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                        </div>


                        <div class="status-update">

                            <label>
                                Update Status
                            </label>

                            <select
                                onchange="
                                    updateOrderStatus(
                                        '${order._id}',
                                        this.value
                                    )
                                "
                            >

                                <option
                                    value="Pending"
                                    ${order.status === "Pending"
                                        ? "selected"
                                        : ""}
                                >
                                    Pending
                                </option>

                                <option
                                    value="Processing"
                                    ${order.status === "Processing"
                                        ? "selected"
                                        : ""}
                                >
                                    Processing
                                </option>

                                <option
                                    value="Dispatched"
                                    ${order.status === "Dispatched"
                                        ? "selected"
                                        : ""}
                                >
                                    Dispatched
                                </option>

                                <option
                                    value="On the Way"
                                    ${order.status === "On the Way"
                                        ? "selected"
                                        : ""}
                                >
                                    On the Way
                                </option>

                                <option
                                    value="Reached"
                                    ${order.status === "Reached"
                                        ? "selected"
                                        : ""}
                                >
                                    Reached
                                </option>

                                <option
                                    value="Delivered"
                                    ${order.status === "Delivered"
                                        ? "selected"
                                        : ""}
                                >
                                    Delivered
                                </option>

                                <option
                                    value="Old Order"
                                    ${order.status === "Old Order"
                                        ? "selected"
                                        : ""}
                                >
                                    Old Order
                                </option>

                            </select>

                        </div>

                    </div>

                `;

            })
            .join("");

}


// ========================================
// UPDATE ORDER STATUS
// ========================================

async function updateOrderStatus(
    orderId,
    status
) {

    try {

        const response =
            await fetch(
                `${ORDER_API}/${orderId}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to update status."
            );

            return;
        }


        loadOrders();


    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to server."
        );

    }

}


// ========================================
// FILTER EVENTS
// ========================================

document.getElementById(
    "statusFilter"
).addEventListener(
    "change",
    loadOrders
);


document.getElementById(
    "orderSearch"
).addEventListener(
    "input",
    loadOrders
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

loadOrders();


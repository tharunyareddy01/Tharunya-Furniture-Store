
const ORDER_API =
    "http://localhost:4000/api/orders";


// ==============================
// LOGIN CHECK
// ==============================

const loggedInUser =
    JSON.parse(
        localStorage.getItem("loggedInUser")
    );


if (
    !loggedInUser ||
    loggedInUser.role !== "customer"
) {
    window.location.href = "login.html";
}


// ==============================
// ELEMENTS
// ==============================

const customerName =
    document.getElementById("customerName");

const ordersList =
    document.getElementById(
        "customerOrdersList"
    );

const ordersMessage =
    document.getElementById(
        "ordersMessage"
    );

const totalOrders =
    document.getElementById(
        "totalOrders"
    );

const activeOrders =
    document.getElementById(
        "activeOrders"
    );

const totalSpent =
    document.getElementById(
        "totalSpent"
    );

const statusFilter =
    document.getElementById(
        "statusFilter"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


// ==============================
// CUSTOMER NAME
// ==============================

customerName.textContent =
    loggedInUser.name;


// ==============================
// ORDER DATA
// ==============================

let orders = [];


// ==============================
// LOAD ORDERS
// ==============================

async function loadOrders() {

    try {

        const response =
            await fetch(
                `${ORDER_API}/customer/${loggedInUser._id}`
            );


        if (!response.ok) {
            throw new Error(
                "Failed to fetch orders"
            );
        }


        orders =
            await response.json();


        updateSummary();

        displayOrders();

    } catch (error) {

        console.error(error);

        ordersMessage.textContent =
            "Cannot connect to server. Make sure backend is running on port 4000.";

        ordersMessage.style.color =
            "#d9534f";
    }
}


// ==============================
// UPDATE SUMMARY
// ==============================

function updateSummary() {

    totalOrders.textContent =
        orders.length;


    const activeStatuses = [
        "Pending",
        "Processing",
        "Dispatched",
        "On the Way",
        "Reached"
    ];


    const active =
        orders.filter(
            order =>
                activeStatuses.includes(
                    order.status
                )
        );


    activeOrders.textContent =
        active.length;


    const spent =
        orders.reduce(
            (sum, order) =>
                sum +
                Number(order.totalAmount || 0),
            0
        );


    totalSpent.textContent =
        `₹${spent.toLocaleString("en-IN")}`;
}


// ==============================
// DISPLAY ORDERS
// ==============================

function displayOrders() {

    const selectedStatus =
        statusFilter.value;


    let filteredOrders =
        [...orders];


    if (
        selectedStatus !== "all"
    ) {

        filteredOrders =
            filteredOrders.filter(
                order =>
                    order.status ===
                    selectedStatus
            );
    }


    ordersList.innerHTML = "";


    if (
        filteredOrders.length === 0
    ) {

        ordersList.innerHTML = `

            <div class="empty-card">

                <div class="empty-icon">
                    📦
                </div>

                <h2>
                    No Orders Found
                </h2>

                <p>
                    You haven't placed any orders matching this filter.
                </p>

                <a
                    href="customer-products.html"
                    class="shop-more-button">

                    Start Shopping

                </a>

            </div>

        `;

        ordersMessage.textContent =
            "No orders to display.";

        return;
    }


    ordersMessage.textContent =
        `${filteredOrders.length} order(s) found`;


    filteredOrders.forEach(
        order => {

            const orderCard =
                document.createElement("div");

            orderCard.className =
                "customer-order-card";


            const date =
                new Date(
                    order.orderDate
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            let statusClass =
                "status-pending";


            if (
                order.status ===
                "Delivered"
            ) {

                statusClass =
                    "status-delivered";

            } else if (
                order.status ===
                "Old Order"
            ) {

                statusClass =
                    "status-old";

            } else if (
                order.status ===
                "Processing"
            ) {

                statusClass =
                    "status-processing";

            } else if (
                order.status ===
                "Dispatched" ||
                order.status ===
                "On the Way"
            ) {

                statusClass =
                    "status-shipping";

            } else if (
                order.status ===
                "Reached"
            ) {

                statusClass =
                    "status-reached";
            }


            const productsHTML =
                order.products
                    .map(
                        product => `

                        <div class="customer-order-product">

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                                onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80'"
                            >

                            <div>

                                <h3>
                                    ${product.name}
                                </h3>

                                <p>
                                    Category:
                                    ${product.productId}
                                </p>

                                <p>
                                    Quantity:
                                    ${product.quantity}
                                </p>

                            </div>

                            <strong>
                                ₹${(
                                    product.price *
                                    product.quantity
                                ).toLocaleString("en-IN")}
                            </strong>

                        </div>

                    `
                    )
                    .join("");


            orderCard.innerHTML = `

                <div class="customer-order-header">

                    <div>

                        <span class="order-label">
                            ORDER ID
                        </span>

                        <h2>
                            ${order.orderId}
                        </h2>

                        <p>
                            Ordered on ${date}
                        </p>

                    </div>


                    <div
                        class="customer-order-status ${statusClass}">

                        ${order.status}

                    </div>

                </div>


                <div class="customer-order-products">

                    ${productsHTML}

                </div>


                <div class="customer-order-footer">

                    <div class="order-price-details">

                        <div>
                            <span>
                                Original Amount
                            </span>

                            <strong>
                                ₹${Number(
                                    order.originalAmount
                                ).toLocaleString("en-IN")}
                            </strong>
                        </div>


                        <div class="discount-row">

                            <span>
                                Discount
                            </span>

                            <strong>
                                - ₹${Number(
                                    order.discount || 0
                                ).toLocaleString("en-IN")}
                            </strong>

                        </div>


                        <div class="final-price-row">

                            <span>
                                Final Amount
                            </span>

                            <strong>
                                ₹${Number(
                                    order.totalAmount
                                ).toLocaleString("en-IN")}
                            </strong>

                        </div>

                    </div>


                    <div class="customer-order-buttons">

                        <a
                            href="customer-tracking.html?orderId=${order._id}"
                            class="order-action-button">

                            🚚 Track Order

                        </a>


                        <a
                            href="customer-billing.html?orderId=${order._id}"
                            class="order-action-button secondary">

                            🧾 View Bill

                        </a>

                    </div>

                </div>

            `;


            ordersList.appendChild(
                orderCard
            );
        }
    );
}


// ==============================
// FILTER
// ==============================

statusFilter.addEventListener(
    "change",
    displayOrders
);


// ==============================
// LOGOUT
// ==============================

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


// ==============================
// START
// ==============================

loadOrders();


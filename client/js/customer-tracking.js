
const ORDER_API =
    "http://localhost:4000/api/orders";


/* ==============================
   LOGIN CHECK
============================== */

const loggedInUser =
    JSON.parse(
        localStorage.getItem("loggedInUser")
    );


if (
    !loggedInUser ||
    loggedInUser.role !== "customer"
) {
    window.location.href =
        "login.html";
}


/* ==============================
   ELEMENTS
============================== */

const customerName =
    document.getElementById(
        "customerName"
    );

const orderSelector =
    document.getElementById(
        "orderSelector"
    );

const refreshButton =
    document.getElementById(
        "refreshButton"
    );

const trackingMessage =
    document.getElementById(
        "trackingMessage"
    );

const trackingContent =
    document.getElementById(
        "trackingContent"
    );

const noTrackingOrders =
    document.getElementById(
        "noTrackingOrders"
    );

const trackingOrderId =
    document.getElementById(
        "trackingOrderId"
    );

const trackingOrderDate =
    document.getElementById(
        "trackingOrderDate"
    );

const currentStatus =
    document.getElementById(
        "currentStatus"
    );

const trackingProducts =
    document.getElementById(
        "trackingProducts"
    );

const trackingOriginal =
    document.getElementById(
        "trackingOriginal"
    );

const trackingDiscount =
    document.getElementById(
        "trackingDiscount"
    );

const trackingTotal =
    document.getElementById(
        "trackingTotal"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


customerName.textContent =
    loggedInUser.name;


/* ==============================
   STATUS ORDER
============================== */

const statusSteps = [
    "Pending",
    "Processing",
    "Dispatched",
    "On the Way",
    "Reached",
    "Delivered"
];


let orders = [];


/* ==============================
   LOAD ORDERS
============================== */

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


        orderSelector.innerHTML = `
            <option value="">
                Select an order
            </option>
        `;


        if (orders.length === 0) {

            trackingMessage.style.display =
                "none";

            noTrackingOrders.style.display =
                "block";

            return;
        }


        noTrackingOrders.style.display =
            "none";


        orders.forEach(
            order => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    order._id;

                option.textContent =
                    `${order.orderId} - ${order.status}`;

                orderSelector.appendChild(
                    option
                );
            }
        );


        trackingMessage.textContent =
            "Select an order to view its delivery status.";


        // If orderId exists in URL
        const params =
            new URLSearchParams(
                window.location.search
            );

        const orderId =
            params.get("orderId");


        if (orderId) {

            const matchingOrder =
                orders.find(
                    order =>
                        order._id === orderId
                );


            if (matchingOrder) {

                orderSelector.value =
                    orderId;

                displayTracking(
                    matchingOrder
                );

                return;
            }
        }


        // Otherwise show latest order
        if (orders.length > 0) {

            orderSelector.value =
                orders[0]._id;

            displayTracking(
                orders[0]
            );
        }


    } catch (error) {

        console.error(error);

        trackingMessage.textContent =
            "Cannot connect to server. Make sure backend is running on port 4000.";

        trackingMessage.style.color =
            "#d9534f";
    }
}


/* ==============================
   DISPLAY TRACKING
============================== */

function displayTracking(order) {

    if (!order) {
        return;
    }


    trackingContent.style.display =
        "block";

    trackingMessage.textContent =
        "";


    trackingOrderId.textContent =
        order.orderId;


    trackingOrderDate.textContent =
        `Ordered on ${new Date(
            order.orderDate
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        )}`;


    currentStatus.textContent =
        order.status;


    updateProgress(
        order.status
    );


    displayTrackingProducts(
        order.products
    );


    trackingOriginal.textContent =
        `₹${Number(
            order.originalAmount || 0
        ).toLocaleString("en-IN")}`;


    trackingDiscount.textContent =
        `- ₹${Number(
            order.discount || 0
        ).toLocaleString("en-IN")}`;


    trackingTotal.textContent =
        `₹${Number(
            order.totalAmount || 0
        ).toLocaleString("en-IN")}`;
}


/* ==============================
   UPDATE PROGRESS
============================== */

function updateProgress(status) {

    const steps =
        document.querySelectorAll(
            ".tracking-step"
        );


    const line =
        document.getElementById(
            "trackingLine"
        );


    let currentIndex =
        statusSteps.indexOf(status);


    if (status === "Old Order") {

        currentIndex =
            statusSteps.length - 1;
    }


    steps.forEach(
        (step, index) => {

            step.classList.remove(
                "completed",
                "current",
                "pending"
            );


            const circle =
                step.querySelector(
                    ".tracking-circle"
                );


            if (
                index < currentIndex
            ) {

                step.classList.add(
                    "completed"
                );

                circle.textContent =
                    "✓";

            } else if (
                index === currentIndex
            ) {

                step.classList.add(
                    "current"
                );

                circle.textContent =
                    index + 1;

            } else {

                step.classList.add(
                    "pending"
                );

                circle.textContent =
                    index + 1;
            }
        }
    );


    if (currentIndex <= 0) {

        line.style.width =
            "0%";

    } else {

        const percentage =
            (
                currentIndex /
                (statusSteps.length - 1)
            ) * 100;

        line.style.width =
            `${percentage}%`;
    }


    if (status === "Delivered") {

        line.style.width =
            "100%";
    }


    if (status === "Old Order") {

        currentStatus.textContent =
            "Old Order";
    }
}


/* ==============================
   PRODUCTS
============================== */

function displayTrackingProducts(
    products
) {

    trackingProducts.innerHTML =
        "";


    if (
        !products ||
        products.length === 0
    ) {

        trackingProducts.innerHTML = `
            <p>
                No product details available.
            </p>
        `;

        return;
    }


    products.forEach(
        product => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "tracking-product";


            const total =
                product.price *
                product.quantity;


            item.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80'"
                >

                <div class="tracking-product-info">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        Price:
                        ₹${Number(
                            product.price
                        ).toLocaleString("en-IN")}
                    </p>

                    <p>
                        Quantity:
                        ${product.quantity}
                    </p>

                </div>

                <strong>
                    ₹${Number(
                        total
                    ).toLocaleString("en-IN")}
                </strong>

            `;


            trackingProducts.appendChild(
                item
            );
        }
    );
}


/* ==============================
   SELECT ORDER
============================== */

orderSelector.addEventListener(
    "change",
    function () {

        const selectedId =
            this.value;


        const selectedOrder =
            orders.find(
                order =>
                    order._id ===
                    selectedId
            );


        if (selectedOrder) {

            displayTracking(
                selectedOrder
            );
        }
    }
);


/* ==============================
   REFRESH
============================== */

refreshButton.addEventListener(
    "click",
    async function () {

        refreshButton.disabled =
            true;

        refreshButton.textContent =
            "🔄 Refreshing...";


        const selectedId =
            orderSelector.value;


        await loadOrders();


        if (selectedId) {

            const updatedOrder =
                orders.find(
                    order =>
                        order._id ===
                        selectedId
                );


            if (updatedOrder) {

                orderSelector.value =
                    selectedId;

                displayTracking(
                    updatedOrder
                );
            }
        }


        refreshButton.disabled =
            false;

        refreshButton.textContent =
            "🔄 Refresh Status";
    }
);


/* ==============================
   LOGOUT
============================== */

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


/* ==============================
   START
============================== */

loadOrders();


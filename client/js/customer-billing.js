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
    window.location.href =
        "login.html";
}


// ==============================
// ELEMENTS
// ==============================

const customerName =
    document.getElementById(
        "customerName"
    );

const orderSelector =
    document.getElementById(
        "orderSelector"
    );

const billingMessage =
    document.getElementById(
        "billingMessage"
    );

const invoice =
    document.getElementById(
        "invoice"
    );

const noBillingOrders =
    document.getElementById(
        "noBillingOrders"
    );

const printBillButton =
    document.getElementById(
        "printBillButton"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


// Invoice elements
const invoiceOrderId =
    document.getElementById(
        "invoiceOrderId"
    );

const invoiceDate =
    document.getElementById(
        "invoiceDate"
    );

const invoiceCustomerName =
    document.getElementById(
        "invoiceCustomerName"
    );

const invoiceCustomerEmail =
    document.getElementById(
        "invoiceCustomerEmail"
    );

const invoiceStatus =
    document.getElementById(
        "invoiceStatus"
    );

const invoiceProducts =
    document.getElementById(
        "invoiceProducts"
    );

const invoiceOriginal =
    document.getElementById(
        "invoiceOriginal"
    );

const invoiceDiscount =
    document.getElementById(
        "invoiceDiscount"
    );

const invoiceTotal =
    document.getElementById(
        "invoiceTotal"
    );


customerName.textContent =
    loggedInUser.name;


let orders = [];


// ==============================
// LOAD CUSTOMER ORDERS
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


        orderSelector.innerHTML = `
            <option value="">
                Select an order
            </option>
        `;


        if (orders.length === 0) {

            billingMessage.style.display =
                "none";

            noBillingOrders.style.display =
                "block";

            return;
        }


        noBillingOrders.style.display =
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


        billingMessage.textContent =
            "Select an order to view its invoice.";


        const params =
            new URLSearchParams(
                window.location.search
            );


        const orderId =
            params.get("orderId");


        if (orderId) {

            const selectedOrder =
                orders.find(
                    order =>
                        order._id === orderId
                );


            if (selectedOrder) {

                orderSelector.value =
                    orderId;

                displayInvoice(
                    selectedOrder
                );

                return;
            }
        }


        // Show latest order
        if (orders.length > 0) {

            orderSelector.value =
                orders[0]._id;

            displayInvoice(
                orders[0]
            );
        }


    } catch (error) {

        console.error(error);

        billingMessage.textContent =
            "Cannot connect to server. Make sure backend is running on port 4000.";

        billingMessage.style.color =
            "#d9534f";
    }
}


// ==============================
// DISPLAY INVOICE
// ==============================

function displayInvoice(order) {

    if (!order) {
        return;
    }


    invoice.style.display =
        "block";

    printBillButton.style.display =
        "block";

    billingMessage.textContent =
        "";


    invoiceOrderId.textContent =
        order.orderId;


    invoiceDate.textContent =
        new Date(
            order.orderDate
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );


    invoiceCustomerName.textContent =
        loggedInUser.name;


    invoiceCustomerEmail.textContent =
        loggedInUser.email;


    invoiceStatus.textContent =
        order.status;


    displayInvoiceProducts(
        order.products
    );


    invoiceOriginal.textContent =
        `₹${Number(
            order.originalAmount || 0
        ).toLocaleString("en-IN")}`;


    invoiceDiscount.textContent =
        `- ₹${Number(
            order.discount || 0
        ).toLocaleString("en-IN")}`;


    invoiceTotal.textContent =
        `₹${Number(
            order.totalAmount || 0
        ).toLocaleString("en-IN")}`;
}


// ==============================
// PRODUCTS TABLE
// ==============================

function displayInvoiceProducts(
    products
) {

    invoiceProducts.innerHTML =
        "";


    products.forEach(
        (product, index) => {

            const row =
                document.createElement(
                    "tr"
                );


            const total =
                product.price *
                product.quantity;


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>

                    <div class="invoice-product">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80'"
                        >

                        <span>
                            ${product.name}
                        </span>

                    </div>

                </td>

                <td>
                    ₹${Number(
                        product.price
                    ).toLocaleString("en-IN")}
                </td>

                <td>
                    ${product.quantity}
                </td>

                <td>
                    <strong>
                        ₹${Number(
                            total
                        ).toLocaleString("en-IN")}
                    </strong>
                </td>

            `;


            invoiceProducts.appendChild(
                row
            );
        }
    );
}


// ==============================
// SELECT ORDER
// ==============================

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

            displayInvoice(
                selectedOrder
            );
        }
    }
);


// ==============================
// PRINT BILL
// ==============================

printBillButton.addEventListener(
    "click",
    function () {

        window.print();
    }
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


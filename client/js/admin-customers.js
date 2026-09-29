
// ========================================
// ADMIN CUSTOMER MANAGEMENT
// ========================================

const CUSTOMER_API =
    "http://localhost:4000/api/users/customers";


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
    ).textContent =
        loggedInUser.name;

}


// ========================================
// ELEMENT
// ========================================

const customerList =
    document.getElementById(
        "customerList"
    );


// ========================================
// LOAD CUSTOMERS
// ========================================

async function loadCustomers() {

    try {

        const response =
            await fetch(CUSTOMER_API);

        const customers =
            await response.json();


        updateCustomerCounts(
            customers
        );


        displayCustomers(
            customers
        );


    } catch (error) {

        console.error(
            "Customer loading error:",
            error
        );

        customerList.innerHTML = `
            <p class="error-text">
                Cannot connect to server.
                Make sure port 4000 is running.
            </p>
        `;

    }

}


// ========================================
// CUSTOMER COUNTS
// ========================================

function updateCustomerCounts(
    customers
) {

    const regular =
        customers.filter(function (customer) {

            return (
                customer.customerType ===
                "regular"
            );

        });


    const oneTime =
        customers.filter(function (customer) {

            return (
                customer.customerType ===
                "one-time"
            );

        });


    document.getElementById(
        "totalCustomers"
    ).textContent =
        customers.length;


    document.getElementById(
        "regularCustomers"
    ).textContent =
        regular.length;


    document.getElementById(
        "oneTimeCustomers"
    ).textContent =
        oneTime.length;

}


// ========================================
// DISPLAY CUSTOMERS
// ========================================

function displayCustomers(
    customers
) {

    const type =
        document.getElementById(
            "customerTypeFilter"
        ).value;


    const search =
        document.getElementById(
            "customerSearch"
        ).value
        .toLowerCase()
        .trim();


    const filteredCustomers =
        customers.filter(
            function (customer) {

                const matchesType =
                    type === "all" ||
                    customer.customerType === type;


                const matchesSearch =
                    customer.name
                        .toLowerCase()
                        .includes(search) ||

                    customer.email
                        .toLowerCase()
                        .includes(search);


                return (
                    matchesType &&
                    matchesSearch
                );

            }
        );


    if (
        filteredCustomers.length === 0
    ) {

        customerList.innerHTML = `
            <div class="empty-card">

                <h3>
                    No Customers Found
                </h3>

                <p>
                    Try changing your filter
                    or search.
                </p>

            </div>
        `;

        return;

    }


    customerList.innerHTML =
        filteredCustomers
            .map(function (customer) {

                const typeText =
                    customer.customerType ===
                    "regular"
                        ? "Regular Customer"
                        : "One-Time Customer";


                const typeClass =
                    customer.customerType ===
                    "regular"
                        ? "regular"
                        : "one-time";


                const joinedDate =
                    new Date(
                        customer.createdAt
                    ).toLocaleDateString(
                        "en-IN"
                    );


                return `

                    <div
                        class="customer-card"
                    >

                        <div
                            class="customer-avatar"
                        >
                            ${customer.name
                                .charAt(0)
                                .toUpperCase()}
                        </div>


                        <div
                            class="customer-details"
                        >

                            <h3>
                                ${customer.name}
                            </h3>

                            <p>
                                📧
                                ${customer.email}
                            </p>

                            <p>
                                📦
                                Total Orders:
                                <strong>
                                    ${customer.totalOrders || 0}
                                </strong>
                            </p>

                            <p>
                                📅
                                Joined:
                                ${joinedDate}
                            </p>

                        </div>


                        <div
                            class="customer-type-area"
                        >

                            <span
                                class="
                                    customer-type
                                    ${typeClass}
                                "
                            >
                                ${typeText}
                            </span>


                            ${
                                customer.customerType ===
                                "regular"
                                ? `
                                    <p class="benefit-text">
                                        🎁 10% future discount
                                    </p>
                                  `
                                : `
                                    <p class="benefit-text">
                                        Becomes regular
                                        after 2 orders
                                    </p>
                                  `
                            }

                        </div>

                    </div>

                `;

            })
            .join("");

}


// ========================================
// FILTER EVENTS
// ========================================

document.getElementById(
    "customerTypeFilter"
).addEventListener(
    "change",
    loadCustomers
);


document.getElementById(
    "customerSearch"
).addEventListener(
    "input",
    loadCustomers
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

loadCustomers();


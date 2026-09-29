
// ================================
// ADMIN DASHBOARD
// ================================


// CHECK LOGIN

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


// SHOW ADMIN NAME

if (loggedInUser) {

    document.getElementById(
        "adminName"
    ).textContent =
        loggedInUser.name;

}


// ================================
// LOAD DASHBOARD DATA
// ================================

async function loadDashboard() {

    try {

        // GET PRODUCTS

        const productsResponse =
            await fetch(
                "http://localhost:4000/api/products"
            );

        const products =
            await productsResponse.json();


        // GET ORDERS

        const ordersResponse =
            await fetch(
                "http://localhost:4000/api/orders"
            );

        const orders =
            await ordersResponse.json();


        // GET CUSTOMERS

        const customersResponse =
            await fetch(
                "http://localhost:4000/api/users/customers"
            );

        const customers =
            await customersResponse.json();


        // TOTAL PRODUCTS

        document.getElementById(
            "totalProducts"
        ).textContent =
            products.length;


        // TOTAL ORDERS

        document.getElementById(
            "totalOrders"
        ).textContent =
            orders.length;


        // TOTAL CUSTOMERS

        document.getElementById(
            "totalCustomers"
        ).textContent =
            customers.length;


        // TOTAL SALES

        let totalSales = 0;

        orders.forEach(function (order) {

            totalSales +=
                Number(order.totalAmount) || 0;

        });


        document.getElementById(
            "totalSales"
        ).textContent =
            "₹" + totalSales.toLocaleString("en-IN");


        // SIMPLE PROFIT / LOSS

        // For this mini project:
        // Profit = 20% of total sales
        // Loss = 5% of total sales

        const profit =
            totalSales * 0.20;

        const loss =
            totalSales * 0.05;


        document.getElementById(
            "totalProfit"
        ).textContent =
            "₹" + profit.toLocaleString("en-IN");


        document.getElementById(
            "totalLoss"
        ).textContent =
            "₹" + loss.toLocaleString("en-IN");


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


// ================================
// LOGOUT
// ================================

function logout() {

    localStorage.removeItem(
        "loggedInUser"
    );

    window.location.href =
        "login.html";

}


// LOAD DASHBOARD

loadDashboard();


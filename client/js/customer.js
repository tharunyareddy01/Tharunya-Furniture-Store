
// ================================
// CUSTOMER DASHBOARD
// ================================


// CHECK LOGIN

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


// ================================
// DISPLAY CUSTOMER DETAILS
// ================================

if (loggedInUser) {

    // Navbar name

    document.getElementById(
        "customerName"
    ).textContent =
        loggedInUser.name;


    // Welcome name

    document.getElementById(
        "welcomeName"
    ).textContent =
        loggedInUser.name;


    // Total orders

    document.getElementById(
        "totalOrders"
    ).textContent =
        loggedInUser.totalOrders || 0;


    // Customer type

    const customerType =
        document.getElementById(
            "customerType"
        );


    if (
        loggedInUser.customerType ===
        "regular"
    ) {

        customerType.textContent =
            "Regular Customer";

    } else {

        customerType.textContent =
            "One-Time Customer";

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


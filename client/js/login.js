
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    console.log("Login button clicked");

    const email = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    if (!email || !password) {

        loginMessage.textContent =
            "Please enter email and password.";

        loginMessage.style.color = "#d9534f";

        return;
    }

    loginMessage.textContent =
        "Checking login details...";

    loginMessage.style.color = "#8b5e34";


    try {

        const response = await fetch(
            "http://localhost:4000/api/users/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        console.log("Server response:", data);


        if (!response.ok) {

            loginMessage.textContent =
                data.message || "Invalid email or password";

            loginMessage.style.color =
                "#d9534f";

            return;
        }


        // Save logged-in user
        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(data.user)
        );


        loginMessage.textContent =
            "Login successful! Redirecting...";

        loginMessage.style.color =
            "#3d7a4a";


        setTimeout(function () {

            if (data.user.role === "admin") {

                window.location.href =
                    "admin.html";

            } else {

                window.location.href =
                    "customer.html";
            }

        }, 700);


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        loginMessage.textContent =
            "Cannot connect to backend server. Make sure port 4000 is running.";

        loginMessage.style.color =
            "#d9534f";
    }

});


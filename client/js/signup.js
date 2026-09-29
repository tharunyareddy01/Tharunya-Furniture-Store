
// ================================
// SIGN UP
// ================================

const signupForm =
    document.getElementById("signupForm");

const signupMessage =
    document.getElementById("signupMessage");


signupForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name")
                .value
                .trim();

        const email =
            document.getElementById("email")
                .value
                .trim();

        const password =
            document.getElementById("password")
                .value;

        const confirmPassword =
            document.getElementById("confirmPassword")
                .value;


        // CHECK PASSWORDS

        if (password !== confirmPassword) {

            signupMessage.textContent =
                "Passwords do not match.";

            signupMessage.style.color =
                "#d9534f";

            return;
        }


        signupMessage.textContent =
            "Creating your account...";

        signupMessage.style.color =
            "#8b5e34";


        try {

            const response = await fetch(
                "http://localhost:4000/api/users/signup",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


            const data =
                await response.json();


            // SIGNUP FAILED

            if (!response.ok) {

                signupMessage.textContent =
                    data.message ||
                    "Signup failed.";

                signupMessage.style.color =
                    "#d9534f";

                return;
            }


            // SIGNUP SUCCESS

            signupMessage.textContent =
                "Account created successfully! Redirecting to login...";

            signupMessage.style.color =
                "#3d7a4a";


            setTimeout(function () {

                window.location.href =
                    "login.html";

            }, 1200);


        } catch (error) {

            console.error(
                "Signup error:",
                error
            );

            signupMessage.textContent =
                "Cannot connect to server. Make sure the server is running on port 4000.";

            signupMessage.style.color =
                "#d9534f";
        }

    }
);


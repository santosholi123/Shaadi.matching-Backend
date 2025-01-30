document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        console.error("Error: loginForm not found in the DOM.");
        return;
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent default form submission

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Please fill in all the fields.");
            return;
        }

        // Email format validation
        if (!/\S+@\S+\.\S+/.test(email)) {
            alert("Please enter a valid email.");
            return;
        }

        try {
            console.log("Sending data:", { email, password });

            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            console.log("Response status:", response.status);

            let message;
            try {
                message = await response.text();
            } catch (textError) {
                console.error("Error reading response text:", textError);
                message = "An unknown error occurred.";
            }

            if (response.ok) {
                console.log("Response message:", message);
                alert(message);
                window.location.href = "dashboard.html"; // Redirect after successful login
            } else {
                console.log("Error message:", message);
                alert(message);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again later.");
        }
    });
});

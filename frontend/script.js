// Add event listener for form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    // Check if passwords match
    if (data.password !== data.confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        // Send data to the backend
        const response = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                full_name: data.fullName,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword
            }) // Convert form data to JSON
        });

        // Handle the response
        if (response.ok) {
            alert('Signup successful!'); // Success message
        } else {
            const errorMessage = await response.text(); // Get error message
            alert(`Signup failed: ${errorMessage}`); // Display error message
        }
    } catch (error) {
        console.error(error); // Log any error
        alert('An error occurred. Please try again.'); // Display error to the user
    }
});

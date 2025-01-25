function handleSignup(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username && email && password) {
        // Simulate saving the user information
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);

        alert('Sign Up Successful! Redirecting to login...');
        window.location.href = 'login.html';
    } else {
        alert('Please fill in all fields.');
    }
}

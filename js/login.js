function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    if (email === storedEmail && password === storedPassword) {
        alert('Login Successful!');
        // Redirect to the main application or dashboard
        window.location.href = 'todolist.html';
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const errorMsg = document.getElementById('errorMsg');
    const loginBtn = document.getElementById('loginBtn');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const demoUsers = {
        'student@example.com': 'password123'
    };

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        emailError.textContent = '';
        passwordError.textContent = '';
        errorMsg.textContent = '';
        
        let isValid = true;
        
        if (!emailInput.value.trim()) {
            emailError.textContent = 'Email is required.';
            isValid = false;
        } else if (!emailRegex.test(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email.';
            isValid = false;
        }
        
        if (!passwordInput.value.trim()) {
            passwordError.textContent = 'Password is required.';
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters.';
            isValid = false;
        }
        
        if (isValid) {
            loginBtn.textContent = 'Logging in...';
            loginBtn.disabled = true;
            
            setTimeout(() => {
                if (demoUsers[emailInput.value] && demoUsers[emailInput.value] === passwordInput.value) {
                    localStorage.setItem('user', JSON.stringify({ email: emailInput.value }));
                    window.location.href = 'onboarding.html';
                } else {
                    errorMsg.textContent = 'Invalid email or password!';
                    loginBtn.textContent = 'Login';
                    loginBtn.disabled = false;
                }
            }, 1500);
        } else {
            errorMsg.textContent = 'Please fix the errors above.';
        }
    });
});

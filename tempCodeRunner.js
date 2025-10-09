document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('onboardingForm');
    const messageDiv = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const checkboxes = document.querySelectorAll('input[name="focus"]');

    // Enforce exactly 2 selections
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('input[name="focus"]:checked').length;
            if (checkedCount > 2) {
                this.checked = false;
                messageDiv.textContent = 'Please select exactly 2 focus areas.';
                messageDiv.className = 'message';
            } else {
                messageDiv.textContent = '';
                messageDiv.className = 'message';
            }
        });
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const selectedFocusAreas = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        if (selectedFocusAreas.length !== 2) {
            messageDiv.textContent = 'Please select exactly 2 focus areas.';
            messageDiv.className = 'message';
            return;
        }
        
        submitBtn.textContent = 'Saving...';
        submitBtn.disabled = true;
        
        localStorage.setItem('focusAreas', JSON.stringify(selectedFocusAreas));
        
        messageDiv.textContent = 'Preferences saved! Redirecting to your dashboard...';
        messageDiv.className = 'message success';
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    });
});
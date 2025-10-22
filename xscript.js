function scrollToForm() {
    document.getElementById('form').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Basic configuration for backend URL. Can be overridden by setting window.NIMBUS_API_BASE_URL before this script loads.
const API_BASE_URL = (function resolveApiBaseUrl() {
    if (typeof window !== 'undefined' && window.NIMBUS_API_BASE_URL) {
        return window.NIMBUS_API_BASE_URL.replace(/\/$/, '');
    }
    const isLocal = typeof window !== 'undefined' && /localhost|127\.0\.0\.1/i.test(window.location.hostname);
    // Default to backend running on 8080 locally; otherwise try same origin (useful when served behind a reverse proxy)
    return isLocal ? 'http://localhost:8080' : `${window.location.origin}`;
})();

const SUBMIT_ENDPOINT = '/api/users/submit';

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

async function handleSubmit() {
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const company = document.getElementById('company').value.trim();
    const message = document.getElementById('message').value.trim();
    const generalErrorEl = document.getElementById('generalError');
    const submitButton = document.querySelector('.submit-button');

    // Reset error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
    if (generalErrorEl) {
        generalErrorEl.style.display = 'none';
        generalErrorEl.textContent = '';
    }

    let isValid = true;

    // Validate name
    if (!name) {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    }

    // Validate email
    if (!email || !validateEmail(email)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }

    // Validate message
    if (!message) {
        document.getElementById('messageError').style.display = 'block';
        isValid = false;
    }

    // If form is valid, submit to backend
    if (isValid) {
        const payload = { name, email, phone, company, message };

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting...';
            }

            const response = await fetch(`${API_BASE_URL}${SUBMIT_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const contentType = response.headers.get('content-type') || '';
            const isJson = contentType.includes('application/json');
            const data = isJson ? await response.json() : null;

            if (!response.ok) {
                const errorMessage = (data && (data.message || (data.errors && data.errors[0] && data.errors[0].message))) || 'Submission failed. Please try again.';
                throw new Error(errorMessage);
            }

            document.getElementById('userForm').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';

            setTimeout(() => {
                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('phone').value = '';
                document.getElementById('company').value = '';
                document.getElementById('message').value = '';
            }, 3000);
        } catch (err) {
            if (generalErrorEl) {
                generalErrorEl.textContent = err.message || 'An unexpected error occurred.';
                generalErrorEl.style.display = 'block';
            } else {
                alert(err.message || 'An unexpected error occurred.');
            }
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit';
            }
        }
    } else {
        // Scroll to first error
        const firstError = document.querySelector('.error-message[style*="display: block"]');
        if (firstError) {
            firstError.parentElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }
}

// Add enter key support for form submission
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                handleSubmit();
            }
        });
    });
});
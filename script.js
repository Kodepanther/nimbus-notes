function scrollToForm() {
    document.getElementById('form').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function handleSubmit() {
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const company = document.getElementById('company').value.trim();
    const message = document.getElementById('message').value.trim();

    // Reset error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });

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

    // If form is valid, submit
    if (isValid) {
        // Store user data
        const userData = {
            name: name,
            email: email,
            phone: phone,
            company: company,
            message: message,
            timestamp: new Date().toISOString()
        };

        // Log to console (in real app, this would be sent to a server)
        console.log('Form submitted:', userData);

        // Show success message
        document.getElementById('userForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';

        // Optional: Reset form after showing success
        setTimeout(() => {
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('company').value = '';
            document.getElementById('message').value = '';
        }, 3000);
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
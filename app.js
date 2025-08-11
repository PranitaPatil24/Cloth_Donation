// DOM Elements
const modal = document.getElementById('authModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeBtn = document.querySelector('.close-btn');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const switchToLogin = document.getElementById('switchToLogin');
const switchToSignup = document.getElementById('switchToSignup');

// Open Modal
openModalBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    signupForm.style.display = 'flex';
    loginForm.style.display = 'none';
});

// Close Modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Switch between forms
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'flex';
});

switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
});

// Form Submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userType = document.getElementById('userType').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Here you would typically send this data to your backend
    console.log('Signup Data:', { userType, name, email, password });
    
    alert(`Thanks for signing up, ${name}! You're now a ${userType}.`);
    signupForm.reset();
    modal.style.display = 'none';
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userType = document.getElementById('loginUserType').value;
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Here you would typically send this data to your backend
    console.log('Login Data:', { userType, email, password });
    
    alert(`Welcome back! You're logged in as a ${userType}.`);
    loginForm.reset();
    modal.style.display = 'none';
});

// Show/hide organization field based on user type
function toggleOrgField() {
    const userType = document.getElementById('userType').value;
    const orgField = document.getElementById('orgField');
    
    orgField.style.display = userType === 'receiver' ? 'block' : 'none';
    
    if (userType === 'receiver') {
        document.getElementById('organizationName').required = true;
    } else {
        document.getElementById('organizationName').required = false;
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 60, // Adjust for fixed navbar
            behavior: 'smooth'
        });
    });
});

//faq
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = question.classList.contains('active');

            // Close all other open answers
            faqItems.forEach(otherItem => {
                const otherQuestion = otherItem.querySelector('.faq-question');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                if (otherQuestion !== question) {
                    otherQuestion.classList.remove('active');
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.style.padding = '0 1.5rem';
                }
            });

            // Toggle the clicked answer
            if (isActive) {
                question.classList.remove('active');
                answer.style.maxHeight = '0';
                answer.style.padding = '0 1.5rem';
            } else {
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.padding = '1.5rem';
            }
        });
    });
});
// Scroll Reveal Animation
const revealElements = () => {
    const elements = document.querySelectorAll('[data-scroll-reveal]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
};

// Parallax Effect
const parallaxEffect = () => {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            const elementPosition = element.offsetTop;
            const distance = scrollPosition - elementPosition;
            const offset = distance * 0.5;
            
            element.style.transform = `translateY(${offset}px)`;
        });
    });
};

// Smooth Scroll for Navigation Links
const smoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// Navbar Active State
const updateNavbarActiveState = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.style.color = 'var(--text-color)';
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.style.color = 'var(--primary-gold)';
            }
        });
    });
};

// Form Submission
const handleFormSubmission = () => {
    const form = document.getElementById('orderForm');
    
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const quantity = document.getElementById('quantity').value;
            const address = document.getElementById('address').value;
            
            // Create a simple success message
            const formData = {
                name,
                email,
                phone,
                quantity,
                address,
                timestamp: new Date().toLocaleString('ar-SA')
            };
            
            console.log('Order Data:', formData);
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            form.reset();
        });
    }
};

// Show Success Message
const showSuccessMessage = () => {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <div class="success-content">
            <h3>شكراً لك! تم استقبال طلبك</h3>
            <p>سيتم التواصل معك في أقرب وقت</p>
            <button class="success-close">إغلاق</button>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .success-message {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        .success-content {
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
            border: 2px solid #d4af37;
            border-radius: 8px;
            padding: 3rem;
            text-align: center;
            max-width: 400px;
            animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .success-content h3 {
            color: #d4af37;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        
        .success-content p {
            color: #f5f5f5;
            margin-bottom: 2rem;
        }
        
        .success-close {
            background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%);
            color: #0f0f0f;
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 4px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .success-close:hover {
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
    
    // Close button functionality
    const closeButton = message.querySelector('.success-close');
    closeButton.addEventListener('click', () => {
        message.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            message.remove();
        }, 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(message)) {
            message.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                message.remove();
            }, 300);
        }
    }, 5000);
};

// Add fade out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Scroll animations on page load
const handleScrollAnimations = () => {
    const elements = document.querySelectorAll('[data-scroll-reveal]');
    
    const checkScroll = () => {
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementHeight = element.offsetHeight;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - elementHeight / 2) {
                element.classList.add('revealed');
            }
        });
    };
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check on page load
};

// Enhanced Product Image Interactions
const enhanceProductImages = () => {
    const images = document.querySelectorAll('.product-image');
    
    images.forEach(image => {
        image.addEventListener('mouseenter', function () {
            this.style.filter = 'drop-shadow(0 25px 70px rgba(212, 175, 55, 0.4))';
        });
        
        image.addEventListener('mouseleave', function () {
            this.style.filter = 'drop-shadow(0 20px 60px rgba(212, 175, 55, 0.3))';
        });
    });
};

// Initialize all functions
const init = () => {
    revealElements();
    parallaxEffect();
    smoothScroll();
    updateNavbarActiveState();
    handleFormSubmission();
    handleScrollAnimations();
    enhanceProductImages();
};

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Prevent image context menu
document.querySelectorAll('.product-image').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

// Add Loading Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        window.scrollBy(0, 100);
    } else if (e.key === 'ArrowUp') {
        window.scrollBy(0, -100);
    }
});
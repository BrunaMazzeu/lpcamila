// Scroll to Checkout
function scrollToCheckout() {
    const checkoutSection = document.getElementById('checkout');
    if (checkoutSection) {
        checkoutSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Toggle FAQ
function toggleFAQ(button) {
    const faqItem = button.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Sticky Footer Visibility
function handleStickyFooter() {
    const stickyFooter = document.getElementById('sticky-footer');
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    
    if (scrollPosition > windowHeight * 0.5) {
        stickyFooter.classList.add('visible');
    } else {
        stickyFooter.classList.remove('visible');
    }
}

// Timer de Escassez - 15 minutos
function initUrgencyTimer() {
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const timerContainer = document.querySelector('.urgency-timer');
    
    if (!minutesElement || !secondsElement || !timerContainer) {
        console.log('Elementos do timer não encontrados');
        return;
    }
    
    // 15 minutos em milissegundos
    let timeLeft = 15 * 60 * 1000;
    
    function updateTimer() {
        const minutes = Math.floor(timeLeft / (60 * 1000));
        const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
        
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Efeito visual quando estiver acabando
        if (timeLeft <= 5 * 60 * 1000) { // 5 minutos restantes
            timerContainer.classList.add('ending');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerContainer.innerHTML = `
                <div style="color: var(--destructive); font-weight: 600; text-align: center;">
                    ⚠️ Oferta encerrada! Preço voltou para R$ 39,90
                </div>
            `;
        }
        
        timeLeft -= 1000;
    }
    
    // Atualiza a cada segundo
    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Inicializa imediatamente
}

// Intersection Observer for Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target); // Para de observar após a animação
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-up').forEach(element => {
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    initAnimations();
    
    // Handle sticky footer on scroll
    window.addEventListener('scroll', handleStickyFooter);
    
    // Initialize urgency timer
    initUrgencyTimer();
    
    // Initial check for sticky footer
    handleStickyFooter();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        handleStickyFooter();
    }, 250);
});

// Pause animations when user prefers reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-up').forEach(element => {
        element.style.animation = 'none';
    });
}
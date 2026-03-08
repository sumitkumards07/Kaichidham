document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 1.5 Sticky Booking Bar Effect
    const bookingBar = document.querySelector('.booking-bar');
    const bookingFilters = document.querySelector('.booking-filters');

    if (bookingBar && bookingFilters) {
        window.addEventListener('scroll', () => {
            const filtersTop = bookingFilters.offsetTop;
            if (window.scrollY >= filtersTop - 10) {
                bookingBar.classList.add('sticky');
            } else {
                bookingBar.classList.remove('sticky');
            }
        });
    }

    // 2. Scroll Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Trigger initial reveal for elements already in viewport
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);
});

// 4. Room Filtering Logic
function filterRooms() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const guestsInput = document.getElementById('guests').value.toLowerCase();

    if (!checkin || !checkout) {
        alert("Please select both Check-In and Check-Out dates first.");
        return;
    }

    const cards = document.querySelectorAll('.room-card');
    let guests = 2; // Default

    // Attempt to parse guests if they typed a number like "4" or "4 guests"
    const match = guestsInput.match(/(\d+)\s*guest/);
    if (match) {
        guests = parseInt(match[1]);
    } else if (!isNaN(parseInt(guestsInput))) {
        guests = parseInt(guestsInput);
    }

    cards.forEach(card => {
        const title = card.querySelector('h3').innerText;
        card.style.display = 'flex'; // Reset all to visible

        // Simple logic: 
        // Deluxe & Twin: Max 2-3 guests
        // Executive & Family: Max 4 guests
        // Dormitory: Any size
        if (guests > 3 && (title.includes('Deluxe') || title.includes('Twin'))) {
            card.style.display = 'none';
        }
        if (guests > 4 && (title.includes('Executive') || title.includes('Family'))) {
            card.style.display = 'none';
        }
    });

    // Scroll to the results smoothly
    document.getElementById('rooms').scrollIntoView({ behavior: 'smooth' });
}

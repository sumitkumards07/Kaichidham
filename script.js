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
        // Get the initial top position of the booking filters section
        const filtersTop = bookingFilters.offsetTop;

        window.addEventListener('scroll', () => {
            if (window.scrollY >= filtersTop) {
                bookingBar.classList.add('sticky');
                // Add padding to prevent content jump when bar becomes fixed
                bookingFilters.style.paddingTop = `${bookingBar.offsetHeight}px`;
            } else {
                bookingBar.classList.remove('sticky');
                bookingFilters.style.paddingTop = '2rem';
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

    // Call the filter rooms function here for the search button
    filterRooms();
}

// 4. Room Filtering Logic based on Guests
function filterRooms() {
    const guestsInput = document.getElementById('guests').value.toLowerCase();
    const cards = document.querySelectorAll('.room-card');

    // Default to 2 guests if empty or parsing fails
    let guests = 2;

    if (guestsInput) {
        // Try to match numbers like "3 guests", "3", "1 room 4 guests"
        // Look for number before "guest" or just any stand-alone number if "guest" isn't present
        const match = guestsInput.match(/(\d+)\s*guest/);
        if (match) {
            guests = parseInt(match[1]);
        } else {
            // fallback: find the last number in the string (assuming format "X rooms Y guests")
            const nums = guestsInput.match(/\d+/g);
            if (nums && nums.length > 0) {
                guests = parseInt(nums[nums.length - 1]);
            }
        }
    }

    cards.forEach(card => {
        const title = card.querySelector('h3').innerText;
        card.style.display = 'flex'; // Reset all to visible

        // Logic: 
        // Deluxe & Twin: Max 3 guests
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
    const roomsSection = document.getElementById('rooms');
    if (roomsSection) {
        roomsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 5. Add event listener to guests input to filter on "Enter" or change
document.addEventListener('DOMContentLoaded', () => {
    const guestsInputEl = document.getElementById('guests');
    if (guestsInputEl) {
        guestsInputEl.addEventListener('change', filterRooms);
        guestsInputEl.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') filterRooms();
        });
    }
});

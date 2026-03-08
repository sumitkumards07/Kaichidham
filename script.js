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

// 4. Room Filtering Logic based on Rooms
function filterRooms() {
    // Now it's a select dropdown with values "1", "2", "3", "4+"
    const roomsValue = document.getElementById('guests').value;
    const cards = document.querySelectorAll('.room-card');

    let rooms = parseInt(roomsValue);
    if (isNaN(rooms)) rooms = 1; // Default to 1 room

    cards.forEach(card => {
        const title = card.querySelector('h3').innerText;
        card.style.display = 'flex'; // Reset all to visible

        // Filter Logic based on No. of Rooms:
        // A single room like Deluxe or Twin is typically booked for 1 room needs.
        // If a user selects 3 or 4+ rooms, they likely want the Dormitory or multiple smaller rooms. 
        // We will hide the very smallest rooms if they require a massive booking (e.g. 4+ rooms) to focus them on group stays.
        if (rooms >= 3 && (title.includes('Deluxe') || title.includes('Twin'))) {
            // Uncomment to hide smaller rooms for large groups, or just leave all visible.
            // card.style.display = 'none'; 
        }

        // We can leave everything visible or add custom grouping logic here depending on the hotel's exact capacity.
        // For now, we will just scroll to the options as any room type can theoretically be booked multiple times if available.
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

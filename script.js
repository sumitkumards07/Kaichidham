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
    const roomsSelect = document.getElementById('roomsInput');
    const guestsInput = document.getElementById('guestsInput');

    if (!roomsSelect || !guestsInput) return;

    let rooms = parseInt(roomsSelect.value) || 1;
    let guests = parseInt(guestsInput.value) || 1;

    const cards = document.querySelectorAll('.room-card');

    cards.forEach(card => {
        const title = card.querySelector('h3').innerText;
        card.style.display = 'flex'; // Reset all to visible

        // Smaller rooms like Twin/Deluxe are typically optimized for 2-3 guests max.
        // If a user is explicitly searching for massive groups (rooms >= 3), they often prefer dormitories or large family suites.
        if (rooms >= 3 && (title.includes('Deluxe') || title.includes('Twin'))) {
            // Uncomment to hide smaller rooms for large groups. leaving visible by default to show inventory.
            // card.style.display = 'none'; 
        }
    });

    // Scroll to the results smoothly
    const roomsSection = document.getElementById('rooms');
    if (roomsSection) {
        roomsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 5. Custom +/- Guests Counter Logic
function updateGuests(change) {
    const guestsInput = document.getElementById('guestsInput');
    const roomsSelect = document.getElementById('roomsInput');

    if (!guestsInput || !roomsSelect) return;

    let currentVal = parseInt(guestsInput.value) || 1;
    let newVal = currentVal + change;

    // Limits: Min 1, Max 20
    if (newVal < 1) newVal = 1;
    if (newVal > 20) newVal = 20;

    guestsInput.value = newVal;

    // Rule: Max 3 people per room. If they select more people than 3 * rooms, auto-add rooms.
    let rooms = parseInt(roomsSelect.value) || 1;
    const requiredRooms = Math.ceil(newVal / 3);

    if (rooms < requiredRooms) {
        // Enforce rule by updating the UI dropdown automatically
        rooms = requiredRooms;

        // Cap the dropdown update at "4+" if it exceeds standard options
        const newRoomValue = rooms > 4 ? "4+" : rooms.toString();

        // Update DOM value to reflect the change visually
        for (let i = 0; i < roomsSelect.options.length; i++) {
            if (roomsSelect.options[i].value === newRoomValue) {
                roomsSelect.selectedIndex = i;
                break;
            }
        }

        // Flash the rooms input to draw attention to the auto-update
        roomsSelect.parentElement.parentElement.style.animation = "pulse 0.5s ease";
        setTimeout(() => {
            roomsSelect.parentElement.parentElement.style.animation = "";
        }, 500);
    }

    // Trigger standard filter
    filterRooms();
}

// 6. Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    const roomsInputEl = document.getElementById('roomsInput');
    if (roomsInputEl) {
        roomsInputEl.addEventListener('change', filterRooms);
    }
});

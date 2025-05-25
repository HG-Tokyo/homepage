document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.nav');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');

    // Toggle navigation menu visibility
    hamburgerMenu.addEventListener('click', function() {
        nav.classList.toggle('nav-open');
        hamburgerMenu.classList.toggle('active');
    });

    // Close main nav when a non-dropdown nav link is clicked, or for any nav link on desktop
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (event) => {
            const parentLi = link.closest('li');
            const isDropdownToggle = parentLi && parentLi.classList.contains('dropdown-menu');

            // --- CRUCIAL CHANGE HERE ---
            // Only close the main nav if:
            // 1. It's a regular nav link (not a dropdown toggle)
            // 2. OR, if it's a dropdown toggle but on desktop (where hover handles dropdowns)
            // This ensures dropdown toggles on mobile DO NOT close the main nav.
            if (!isDropdownToggle || window.innerWidth > 900) {
                if (nav.classList.contains('nav-open')) {
                    nav.classList.remove('nav-open');
                    hamburgerMenu.classList.remove('active');
                }
            }
            // IMPORTANT: Do NOT call event.preventDefault() here for dropdown toggles on mobile.
            // Let the dedicated dropdownLink listener handle that for its specific purpose.
            // For regular links, the browser will follow the href, which is fine.
        });
    });

    // Handle dropdowns in mobile view
    dropdownMenus.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('.nav-link');
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        dropdownLink.addEventListener('click', function(event) {
            // Only toggle dropdown on mobile/tablet widths
            if (window.innerWidth <= 900) {
                event.preventDefault(); // THIS is where preventDefault() is needed for dropdown toggles
                dropdownContent.classList.toggle('dropdown-open');

                // Optional: Close other open dropdowns if only one should be open at a time
                dropdownMenus.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.querySelector('.dropdown-content').classList.remove('dropdown-open');
                    }
                });
            }
            // On desktop (window.innerWidth > 900), this listener does nothing as dropdowns
            // are handled by CSS :hover, and the default link behavior to '#' is harmless.
        });
    });

    // Close nav and dropdowns if window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 900) {
            nav.classList.remove('nav-open');
            hamburgerMenu.classList.remove('active');
            dropdownMenus.forEach(dropdown => {
                dropdown.querySelector('.dropdown-content').classList.remove('dropdown-open');
            });
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.nav');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');

    hamburgerMenu.addEventListener('click', function() {
        nav.classList.toggle('nav-open');
        hamburgerMenu.classList.toggle('active');
    });

    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (event) => {
            const parentLi = link.closest('li');
            const isDropdownToggle = parentLi && parentLi.classList.contains('dropdown-menu');

            if (!isDropdownToggle || window.innerWidth > 900) {
                if (nav.classList.contains('nav-open')) {
                    nav.classList.remove('nav-open');
                    hamburgerMenu.classList.remove('active');
                }
            }
        });
    });

    dropdownMenus.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('.nav-link');
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        dropdownLink.addEventListener('click', function(event) {
            if (window.innerWidth <= 900) {
                event.preventDefault();
                dropdownContent.classList.toggle('dropdown-open');
                dropdownMenus.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.querySelector('.dropdown-content').classList.remove('dropdown-open');
                    }
                });
            }
        });
    });

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

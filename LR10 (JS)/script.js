document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authModal = document.getElementById('auth-modal');
    const authForm = document.getElementById('auth-form');
    const appContent = document.getElementById('app-content');
    const logoutBtn = document.getElementById('logout-btn');
    const searchInput = document.getElementById('search-input');
    const genderFilter = document.getElementById('gender-filter');
    const ageMinInput = document.getElementById('age-min');
    const ageMaxInput = document.getElementById('age-max');
    const sortBySelect = document.getElementById('sort-by');
    const userCardsContainer = document.getElementById('user-cards-container');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNumbersContainer = document.getElementById('page-numbers');
    const modalClose = document.querySelector('.close');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorContainer = document.getElementById('error-container');

    // App State
    let users = [];
    let filteredUsers = [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const itemsPerPage = 30;
    let currentPage = 1;
    let totalPages = 1;
    let isLoading = false;
    let hasNextPageToLoad = true;

    // Check authentication
    checkAuth();

    // Event Listeners
    authForm.addEventListener('submit', handleAuthSubmit);
    modalClose.addEventListener('click', () => {
        authModal.style.display = 'none';
    });
    logoutBtn.addEventListener('click', handleLogout);
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    genderFilter.addEventListener('change', applyFilters);
    ageMinInput.addEventListener('input', applyFilters);
    ageMaxInput.addEventListener('input', applyFilters);
    sortBySelect.addEventListener('change', applySorting);
    prevPageBtn.addEventListener('click', goToPreviousPage);
    nextPageBtn.addEventListener('click', goToNextPage);
    window.addEventListener('scroll', handleInfiniteScroll);
    window.addEventListener('popstate', handlePopState);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            // Don't close if not authenticated
            const user = localStorage.getItem('user');
            if (user) {
                authModal.style.display = 'none';
            }
        }
    });

    // Functions
    function checkAuth() {
        const user = localStorage.getItem('user');
        if (user) {
            authModal.style.display = 'none';
            appContent.classList.remove('hidden');
            loadStateFromURL();
            fetchUsers();
        } else {
            authModal.style.display = 'flex';
            appContent.classList.add('hidden');
        }
    }

    function handleAuthSubmit(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validation
        if (!username || !password) {
            showError('Please enter both username and password');
            return;
        }

        // Fake authentication
        localStorage.setItem('user', JSON.stringify({ username }));
        showSuccess('Login successful');
        checkAuth();

        // Reset form
        authForm.reset();
    }

    function handleLogout() {
        localStorage.removeItem('user');
        checkAuth();

        // Reset URL
        history.pushState(null, '', window.location.pathname);
    }

    async function fetchUsers() {
        try {
            showLoading(true);
            const response = await fetch('https://randomuser.me/api/?results=100');

            if (!response.ok) {
                throw new Error(`Failed to fetch users. Status: ${response.status}`);
            }

            const data = await response.json();
            users = data.results.map(user => ({
                id: user.login.uuid,
                name: `${user.name.first} ${user.name.last}`,
                age: user.dob.age,
                gender: user.gender,
                email: user.email,
                phone: user.phone,
                picture: user.picture.large,
                location: `${user.location.city}, ${user.location.country}`,
                registered: new Date(user.registered.date),
                registeredDate: formatDate(new Date(user.registered.date))
            }));

            // Apply initial filters and render
            applyFilters();
            showLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            showError(`Error loading users: ${error.message}`);
            showLoading(false);
        }
    }

    function loadStateFromURL() {
        const params = new URLSearchParams(window.location.search);

        searchInput.value = params.get('search') || '';
        genderFilter.value = params.get('gender') || '';
        ageMinInput.value = params.get('minAge') || '';
        ageMaxInput.value = params.get('maxAge') || '';
        sortBySelect.value = params.get('sort') || '';
        currentPage = parseInt(params.get('page')) || 1;
    }

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const gender = genderFilter.value;
        const minAge = parseInt(ageMinInput.value) || 0;
        const maxAge = parseInt(ageMaxInput.value) || 100;

        filteredUsers = users.filter(user => {
            // Comprehensive search across different fields
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                user.phone.includes(searchTerm) ||
                user.location.toLowerCase().includes(searchTerm);

            const matchesGender = !gender || user.gender === gender;
            const matchesAge = user.age >= minAge && user.age <= maxAge;

            return matchesSearch && matchesGender && matchesAge;
        });

        currentPage = 1; // Reset to first page when filters change
        applySorting();
        updateURL();
    }

    function applySorting() {
        const sortValue = sortBySelect.value;

        switch(sortValue) {
            case 'name-asc':
                filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredUsers.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'age-asc':
                filteredUsers.sort((a, b) => a.age - b.age);
                break;
            case 'age-desc':
                filteredUsers.sort((a, b) => b.age - a.age);
                break;
            case 'registered-asc':
                filteredUsers.sort((a, b) => a.registered - b.registered);
                break;
            case 'registered-desc':
                filteredUsers.sort((a, b) => b.registered - a.registered);
                break;
            default:
                // No sorting
                break;
        }

        updatePagination();
        renderUserCards();
    }

    function renderUserCards() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const usersToDisplay = filteredUsers.slice(startIndex, endIndex);

        // Only clear container if on page 1 or not infinite loading
        if (currentPage === 1) {
            userCardsContainer.innerHTML = '';
        }

        if (usersToDisplay.length === 0 && currentPage === 1) {
            userCardsContainer.innerHTML = '<p class="no-results">No users found matching your criteria.</p>';
            return;
        }

        usersToDisplay.forEach(user => {
            const isFavorite = favorites.includes(user.id);
            const card = document.createElement('div');
            card.className = 'user-card';
            card.innerHTML = `
                <div class="user-card-header">
                    <img src="${user.picture}" alt="${user.name}" class="user-card-img">
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${user.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="user-card-body">
                    <h3 class="user-card-name">${user.name}</h3>
                    <div class="user-card-info">
                        <p><i class="fas fa-birthday-cake"></i> ${user.age} years</p>
                        <p><i class="fas fa-${user.gender === 'male' ? 'mars' : 'venus'}"></i> ${user.gender}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${user.location}</p>
                        <p><i class="fas fa-phone"></i> ${user.phone}</p>
                        <p><i class="fas fa-envelope"></i> ${user.email}</p>
                        <p><i class="fas fa-calendar-alt"></i> Registered: ${user.registeredDate}</p>
                    </div>
                </div>
            `;
            userCardsContainer.appendChild(card);
        });

        // Add event listeners to favorite buttons
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', toggleFavorite);
        });
    }

    function toggleFavorite(e) {
        const userId = e.currentTarget.getAttribute('data-id');
        const index = favorites.indexOf(userId);

        if (index === -1) {
            favorites.push(userId);
            e.currentTarget.classList.add('active');
            showNotification('Added to favorites');
        } else {
            favorites.splice(index, 1);
            e.currentTarget.classList.remove('active');
            showNotification('Removed from favorites');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    function updatePagination() {
        totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
        currentPage = Math.min(currentPage, totalPages || 1);
        hasNextPageToLoad = currentPage < totalPages;

        // Update pagination controls
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;

        // Update page numbers
        pageNumbersContainer.innerHTML = '';

        if (totalPages <= 1) {
            return; // No need to show pagination for one page
        }

        // Show first page, current page, and last page
        const pagesToShow = new Set();
        pagesToShow.add(1);
        if (currentPage > 1) pagesToShow.add(currentPage - 1);
        pagesToShow.add(currentPage);
        if (currentPage < totalPages) pagesToShow.add(currentPage + 1);
        if (totalPages > 1) pagesToShow.add(totalPages);

        // Add ellipsis if needed
        let prevPage = 0;
        Array.from(pagesToShow).sort((a, b) => a - b).forEach(page => {
            if (page - prevPage > 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'ellipsis';
                pageNumbersContainer.appendChild(ellipsis);
            }

            const pageNumber = document.createElement('span');
            pageNumber.textContent = page;
            pageNumber.className = 'page-number';
            if (page === currentPage) pageNumber.classList.add('active');
            pageNumber.addEventListener('click', () => goToPage(page));
            pageNumbersContainer.appendChild(pageNumber);

            prevPage = page;
        });
    }

    function goToPage(page) {
        if (page < 1 || page > totalPages) return;

        if (page === currentPage) return;

        currentPage = page;
        renderUserCards();
        updateURL();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function goToPreviousPage() {
        goToPage(currentPage - 1);
    }

    function goToNextPage() {
        goToPage(currentPage + 1);
    }

    function handleSearch() {
        applyFilters();
    }

    function handleInfiniteScroll() {
        if (isLoading || !hasNextPageToLoad) return;

        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.body.offsetHeight;
        const scrollThreshold = pageHeight - 500;

        if (scrollPosition >= scrollThreshold) {
            loadNextPage();
        }
    }

    function loadNextPage() {
        if (currentPage >= totalPages) return;

        isLoading = true;
        currentPage++;

        // Show loading indicator at bottom
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading-more';
        loadingElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading more...';
        userCardsContainer.appendChild(loadingElement);

        // Simulate network delay for better UX
        setTimeout(() => {
            // Remove loading indicator
            const loadingEls = document.querySelectorAll('.loading-more');
            loadingEls.forEach(el => el.remove());

            renderUserCards();
            updatePagination();
            updateURL();
            isLoading = false;
        }, 500);
    }

    function updateURL() {
        const params = new URLSearchParams();

        if (searchInput.value) params.set('search', searchInput.value);
        if (genderFilter.value) params.set('gender', genderFilter.value);
        if (ageMinInput.value) params.set('minAge', ageMinInput.value);
        if (ageMaxInput.value) params.set('maxAge', ageMaxInput.value);
        if (sortBySelect.value) params.set('sort', sortBySelect.value);
        if (currentPage > 1) params.set('page', currentPage);

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        history.pushState({}, '', newUrl);
    }

    function handlePopState() {
        loadStateFromURL();
        applyFilters();
    }

    // Helper Functions
    function formatDate(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    function showLoading(isVisible) {
        if (!loadingIndicator) return;

        if (isVisible) {
            loadingIndicator.classList.remove('hidden');
        } else {
            loadingIndicator.classList.add('hidden');
        }
    }

    function showError(message) {
        if (!errorContainer) return;

        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');

        // Hide after 5 seconds
        setTimeout(() => {
            errorContainer.classList.add('hidden');
        }, 5000);
    }

    function showSuccess(message) {
        const successContainer = document.createElement('div');
        successContainer.className = 'success-notification';
        successContainer.textContent = message;
        document.body.appendChild(successContainer);

        // Show animation
        setTimeout(() => {
            successContainer.classList.add('show');
        }, 10);

        // Hide after 3 seconds
        setTimeout(() => {
            successContainer.classList.remove('show');
            // Remove from DOM after fade out
            setTimeout(() => {
                successContainer.remove();
            }, 300);
        }, 3000);
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Show animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Hide after 2 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            // Remove from DOM after fade out
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
});

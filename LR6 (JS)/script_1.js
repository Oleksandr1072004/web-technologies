// Глобальні змінні
let products = [];
let categories = ['Електроніка', 'Одяг', 'Книги', 'Продукти', 'Іграшки'];
let editingProductId = null;

// DOM елементи
const productsList = document.getElementById('products-list');
const addProductBtn = document.getElementById('add-product-btn');
const productModal = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal');
const cancelModalBtn = document.getElementById('cancel-modal');
const productForm = document.getElementById('product-form');
const modalTitle = document.getElementById('modal-title');
const snackbar = document.getElementById('snackbar');
const totalPriceElement = document.getElementById('total-price');
const resetFilterBtn = document.querySelector('.reset-filter');
const sortByPriceBtn = document.querySelector('.sort-by-price');
const sortByDateBtn = document.querySelector('.sort-by-date');
const sortByUpdateBtn = document.querySelector('.sort-by-update');
const resetSortBtn = document.querySelector('.reset-sort');
const filtersContainer = document.querySelector('.filters');

// Ініціалізація додатку
function init() {
    // Додати обробники подій
    addProductBtn.addEventListener('click', openAddProductModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);
    productForm.addEventListener('submit', handleProductSubmit);
    resetFilterBtn.addEventListener('click', resetFilters);
    sortByPriceBtn.addEventListener('click', () => sortProducts('price'));
    sortByDateBtn.addEventListener('click', () => sortProducts('createdAt'));
    sortByUpdateBtn.addEventListener('click', () => sortProducts('updatedAt'));
    resetSortBtn.addEventListener('click', resetSorting);

    // Додати кнопки фільтрів для категорій
    renderCategoryFilters();

    // Завантажити тестові дані (можна видалити в продакшені)
    loadSampleData();

    // Оновити інтерфейс
    updateUI();
}

// Завантажити тестові дані
function loadSampleData() {
    const sampleProducts = [
        {
            id: generateId(),
            name: 'Смартфон',
            price: 12999,
            category: 'Електроніка',
            image: 'https://smart.ua/image/cache/catalog/import_files/9f/9fd5b87ae51911eebb86d85ed3a38e00_a9d2b352e8eb11eebb86d85ed3a38e00-600x600.png',
            description: 'IPhone 12 Pro Max 128GB Pacific Blue',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: generateId(),
            name: 'Футболка',
            price: 499,
            category: 'Одяг',
            image: 'https://i0.wp.com/tabooclothes.com.ua/wp-content/uploads/2024/05/%D0%A4%D0%A3%D0%A2-%D0%9A%D0%9B%D0%90%D0%A1%D0%A1-%D0%9A%D0%90%D0%9F-%D0%9F%D0%95%D0%A0%D0%95%D0%94-%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F.jpg?fit=1027%2C1541&ssl=1',
            description: 'Чоловіча футболка з хлопка',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: generateId(),
            name: 'Книга "JavaScript для початківців"',
            price: 350,
            category: 'Книги',
            image: 'https://media.springernature.com/full/springer-static/cover-hires/book/978-1-4302-7218-2',
            description: 'Відмінний посібник для вивчення JavaScript',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    products = [...sampleProducts];
}

// Генерувати унікальний ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Відкрити модальне вікно для додавання товару
function openAddProductModal() {
    editingProductId = null;
    modalTitle.textContent = 'Додати новий товар';
    productForm.reset();
    document.getElementById('product-id').value = '';
    productModal.style.display = 'flex';
}

// Відкрити модальне вікно для редагування товару
function openEditProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    editingProductId = productId;
    modalTitle.textContent = 'Редагувати товар';

    // Заповнити форму даними товару
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-description').value = product.description || '';

    productModal.style.display = 'flex';
}

// Закрити модальне вікно
function closeModal() {
    productModal.style.display = 'none';
}

// Обробити відправку форми
function handleProductSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('product-id').value || generateId();
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const image = document.getElementById('product-image').value;
    const description = document.getElementById('product-description').value;
    const now = new Date();

    // Додати нову категорію, якщо її ще немає
    if (!categories.includes(category)) {
        categories.push(category);
        renderCategoryFilters();
    }

    if (editingProductId) {
        // Редагувати існуючий товар
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                price,
                category,
                image,
                description,
                updatedAt: now
            };

            showSnackbar(`Товар "${name}" (ID: ${editingProductId}) успішно оновлено`);
        }
    } else {
        // Додати новий товар
        products.push({
            id,
            name,
            price,
            category,
            image,
            description,
            createdAt: now,
            updatedAt: now
        });

        showSnackbar(`Товар "${name}" успішно додано`);
    }

    // Оновити інтерфейс
    updateUI();
    closeModal();
}

// Видалити товар
function deleteProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Анімація видалення
    const productElement = document.querySelector(`[data-id="${productId}"]`);
    if (productElement) {
        productElement.classList.add('fade-out');
        setTimeout(() => {
            products = products.filter(p => p.id !== productId);
            updateUI();
            showSnackbar(`Товар "${product.name}" успішно видалено`);
        }, 300);
    } else {
        products = products.filter(p => p.id !== productId);
        updateUI();
        showSnackbar(`Товар "${product.name}" успішно видалено`);
    }
}

// Оновити інтерфейс
function updateUI() {
    renderProductsList();
    updateTotalPrice();
}

// Відобразити список товарів
function renderProductsList() {
    if (products.length === 0) {
        productsList.innerHTML = '<p class="empty-message">Наразі список товарів пустий. Додайте новий товар.</p>';
        return;
    }

    productsList.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card fade-in';
        productElement.dataset.id = product.id;
        productElement.dataset.category = product.category;
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price.toFixed(2)} грн</p>
            <span class="category">${product.category}</span>
            <p>ID: ${product.id}</p>
            ${product.description ? `<p>${product.description}</p>` : ''}
            <div class="product-actions">
                <button class="edit-btn">Редагувати</button>
                <button class="delete-btn">Видалити</button>
            </div>
        `;

        // Додати обробники подій для кнопок
        productElement.querySelector('.edit-btn').addEventListener('click', () => {
            openEditProductModal(product.id);
        });

        productElement.querySelector('.delete-btn').addEventListener('click', () => {
            deleteProduct(product.id);
        });

        productsList.appendChild(productElement);
    });
}

// Оновити загальну вартість
function updateTotalPrice() {
    const total = products.reduce((sum, product) => sum + product.price, 0);
    totalPriceElement.textContent = total.toFixed(2);
}

// Відобразити кнопки фільтрів для категорій
function renderCategoryFilters() {
    // Очистити існуючі кнопки (крім кнопки "Всі товари")
    const existingButtons = Array.from(filtersContainer.querySelectorAll('button:not(.reset-filter)'));
    existingButtons.forEach(btn => btn.remove());

    // Додати кнопки для кожної категорії
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.textContent = category;
        btn.addEventListener('click', () => filterProductsByCategory(category));
        filtersContainer.appendChild(btn);
    });

    // Оновити список категорій у datalist
    const datalist = document.getElementById('categories');
    datalist.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        datalist.appendChild(option);
    });
}

// Фільтрувати товари за категорією
function filterProductsByCategory(category) {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        if (card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    showSnackbar(`Відфільтровано за категорією: ${category}`);
}

// Скинути фільтрацію
function resetFilters() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.display = 'block';
    });

    showSnackbar('Фільтрація скинута');
}

// Сортувати товари
function sortProducts(criteria) {
    let sortedProducts = [...products];

    switch (criteria) {
        case 'price':
            sortedProducts.sort((a, b) => a.price - b.price);
            showSnackbar('Товари відсортовано за ціною (від дешевих до дорогих)');
            break;
        case 'createdAt':
            sortedProducts.sort((a, b) => a.createdAt - b.createdAt);
            showSnackbar('Товари відсортовано за датою додавання (від старіших до новіших)');
            break;
        case 'updatedAt':
            sortedProducts.sort((a, b) => b.updatedAt - a.updatedAt);
            showSnackbar('Товари відсортовано за датою оновлення (від новіших до старіших)');
            break;
        default:
            break;
    }

    products = sortedProducts;
    renderProductsList();
}

// Скинути сортування
function resetSorting() {
    products.sort((a, b) => a.createdAt - b.createdAt);
    renderProductsList();
    showSnackbar('Сортування скинуто');
}

// Показати сповіщення
function showSnackbar(message) {
    snackbar.textContent = message;
    snackbar.className = 'snackbar show';

    setTimeout(() => {
        snackbar.className = snackbar.className.replace('show', '');
    }, 3000);
}

// Запустити додаток
document.addEventListener('DOMContentLoaded', init);

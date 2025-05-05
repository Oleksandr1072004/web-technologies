document.addEventListener('DOMContentLoaded', function() {
    // Переключення між вкладками
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.form');
    const successMessage = document.getElementById('success-message');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Видаляємо активний клас з усіх кнопок
            tabBtns.forEach(btn => btn.classList.remove('active'));
            // Додаємо активний клас до поточної кнопки
            this.classList.add('active');

            // Ховаємо всі форми та повідомлення про успіх
            forms.forEach(form => form.classList.remove('active'));
            successMessage.style.display = 'none';

            // Показуємо потрібну форму
            document.getElementById(`${tabId}-form`).classList.add('active');
        });
    });

    // Показати/приховати пароль
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Залежність міста від країни
    const countrySelect = document.getElementById('country');
    const citySelect = document.getElementById('city');

    const citiesByCountry = {
        ua: ['Вінниця', 'Дніпро', 'Донецьк', 'Житомир', 'Запоріжжя', 'Івано-Франківськ', 'Київ', 'Кропивницький', 'Луганськ', 'Луцьк', 'Львів', 'Маріуполь', 'Миколаїв', 'Одеса', 'Полтава', 'Рівне', 'Севастополь', 'Сімферополь', 'Суми', 'Тернопіль', 'Ужгород', 'Харків', 'Херсон', 'Хмельницький', 'Черкаси', 'Чернівці', 'Чернігів'],
        pl: ['Варшава', 'Краків', 'Гданськ', 'Вроцлав', 'Познань'],
        de: ['Берлін', 'Мюнхен', 'Гамбург', 'Кельн', 'Франкфурт'],
        fr: ['Париж', 'Марсель', 'Ліон', 'Тулуза', 'Ніцца']
    };

    countrySelect.addEventListener('change', function() {
        citySelect.innerHTML = '<option value="">Оберіть місто</option>';

        if (this.value) {
            citySelect.disabled = false;
            citiesByCountry[this.value].forEach(city => {
                const option = document.createElement('option');
                option.value = city.toLowerCase();
                option.textContent = city;
                citySelect.appendChild(option);
            });
        } else {
            citySelect.disabled = true;
        }
    });

    // Функція для збереження даних у локальне сховище (імітація збереження в txt файл)
    function saveUserData(userData) {
        // Отримуємо існуючі дані або створюємо новий порожній масив
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Додаємо нового користувача
        users.push(userData);

        // Зберігаємо оновлений масив користувачів
        localStorage.setItem('users', JSON.stringify(users));

        // Також створюємо та завантажуємо текстовий файл
        const userDataText = JSON.stringify(userData, null, 2);
        const blob = new Blob([userDataText], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `user_${userData.email.replace('@', '_at_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Валідація форми реєстрації
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // Валідація імені
        const firstName = document.getElementById('first-name');
        if (!firstName.value || firstName.value.length < 3 || firstName.value.length > 15) {
            showError(firstName, 'Ім\'я повинно містити від 3 до 15 символів');
            isValid = false;
        } else {
            showSuccess(firstName);
        }

        // Валідація прізвища
        const lastName = document.getElementById('last-name');
        if (!lastName.value || lastName.value.length < 3 || lastName.value.length > 15) {
            showError(lastName, 'Прізвище повинно містити від 3 до 15 символів');
            isValid = false;
        } else {
            showSuccess(lastName);
        }

        // Валідація email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showError(email, 'Будь ласка, введіть коректний email');
            isValid = false;
        } else {
            showSuccess(email);
        }

        // Валідація пароля
        const password = document.getElementById('password');
        if (!password.value || password.value.length < 6) {
            showError(password, 'Пароль повинен містити не менше 6 символів');
            isValid = false;
        } else {
            showSuccess(password);
        }

        // Валідація підтвердження пароля
        const confirmPassword = document.getElementById('confirm-password');
        if (confirmPassword.value !== password.value) {
            showError(confirmPassword, 'Паролі не співпадають');
            isValid = false;
        } else {
            showSuccess(confirmPassword);
        }

        // Валідація телефону
        const phone = document.getElementById('phone');
        const phoneRegex = /^\+380\d{9}$/;
        if (!phoneRegex.test(phone.value)) {
            showError(phone, 'Будь ласка, введіть коректний номер телефону (+380XXXXXXXXX)');
            isValid = false;
        } else {
            showSuccess(phone);
        }

        // Валідація дати народження
        const birthDate = document.getElementById('birth-date');
        if (!birthDate.value) {
            showError(birthDate, 'Будь ласка, введіть дату народження');
            isValid = false;
        } else {
            const birthDateObj = new Date(birthDate.value);
            const today = new Date();
            const age = today.getFullYear() - birthDateObj.getFullYear();

            if (birthDateObj > today) {
                showError(birthDate, 'Дата народження не може бути у майбутньому');
                isValid = false;
            } else if (age < 12) {
                showError(birthDate, 'Ви повинні бути старше 12 років для реєстрації');
                isValid = false;
            } else {
                showSuccess(birthDate);
            }
        }

        // Валідація статі
        const gender = document.querySelector('input[name="gender"]:checked');
        if (!gender) {
            document.querySelector('.radio-group + .error-message').textContent = 'Будь ласка, оберіть стать';
            isValid = false;
        } else {
            document.querySelector('.radio-group + .error-message').textContent = '';
        }

        // Валідація країни
        if (!countrySelect.value) {
            showError(countrySelect, 'Будь ласка, оберіть країну');
            isValid = false;
        } else {
            showSuccess(countrySelect);
        }

        // Валідація міста
        if (!citySelect.value) {
            showError(citySelect, 'Будь ласка, оберіть місто');
            isValid = false;
        } else {
            showSuccess(citySelect);
        }

        // Валідація умов використання
        const terms = document.getElementById('terms');
        if (!terms.checked) {
            document.querySelector('.terms .error-message').textContent = 'Ви повинні погодитись з умовами використання';
            isValid = false;
        } else {
            document.querySelector('.terms .error-message').textContent = '';
        }

        // Якщо форма валідна
        if (isValid) {
            // Створюємо об'єкт з даними користувача
            const userData = {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                password: password.value, // В реальному проекті пароль має бути захешований
                phone: phone.value,
                birthDate: birthDate.value,
                gender: gender.value,
                country: countrySelect.value,
                city: citySelect.value,
                registrationDate: new Date().toISOString()
            };

            // Зберігаємо дані користувача
            saveUserData(userData);

            // Показуємо повідомлення про успіх
            successMessage.style.display = 'block';
            registerForm.style.display = 'none';

            // Очищаємо форму та переходимо на форму входу через 3 секунди
            setTimeout(() => {
                registerForm.reset();
                successMessage.style.display = 'none';
                registerForm.style.display = 'block';

                // Автоматично переключаємось на вкладку входу
                document.querySelector('.tab-btn[data-tab="login"]').click();
            }, 3000);
        }
    });

    // Валідація форми авторизації
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // Валідація імені користувача
        const username = document.getElementById('login-username');
        if (!username.value) {
            showError(username, 'Будь ласка, введіть email');
            isValid = false;
        } else {
            showSuccess(username);
        }

        // Валідація пароля
        const password = document.getElementById('login-password');
        if (!password.value || password.value.length < 6) {
            showError(password, 'Пароль повинен містити не менше 6 символів');
            isValid = false;
        } else {
            showSuccess(password);
        }

        // Якщо форма валідна
        if (isValid) {
            // Перевірка логіна та пароля
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === username.value && u.password === password.value);

            if (user) {
                // Успішний вхід
                alert(`Ласкаво просимо, ${user.firstName} ${user.lastName}!`);
                loginForm.reset();
            } else {
                // Невірний логін або пароль
                alert('Невірний email або пароль!');
            }
        }
    });

    // Функції для відображення помилок/успіху
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        input.classList.add('invalid');
        input.classList.remove('valid');
        errorMessage.textContent = message;
    }

    function showSuccess(input) {
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        input.classList.add('valid');
        input.classList.remove('invalid');
        errorMessage.textContent = '';
    }
});

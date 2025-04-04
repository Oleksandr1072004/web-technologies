// Глобальні змінні
let todos = [];
let currentTodoId = 1;

// DOM елементи
const todoList = document.getElementById('todo-list');
const newTodoInput = document.getElementById('new-todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const sortButtons = document.querySelectorAll('.sort-btn');
const resetButton = document.querySelector('.reset');

// Початкові дані (для прикладу)
const initialTodos = [
    {
        id: 'todo-1',
        text: 'Вивчити JavaScript',
        completed: false,
        createdAt: new Date('2023-01-10'),
        updatedAt: new Date('2023-01-10')
    },
    {
        id: 'todo-2',
        text: 'Зробити домашнє завдання',
        completed: true,
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-01-16')
    },
    {
        id: 'todo-3',
        text: 'Приготувати обід',
        completed: false,
        createdAt: new Date('2023-01-20'),
        updatedAt: new Date('2023-01-20')
    }
];

// Ініціалізація
function init() {
    // Додаємо початкові завдання
    initialTodos.forEach(todo => {
        addTodo(todo);
    });

    renderTodos();
}

// Додавання нового завдання
function addTodo(todoData) {
    const newTodo = {
        id: todoData.id || `todo-${currentTodoId++}`,
        text: todoData.text,
        completed: todoData.completed || false,
        createdAt: todoData.createdAt || new Date(),
        updatedAt: todoData.updatedAt || new Date()
    };

    todos.push(newTodo);
    renderTodos();
}

// Видалення завдання
function deleteTodo(todoId) {
    todos = todos.filter(todo => todo.id !== todoId);
    renderTodos();
}

// Редагування завдання
function updateTodo(todoId, updatedData) {
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    if (todoIndex !== -1) {
        todos[todoIndex] = {
            ...todos[todoIndex],
            ...updatedData,
            updatedAt: new Date()
        };
        renderTodos();
    }
}

// Перемикання стану завдання (виконано/не виконано)
function toggleTodoCompletion(todoId) {
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
        updateTodo(todoId, {
            completed: !todo.completed
        });
    }
}

// Відображення завдань
function renderTodos(filteredTodos = todos) {
    todoList.innerHTML = '';

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<li class="empty-message">Список завдань порожній. Додайте перше завдання!</li>';
        return;
    }

    filteredTodos.forEach(todo => {
        const todoElement = document.createElement('li');
        todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoElement.dataset.id = todo.id;

        todoElement.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <div class="todo-text" contenteditable="false">${todo.text}</div>
            <div class="todo-date">Додано: ${todo.createdAt.toLocaleDateString()}<br>
            Оновлено: ${todo.updatedAt.toLocaleDateString()}</div>
            <div class="todo-actions">
                <button class="edit">Редагувати</button>
                <button class="delete">Видалити</button>
            </div>
        `;

        todoList.appendChild(todoElement);

        // Додаємо обробники подій
        const checkbox = todoElement.querySelector('.todo-checkbox');
        const textElement = todoElement.querySelector('.todo-text');
        const editButton = todoElement.querySelector('.edit');
        const deleteButton = todoElement.querySelector('.delete');

        checkbox.addEventListener('change', () => {
            toggleTodoCompletion(todo.id);
        });

        textElement.addEventListener('click', () => {
            if (textElement.getAttribute('contenteditable') === 'false') {
                textElement.setAttribute('contenteditable', 'true');
                textElement.focus();
            }
        });

        textElement.addEventListener('blur', () => {
            textElement.setAttribute('contenteditable', 'false');
            if (textElement.textContent.trim() !== todo.text) {
                updateTodo(todo.id, {
                    text: textElement.textContent.trim()
                });
            }
        });

        textElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                textElement.blur();
            }
        });

        deleteButton.addEventListener('click', () => {
            deleteTodo(todo.id);
        });

        editButton.addEventListener('click', () => {
            textElement.setAttribute('contenteditable', 'true');
            textElement.focus();
        });
    });
}

// Сортування завдань
function sortTodos(sortBy) {
    let sortedTodos = [...todos];

    switch (sortBy) {
        case 'added':
            sortedTodos.sort((a, b) => a.createdAt - b.createdAt);
            break;
        case 'completed':
            sortedTodos.sort((a, b) => {
                if (a.completed === b.completed) return 0;
                return a.completed ? 1 : -1;
            });
            break;
        case 'updated':
            sortedTodos.sort((a, b) => b.updatedAt - a.updatedAt);
            break;
        default:
            break;
    }

    renderTodos(sortedTodos);
}

// Обробники подій
addTodoBtn.addEventListener('click', () => {
    const text = newTodoInput.value.trim();
    if (text) {
        addTodo({ text });
        newTodoInput.value = '';
    }
});

newTodoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const text = newTodoInput.value.trim();
        if (text) {
            addTodo({ text });
            newTodoInput.value = '';
        }
    }
});

// Обробники подій для кнопок сортування
sortButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        sortTodos(e.target.dataset.sort);
    });
});

// Обробник події для кнопки скидання
resetButton.addEventListener('click', () => {
    renderTodos();
});

// Запуск додатка
init();
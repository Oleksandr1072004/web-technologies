document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо всі елементи, які можна перетягувати
    const items = document.querySelectorAll('.kanban-item');
    const columns = document.querySelectorAll('.kanban-column');

    // Додаємо обробники подій для кожного елементу
    items.forEach(item => {
        item.addEventListener('dragstart', dragStart);
        item.addEventListener('dragend', dragEnd);
    });

    // Додаємо обробники подій для кожної колонки
    columns.forEach(column => {
        column.addEventListener('dragover', dragOver);
        column.addEventListener('dragenter', dragEnter);
        column.addEventListener('dragleave', dragLeave);
        column.addEventListener('drop', drop);
    });

    // Змінна для зберігання елементу, який перетягується
    let draggedItem = null;

    // Функції для обробки подій
    function dragStart() {
        draggedItem = this;
        setTimeout(() => {
            this.classList.add('dragging');
        }, 0);
    }

    function dragEnd() {
        this.classList.remove('dragging');
        draggedItem = null;
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
        this.classList.add('highlight');
    }

    function dragLeave() {
        this.classList.remove('highlight');
    }

    function drop() {
        this.classList.remove('highlight');

        // Перевіряємо, чи є елемент для перетягування
        if (draggedItem) {
            // Знаходимо контейнер з елементами
            const itemsContainer = this.querySelector('.kanban-items');

            // Визначаємо позицію для вставки
            const afterElement = getDragAfterElement(itemsContainer, e.clientY);

            if (afterElement) {
                itemsContainer.insertBefore(draggedItem, afterElement);
            } else {
                itemsContainer.appendChild(draggedItem);
            }
        }
    }

    // Допоміжна функція для визначення позиції вставки
    function getDragAfterElement(container, y) {
        // Отримуємо всі елементи, крім того, який перетягується
        const draggableElements = [...container.querySelectorAll('.kanban-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
class Slider {
    constructor(container, options = {}) {
        // Конфігурація за замовчуванням
        const defaultOptions = {
            slides: [
                { content: 'Слайд 1', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                { content: 'Слайд 2', background: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)' },
                { content: 'Слайд 3', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
                { content: 'Слайд 4', background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' }
            ],
            transitionDuration: 500,
            autoplay: true,
            autoplayInterval: 3000,
            showArrows: true,
            showPagination: true
        };

        // Об'єднання параметрів з дефолтними
        this.options = { ...defaultOptions, ...options };
        this.container = container;
        this.slider = container.querySelector('.slider');
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.isTransitioning = false;

        // Ініціалізація
        this.init();
    }

    init() {
        // Створення слайдів
        this.createSlides();

        // Додавання стрілок
        if (this.options.showArrows) {
            this.prevArrow = this.container.querySelector('.prev-arrow');
            this.nextArrow = this.container.querySelector('.next-arrow');

            this.prevArrow.addEventListener('click', () => this.prevSlide());
            this.nextArrow.addEventListener('click', () => this.nextSlide());
        } else {
            this.container.querySelectorAll('.slider-arrow').forEach(arrow => arrow.style.display = 'none');
        }

        // Додавання пагінації
        if (this.options.showPagination) {
            this.pagination = this.container.querySelector('.slider-pagination');
            this.createPagination();
        } else {
            this.pagination.style.display = 'none';
        }

        // Обробка клавіатурних подій
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Автопрокрутка
        if (this.options.autoplay) {
            this.startAutoplay();

            // Зупинка автопрокрутки при наведенні
            this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
            this.slider.addEventListener('mouseleave', () => this.startAutoplay());
        }

        // Показ першого слайду
        this.goToSlide(0);
    }

    createSlides() {
        this.slider.innerHTML = '';

        this.options.slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide';
            slideElement.style.background = slide.background;

            if (typeof slide.content === 'string') {
                slideElement.textContent = slide.content;
            } else {
                slideElement.appendChild(slide.content);
            }

            this.slider.appendChild(slideElement);
        });
    }

    createPagination() {
        this.pagination.innerHTML = '';

        this.options.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'pagination-dot';
            if (index === 0) dot.classList.add('active');

            dot.addEventListener('click', () => this.goToSlide(index));
            this.pagination.appendChild(dot);
        });
    }

    updatePagination() {
        const dots = this.pagination.querySelectorAll('.pagination-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    goToSlide(index) {
        if (this.isTransitioning) return;

        this.isTransitioning = true;

        // Оновлення поточного індексу з урахуванням циклічності
        this.currentIndex = (index + this.options.slides.length) % this.options.slides.length;

        // Оновлення позиції слайдера
        this.slider.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        // Оновлення пагінації
        if (this.options.showPagination) {
            this.updatePagination();
        }

        // Завершення переходу
        setTimeout(() => {
            this.isTransitioning = false;
        }, this.options.transitionDuration);
    }

    nextSlide() {
        this.goToSlide(this.currentIndex + 1);
    }

    prevSlide() {
        this.goToSlide(this.currentIndex - 1);
    }

    startAutoplay() {
        if (!this.options.autoplay) return;

        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.options.autoplayInterval);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Ініціалізація слайдера при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.slider-container');

    // Приклад конфігурації з зображеннями
    const slider = new Slider(sliderContainer, {
        slides: [
            {
                content: "Слайд 1",
                background: 'blue'
            },
            {
                content: "Слайд 2",
                background: 'green'
            },
            {
                content: "Слайд 3",
                background: 'purple'
            },
            {
                content: "Слайд 4",
                background: 'red'
            }
        ],
        transitionDuration: 600,
        autoplay: true,
        autoplayInterval: 4000,
        showArrows: true,
        showPagination: true
    });
});
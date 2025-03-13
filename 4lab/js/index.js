document.addEventListener("DOMContentLoaded", function () {
    // Массив с рекламными баннерами
    const ads = [
        { text: "Будете самым модным среди друзей, наш адрес...", image: "./img/img1.jpg" },
        { text: "Сибирские знахари делятся успехом мужской силы, нужно просто...", image: "./img/img2.jpg" },
        { text: "Стали миллионерами за один вечер, вот что мы сделали...", image: "./img/img3.jpg" },
        { text: "Поздравляем! Вы выиграли этот телефон, чтобы забрать...", image: "./img/img4.jpg" },
        { text: "Консультация только с проверенными врачами, наша больница...", image: "./img/img5.jpg" },
        { text: "Глисты вышли за 2 дня, все что нужно это...", image: "./img/img6.jpg" },
    ];

    // Функция для отображения рекламных баннеров
    function displayAllAds() {
        const adContainer = document.querySelector('.ad_container');
        adContainer.innerHTML = ''; 
        const shuffledAds = ads.sort(() => Math.random() - 0.5);

        shuffledAds.forEach(ad => {
            const adCard = document.createElement('div');
            adCard.classList.add('ad_card');

            const adImage = document.createElement('img');
            adImage.src = ad.image;
            adImage.alt = "Рекламное изображение";

            const adText = document.createElement('p');
            adText.textContent = ad.text;

            adCard.appendChild(adImage);
            adCard.appendChild(adText);
            adContainer.appendChild(adCard);
        });
    }

    let reviews = []; // Массив для хранения отзывов

    // Функция загрузки отзывов из cookies
    function loadReviewsFromCookies() {
        const savedReviews = Cookies.get('userReviews');
        
        if (savedReviews) {
            reviews = JSON.parse(savedReviews);
            console.log("Загруженные отзывы из cookies:", reviews);
        } else {
            console.log("Отзывы в cookies отсутствуют.");
        }
    }

    // Функция сохранения отзывов в cookies
    function saveReviewsToCookies() {
        Cookies.set('userReviews', JSON.stringify(reviews), { expires: 7, path: '/' });
        console.log("Отзывы сохранены в cookies:", JSON.stringify(reviews));
    }

    // Функция для конвертации изображения в Base64
    function convertImageToBase64(file, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // Функция отображения отзывов
    function renderReviews(reviewsList) {
        const reviewContainer = document.getElementById('review-container');
        reviewContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых отзывов

        reviewsList.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review');
            reviewElement.innerHTML = `  
                <p><strong>${review.name}</strong> (${new Date(review.date).toLocaleDateString()})</p>
                <p>Оценка: ${review.rating} ★</p>
                <p>${review.text}</p>
                ${review.image ? `<img src="${review.image}" alt="Изображение отзыва" width="100">` : ''}
                <hr>
            `;
            reviewContainer.appendChild(reviewElement);
        });

        // Обновление фона контейнера отзыва, чтобы он растягивался
        reviewContainer.style.backgroundColor = "#f4f4f4";  // Пример обновления фона
    }

    function stretchContentBackground() {
        const leftContainer = document.querySelector('.left-side');
        const mainContent = document.querySelector('.main_content');
    
        if (leftContainer && mainContent) {
            // Получаем максимальную высоту между left-side и main_content
            const maxHeight = Math.max(leftContainer.offsetHeight, mainContent.offsetHeight);
            
            // Устанавливаем одинаковую высоту для обоих контейнеров
            leftContainer.style.height = `${maxHeight + 150}px`; // Можно добавить небольшой отступ
            mainContent.style.height = `${maxHeight + 150}px`; // Можно добавить небольшой отступ
        }
    }

    // Функция добавления нового отзыва
    function addReview() {
        const name = document.getElementById('name').value.trim();
        const text = document.getElementById('text').value.trim();
        const rating = parseInt(document.getElementById('rating').value);
        const imageInput = document.getElementById('image').files[0];
    
        if (!name || !text || isNaN(rating) || rating < 1 || rating > 5) {
            alert('Пожалуйста, заполните все поля и выберите корректную оценку (1-5).');
            return;
        }
    
        const imageUrl = imageInput ? URL.createObjectURL(imageInput) : null;
    
        const newReview = {
            name,
            text,
            rating,
            date: new Date().toISOString(),
            image: imageUrl,
        };
    
        reviews.push(newReview);  // Добавляем новый отзыв в массив
        saveReviewsToCookies();  // Сохраняем обновленный массив отзывов в cookies
        renderReviews(reviews);  // Отображаем обновленные отзывы
        document.getElementById('review-form').reset();  // Очищаем форму
        stretchContentBackground();
    }

    // Фильтрация отзывов по рейтингу
    document.getElementById('filter-rating').addEventListener('change', function () {
        const selectedRating = this.value;
        const filteredReviews = selectedRating === "all" ? reviews : reviews.filter(review => review.rating == selectedRating);
        renderReviews(filteredReviews);
    });

    // Сортировка отзывов
    document.getElementById('sort-reviews').addEventListener('change', function () {
        const sortBy = this.value;
        const sortedReviews = [...reviews];

        if (sortBy === "date") {
            sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === "rating") {
            sortedReviews.sort((a, b) => b.rating - a.rating);
        }

        renderReviews(sortedReviews);
    });

    // Тема сайта
    const themeToggleButton = document.getElementById('theme-turn');
    const themeIcon = document.getElementById('theme-icon');

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.src = './img/sun.png';
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.src = './img/moon.png';
        }
    }

    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme || 'light');

    themeToggleButton.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme');
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // Выравнивание высоты колонок
    function equalizeColumns() {
        const leftContainer = document.querySelector('.left-side');
        const mainContent = document.querySelector('.main_content');

        if (leftContainer && mainContent) {
            const maxHeight = Math.max(leftContainer.offsetHeight, mainContent.offsetHeight);
            leftContainer.style.height = `${maxHeight}px`;
            mainContent.style.height = `${maxHeight}px`;
        }
    }

    // Инициализация
    loadReviewsFromCookies();
    renderReviews(reviews);
    displayAllAds();
    equalizeColumns();

    // Добавляем обработчик для кнопки отправки отзыва
    document.getElementById('submit-review').addEventListener('click', addReview);
});

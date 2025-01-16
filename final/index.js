


let currentPage = 1; // Текущая страница
const itemsPerPage = 8; // Количество товаров на странице



// Загрузка следующей страницы
function loadMoreProducts() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    const productsToRender = productsData.slice(start, end);

    renderProducts(productsToRender);
    currentPage++;

    // Скрываем кнопку, если все товары загружены
    if (end >= productsData.length) {
        document.querySelector("button[onclick='loadMoreProducts()']").style.display = "none";
    }
}

// Фильтрация и сортировка
function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll(".sidebar input[type='checkbox']:checked")).map(input => input.parentElement.textContent.trim());
    const priceFrom = parseInt(document.querySelector(".sidebar input[type='number'][value='100']").value) || 0;
    const priceTo = parseInt(document.querySelector(".sidebar input[type='number'][value='5000']").value) || Infinity;
    const onlyDiscounts = document.querySelector(".sidebar input[type='checkbox'][value='Только товары со скидками']")?.checked || false;

    
 

    renderProducts(filteredProducts.slice(0, itemsPerPage));
    currentPage = 2;

    // Показать или скрыть кнопку "Загрузить ещё"
    const loadMoreButton = document.querySelector("button[onclick='loadMoreProducts()']");
    if (filteredProducts.length > itemsPerPage) {
        loadMoreButton.style.display = "block";
    } else {
        loadMoreButton.style.display = "none";
    }
}

// События
document.querySelector(".sidebar").addEventListener("input", applyFilters);
document.querySelector(".catalog select").addEventListener("change", applyFilters);




async function loadDishes() {
    try {
        const response = await fetch(
            'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?api_key=701002ea-0438-450a-a625-ee55a139c880'
        );
        if (!response.ok) {
            throw new Error("Ошибка загрузки: ${response.statusText}");
        }
        const menu = await response.json();
        menu.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
        console.log(menu);
        return menu;
    } catch (error) {
        console.error('Ошибка при загрузке блюд:', error);
        alert('Не удалось загрузить меню. Попробуйте обновить страницу.');
        return [];
    }
}

window.loadDishes = loadDishes;

const productGrid = document.getElementById("productGrid");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const sortSelect = document.getElementById("sortSelect");

let products = []; // Полный массив товаров
let displayedProducts = 0; // Количество отображённых товаров
const productsPerPage = 6; // Количество товаров, отображаемых за одну загрузку

// Функция загрузки данных
async function fetchProducts() {
    try {
        const response = await fetch(
            'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?api_key=701002ea-0438-450a-a625-ee55a139c880'
        );
        if (!response.ok) {
            throw new Error("Ошибка загрузки: ${response.statusText}");
        }

        const data = await response.json();
        return data.map((item) => {
            const discount = item.actual_price && item.discount_price
                ? Math.round(((item.actual_price - item.discount_price) / item.actual_price) * 100)
                : null;

            return {
                id: item.id,
                name: item.name,
                image: item.image_url,
                rating: item.rating,
                price: item.actual_price,
                discountPrice: item.discount_price || null,
                discount: discount, // Добавляем процент скидки
                mainCategory: item.main_category,
                subCategory: item.sub_category,
            };
        });
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        alert('Не удалось загрузить товары. Попробуйте позже.');
        return [];
    }
}

// Функция для рендеринга товаров
function renderProducts() {
    const productGrid = document.getElementById("productGrid");
    if (!productGrid) {
        console.error("Элемент с id 'productGrid' не найден.");
        return;
    }
    
    const fragment = document.createDocumentFragment();

    const toRender = products.slice(displayedProducts, displayedProducts + productsPerPage);

    toRender.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.setAttribute("good-id", product.id);
        const priceHTML = product.discountPrice
            ? `<span class="price-original">${product.price.toFixed(2)}₽</span>
               <span class="price-discount">${product.discountPrice.toFixed(2)}₽</span>
               <span class="discount-percent">-${product.discount}%</span>`
            : `<span class="price">${product.price.toFixed(2)}₽</span>`;

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="rating">⭐️ ${product.rating}</div>
            <div class="price-container">${priceHTML}</div>
            <button class="add" data-id="${product.id}">Добавить</button>
        `;

        fragment.appendChild(card);
    });

    productGrid.appendChild(fragment);
    displayedProducts += toRender.length;

    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (displayedProducts >= products.length && loadMoreBtn) {
        loadMoreBtn.style.display = "none";
    }
}



// Функция для сортировки товаров
function sortProducts() {
    const sortValue = sortSelect.value;

    if (sortValue === "price-asc") {
        products.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortValue === "price-desc") {
        products.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortValue === "rating-desc") {
        // Сортировка по убыванию рейтинга
        products.sort((a, b) => b.rating - a.rating);
    } else if (sortValue === "rating-asc") {
        // Сортировка по возрастанию рейтинга
        products.sort((a, b) => a.rating - b.rating);
    }

    // Перерисовываем товары
    productGrid.innerHTML = "";
    displayedProducts = 0;
    renderProducts();
}

// Функция инициализации каталога
async function initCatalog() {
    products = await fetchProducts(); // Загружаем данные
    renderProducts(); // Отображаем первые товары
}

// Функция для добавления товара в корзину

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('add')) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Найти товар по ID
    const goodElement = event.target.closest('.product-card');
    if (goodElement) {
        const goodId = parseInt(goodElement.getAttribute('good-id'), 10);
        if (!cart.includes(goodId)) {
            cart.push(goodId);
            localStorage.setItem('cart', JSON.stringify(cart));
            showNotification(`Товар успешно добавлен в корзину!`);
        }
    }
    }
});
// Назначение обработчиков на кнопки "Добавить"
document.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON' && event.target.dataset.id) {
        const productId = parseInt(event.target.dataset.id, 10);
        
    }
});
function showNotification(message) {
    const notificationContainer = document.getElementById('notifications');
    
    // Создаем новый элемент для уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Вставляем сообщение и кнопку закрытия
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-btn">✖</button>
    `;

    // Добавляем уведомление в контейнер
    notificationContainer.appendChild(notification);
    notificationContainer.style.display = 'block';

    // Находим кнопку закрытия внутри уведомления и добавляем обработчик события
    const closeButton = notification.querySelector('.close-btn');
    closeButton.addEventListener('click', () => {
        notification.remove();
        if (notificationContainer.childElementCount === 0) {
            notificationContainer.style.display = 'none';
        }
    });
}

// Добавляем контейнер для подсказок под строкой поиска
const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.createElement("div");
suggestionsBox.id = "suggestionsBox";
suggestionsBox.style.position = "absolute";
suggestionsBox.style.backgroundColor = "white";
suggestionsBox.style.border = "1px solid #ccc";
suggestionsBox.style.width = `${searchInput.offsetWidth}px`;
suggestionsBox.style.display = "none";
suggestionsBox.style.zIndex = "1000";
document.querySelector(".search-bar").appendChild(suggestionsBox);

// Обработчик ввода в строку поиска
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
        suggestionsBox.style.display = "none";
        return;
    }

    // Фильтруем товары по запросу
    const matchingProducts = products.filter(product =>
        product.name.toLowerCase().includes(query)
    );

    // Показываем подсказки
    showSuggestions(matchingProducts, query);
});

// Обработчик ввода в строку поиска
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
        suggestionsBox.style.display = "none";
        return;
    }

    // Фильтруем товары по запросу
    const matchingProducts = products.filter(product =>
        product.name.toLowerCase().includes(query)
    );

    // Показываем подсказки
    showSuggestions(matchingProducts, query);
});

// Обработчик нажатия кнопки поиска
document.querySelector(".search-bar button").addEventListener("click", () => {
    const query = searchInput.value.toLowerCase().trim();
    if (query) {
        searchProducts(query); // Выполняем поиск товаров
    }
});

// Функция для отображения подсказок
// Функция для получения вариантов автодополнения
async function fetchSuggestions(query) {
    try {
        const response = await fetch(
            `https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/autocomplete?query=${encodeURIComponent(query)}&api_key=701002ea-0438-450a-a625-ee55a139c880`
        );
        if (!response.ok) {
            throw new Error(`Ошибка загрузки автодополнений: ${response.statusText}`);
        }
        const suggestions = await response.json();
        console.log('Ответ сервера для автодополнения:', suggestions);
        return suggestions; // Возвращаем массив строк с подсказками
    } catch (error) {
        console.error('Ошибка при загрузке вариантов автодополнения:', error);
        return [];
    }
}



// Обработчик ввода в строку поиска
searchInput.addEventListener("input", async () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
        suggestionsBox.style.display = "none";
        return;
    }

    // Получаем варианты автодополнения от сервера
    const suggestions = await fetchSuggestions(query);

    // Показываем подсказки
    showSuggestions(suggestions, query);
});

// Функция для отображения подсказок
function showSuggestions(suggestions, query) {
    suggestionsBox.innerHTML = ""; // Очищаем предыдущие подсказки

    if (suggestions.length === 0) {
        suggestionsBox.style.display = "none";
        return;
    }

    // Получаем размеры и позицию строки поиска
    const searchInputRect = searchInput.getBoundingClientRect();

    // Устанавливаем позицию подсказок прямо под строкой поиска
    suggestionsBox.style.top = `${searchInputRect.bottom + window.scrollY}px`;
    suggestionsBox.style.left = `${searchInputRect.left + window.scrollX}px`;
    suggestionsBox.style.width = `${searchInputRect.width}px`;

    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement("div");
        suggestionItem.className = "suggestion-item";
        suggestionItem.textContent = suggestion;

        // Обработчик клика на подсказку
        suggestionItem.addEventListener("click", () => {
            searchInput.value = suggestion; // Устанавливаем текст из подсказки
            suggestionsBox.style.display = "none"; // Скрываем подсказки
        });

        suggestionsBox.appendChild(suggestionItem);
    });

    suggestionsBox.style.display = "block";
}

// Обработчик нажатия кнопки поиска
// Обработчик нажатия кнопки поиска
async function searchProducts(query) {
    try {
        const response = await fetch(
            `https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?query=${encodeURIComponent(query)}&api_key=701002ea-0438-450a-a625-ee55a139c880`
        );
        if (!response.ok) {
            throw new Error(`Ошибка загрузки результатов поиска: ${response.statusText}`);
        }
        const matchingProducts = await response.json();

        if (matchingProducts.length === 0) {
            productGrid.innerHTML = "<p>Нет товаров, соответствующих вашему запросу.</p>";
            return;
        }

        products = matchingProducts.map((item) => {
            const discount = item.actual_price && item.discount_price
                ? Math.round((1 - item.discount_price / item.actual_price) * 100)
                : null;

            return {
                id: item.id,
                name: item.name,
                image: item.image_url,
                rating: item.rating,
                price: item.actual_price,
                discountPrice: item.discount_price || null,
                discount: discount,
                mainCategory: item.main_category,
                subCategory: item.sub_category,
            };
        });

        displayedProducts = 0;
        productGrid.innerHTML = ""; // Очищаем текущую сетку товаров
        sortProducts(); // Сортировка по текущему значению
        renderProducts(); // Перерисовка товаров
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        productGrid.innerHTML = "<p>Произошла ошибка при загрузке товаров. Попробуйте позже.</p>";
    }
}



// Обработчик нажатия кнопки поиска
document.querySelector(".search-bar button").addEventListener("click", () => {
    const query = searchInput.value.toLowerCase().trim();
    if (query) {
        searchProducts(query); // Выполняем поиск товаров
    }
});





// Обработчики событий
loadMoreBtn.addEventListener("click", renderProducts);
sortSelect.addEventListener("change", sortProducts);

// Инициализация каталога
initCatalog();
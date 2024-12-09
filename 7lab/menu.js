let selectedItems = {
    soup: null,
    mainDish: null,
    drink: null,
    starter: null,
    dessert: null
};
document.addEventListener("DOMContentLoaded", function() {
    const orderSummaryContent = document.getElementById("order-summary-content");
    const emptyOrderMessage = document.getElementById("empty-order");
    const soupSummary = document.getElementById("soup-summary");
    const mainDishSummary = document.getElementById("main-dish-summary");
    const drinkSummary = document.getElementById("drink-summary");
    const starterSummary = document.getElementById("starter-summary");
    const dessertSummary = document.getElementById("dessert-summary");
    const form = document.getElementById("order-form-container");
    form.addEventListener("submit", validateOrder);
    
    const soupSelected = document.getElementById("soup-selected");
    const mainDishSelected = document.getElementById("main-dish-selected");
    const drinkSelected = document.getElementById("drink-selected");
    const starterSelected = document.getElementById("starter-selected");
    const dessertSelected = document.getElementById("dessert-selected");

    
    const totalAmountElement = document.getElementById("total-amount"); // Определяем элемент для отображения суммы

  

    
    function updateOrderSummary() {
        let anyItemSelected = false;
        let totalAmount = 0; // Инициализируем общую сумму

        // Обновляем отображение для супов
        if (selectedItems.soup) { 
            soupSelected.textContent = `${selectedItems.soup.name} - ${selectedItems.soup.price}₽`;
            soupSummary.style.display = "block";
            totalAmount += selectedItems.soup.price; // Добавляем к общей сумме
            anyItemSelected = true;
        } else {
            soupSelected.textContent = "Блюдо не выбрано";
            soupSummary.style.display = "block";
        }
        
        // Обновляем отображение для главного блюда
        if (selectedItems.mainDish) {
            mainDishSelected.textContent = `${selectedItems.mainDish.name} - ${selectedItems.mainDish.price}₽`;
            mainDishSummary.style.display = "block";
            totalAmount += selectedItems.mainDish.price; // Добавляем к общей сумме
            anyItemSelected = true;
        } else {
            mainDishSelected.textContent = "Блюдо не выбрано";
            mainDishSummary.style.display = "block";
        }
        
        // Обновляем отображение для напитка
        if (selectedItems.drink) {
            drinkSelected.textContent = `${selectedItems.drink.name} - ${selectedItems.drink.price}₽`;
            drinkSummary.style.display = "block";
            totalAmount += selectedItems.drink.price; // Добавляем к общей сумме
            anyItemSelected = true;
        } else {
            drinkSelected.textContent = "Напиток не выбран";
            drinkSummary.style.display = "block";
        }
        
        // Обновляем отображение для салатов и стартеров
        if (selectedItems.starter) {
            starterSelected.textContent = `${selectedItems.starter.name} - ${selectedItems.starter.price}₽`;
            starterSummary.style.display = "block";
            totalAmount += selectedItems.starter.price; // Добавляем к общей сумме
            anyItemSelected = true;
        } else {
            starterSelected.textContent = "Салат не выбран";
            starterSummary.style.display = "block";
        }
        
        // Обновляем отображение для десертов
        if (selectedItems.dessert) {
            dessertSelected.textContent = `${selectedItems.dessert.name} - ${selectedItems.dessert.price}₽`;
            dessertSummary.style.display = "block";
            totalAmount += selectedItems.dessert.price; // Добавляем к общей сумме
            anyItemSelected = true;
        } else {
            dessertSelected.textContent = "Десерт не выбран";
            dessertSummary.style.display = "block";
        }

        // Показываем или скрываем сообщение "Ничего не выбрано"
        emptyOrderMessage.style.display = anyItemSelected ? "none" : "block";
        
        // Обновляем элемент с общей суммой
        totalAmountElement.textContent = `Сумма заказа: ${totalAmount}₽`; // Обновление суммы
    }

    function filterDishes(category, kind) {
        const dishes = document.querySelectorAll(`section[data-category="${category}"] .dish`);
        
        dishes.forEach(dish => {
            if (dish.dataset.kind === kind || kind === "all") {
                dish.style.display = "block";
            } else {
                dish.style.display = "none";
            }
        });
    }
    
    // Обновленный обработчик событий для кнопок фильтров
    document.querySelectorAll(".dish button").forEach((button) => {
        button.addEventListener("click", () => {
            const dishElement = button.closest(".dish");
            const category = dishElement.dataset.category; // Получаем категорию из атрибута data
    
            const item = {
                name: dishElement.querySelector("p").textContent, // Получаем название блюда
                // Получаем цену, убирая все нечисловые символы
                price: parseInt(dishElement.querySelector("p:nth-of-type(2)").textContent.replace(/\D/g, "")) || 0, // Добавляем || 0, чтобы избежать NaN
                weight: dishElement.querySelector("p:nth-of-type(3)")?.textContent || "" // Опционально получаем вес
            };
    
            // Обновляем выбранный элемент для заказа
            selectItem(category, item);
    
            // Добавляем блюдо в корзину
            cart.push(item);
            updateCart();
        });
    });
    
    // Функция для сброса фильтров
    function resetFilters(category) {
        const dishes2 = document.querySelectorAll(`section[data-category="${category}"] .dish`);
        dishes2.forEach(dish => {
            dish.style.display = "block"; // Показываем все блюда
        });
    }

    // Функция для выбора блюда и обновления итогов заказа
    function selectItem(category, item) {
        // Присваиваем выбранный элемент в соответствующую категорию
        if (category === "main") {
            selectedItems.mainDish = item;
        } else if (category === "starter") {
            selectedItems.starter = item;
        } else if (category === "dessert") {
            selectedItems.dessert = item;
        } else {
            selectedItems[category] = item;
        }
        updateOrderSummary(); // Обновляем итог заказа
    }

    // Привязываем обработчики событий к каждой кнопке в блюдах
    document.querySelectorAll(".dish button").forEach((button) => {
        button.addEventListener("click", () => {
            const dishElement = button.closest(".dish");
            const category = dishElement.dataset.category; // Получаем категорию из атрибута data

            const item = {
                name: dishElement.querySelector("p").textContent, // Получаем название блюда
                // Получаем цену, убирая все нечисловые символы
                price: parseInt(dishElement.querySelector("p:nth-of-type(2)").textContent.replace(/\D/g, "")) || 0 // Добавляем || 0, чтобы избежать NaN
            };

            selectItem(category, item); // Обновляем выбранный элемент
        });
    });
});
document.getElementById("order-form-container").addEventListener("submit", validateOrder);
// Функция для проверки заказа
function validateOrder(event) {
    const errors = [];

    // Проверяем, есть ли выбранные блюда
    if (!Object.values(selectedItems).some(item => item !== null)) {
        errors.push("Вы не выбрали ни одного блюда.");
    }

    // Проверяем категории
    if (!selectedItems.drink) {
        errors.push("Выберите напиток.");
    }
    if (selectedItems.soup && !selectedItems.mainDish && !selectedItems.starter) {
        errors.push("Выберите главное блюдо или салат/стартер.");
    }
    if (selectedItems.starter && !selectedItems.soup && !selectedItems.mainDish) {
        errors.push("Выберите суп или главное блюдо.");
    }
    if ((selectedItems.drink || selectedItems.dessert) && !selectedItems.mainDish) {
        errors.push("Выберите главное блюдо");
    }

    // Если есть ошибки, отображаем уведомление
    if (errors.length > 0) {
        event.preventDefault(); // Блокируем отправку формы
        showNotification(errors.join("<br>")); // Отображаем ошибки
        return false;
    }

    return true; // Если ошибок нет, форма отправляется
}



// Функция для отображения уведомлений
function showNotification(message) {
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.classList.add("notification");

    notification.innerHTML = `
        <p>${message}</p>
        <button id="notification-ok">Окей 👌</button>
    `;

    document.body.appendChild(notification);

    const okButton = document.getElementById("notification-ok");
    okButton.addEventListener("click", () => {
        notification.remove();
    });
    notification.style.position = "fixed";
notification.style.top = "50%";
notification.style.left = "50%";
notification.style.transform = "translate(-50%, -50%)";
notification.style.backgroundColor = "#fff";
notification.style.padding = "20px";
notification.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
notification.style.border = "1px solid #ccc";
notification.style.zIndex = "1000";
}


// Код для корзины (оставляем без изменений, если он работает)
const cart = [];
const dishes3 = document.querySelectorAll('.dish');



function updateCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = ''; // очищаем корзину
    if (cart.length === 0) {
        cartDiv.innerHTML = '<p>Ваша корзина пуста.</p>';
        return;
    }

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `<p>${item.name} - ${item.price} (${item.weight})</p>`;
        cartDiv.appendChild(itemDiv);
    });
}

async function loadDishes() {
    const apiUrl = "http://lab7-api.std-900.ist.mospolytech.ru/api/dishes";

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Ошибка загрузки данных: ${response.status}`);
        }

        const dishes = await response.json();

        renderDishes(dishes); // Рендерим блюда на страницу
    } catch (error) {
        console.error("Произошла ошибка при загрузке данных:", error);
       
    }
}

// Функция для отображения блюд на странице
function renderDishes(dishes) {
    const mainElement = document.querySelector('main');

    // Группируем блюда по категориям
    const categorizedDishes = dishes.reduce((acc, dish) => {
        if (!acc[dish.category]) {
            acc[dish.category] = [];
        }
        acc[dish.category].push(dish);
        return acc;
    }, {});

    Object.keys(categorizedDishes).forEach(category => {
        const section = document.createElement('section');
        section.setAttribute('data-category', category);
        section.classList.add('dish-category');

        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = getCategoryName(category);
        section.appendChild(categoryTitle);

        const dishesContainer = document.createElement('div');
        dishesContainer.classList.add('dishes');

        categorizedDishes[category].forEach(dish => {
            const dishElement = createDishElement(dish, category);
            dishesContainer.appendChild(dishElement);
        });

        section.appendChild(dishesContainer);
        mainElement.appendChild(section);
    });

    // Привязываем обработчики событий к кнопкам после рендера
    attachDishButtonHandlers();
}

// Функция для получения названия категории
function getCategoryName(category) {
    const categoryNames = {
        soup: "Супы",
        main: "Главные блюда",
        drink: "Напитки",
        starter: "Стартеры",
        dessert: "Десерты"
    };
    return categoryNames[category] || "Прочее";
}

// Функция для создания HTML элемента блюда
function createDishElement(dish, category) {
    const dishDiv = document.createElement('div');
    dishDiv.classList.add('dish');
    dishDiv.dataset.category = category;
    dishDiv.dataset.kind = dish.kind; // Добавляем информацию о виде блюда

    dishDiv.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}">
        <p>${dish.name}</p>
        <p>Цена: ${dish.price}₽</p>
        <p>${dish.count}</p>
        <button data-keyword="${dish.keyword}">Добавить</button>
    `;

    return dishDiv;
}

// Функция для привязки обработчиков кнопок после рендера
function attachDishButtonHandlers() {
    document.querySelectorAll(".dish button").forEach(button => {
        button.addEventListener("click", () => {
            const dishElement = button.closest(".dish");
            const category = dishElement.dataset.category;

            const item = {
                name: dishElement.querySelector("p").textContent,
                price: parseInt(dishElement.querySelector("p:nth-of-type(2)").textContent.replace(/\D/g, "")) || 0,
                weight: dishElement.querySelector("p:nth-of-type(3)")?.textContent || ""
            };

            selectItem(category, item); // Обновляем выбранный элемент
        });
    });
}

// Вызываем загрузку данных при загрузке страницы
document.addEventListener("DOMContentLoaded", function() {
    loadDishes(); // Загружаем блюда из API
});
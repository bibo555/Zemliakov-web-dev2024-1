document.addEventListener("DOMContentLoaded", function() {
    const orderSummaryContent = document.getElementById("order-summary-content");
    const emptyOrderMessage = document.getElementById("empty-order");
    
    const soupSummary = document.getElementById("soup-summary");
    const mainDishSummary = document.getElementById("main-dish-summary");
    const drinkSummary = document.getElementById("drink-summary");
    const starterSummary = document.getElementById("starter-summary");
    const dessertSummary = document.getElementById("dessert-summary");
    
    const soupSelected = document.getElementById("soup-selected");
    const mainDishSelected = document.getElementById("main-dish-selected");
    const drinkSelected = document.getElementById("drink-selected");
    const starterSelected = document.getElementById("starter-selected");
    const dessertSelected = document.getElementById("dessert-selected");
    
    const totalAmountElement = document.getElementById("total-amount"); // Определяем элемент для отображения суммы

    let selectedItems = {
        soup: null,
        mainDish: null,
        drink: null,
        starter: null,
        dessert: null
    };
    
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
    document.querySelectorAll('.filters button').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.closest('section').dataset.category;
            const kind = button.dataset.kind;

            // Проверка нажатия на ту же кнопку
            if (button.classList.contains('active')) {
                button.classList.remove('active'); // Удаляем класс active
                resetFilters(category); // Сбрасываем фильтры
            } else {
                // Убираем класс active у других кнопок в этой категории
                const buttons = button.closest('.filters').querySelectorAll('button');
                buttons.forEach(btn => btn.classList.remove('active'));

                button.classList.add('active'); // Добавляем класс active
                filterDishes(category, kind); // Применяем фильтр
            }
        });
    });

    // Функция для сброса фильтров
    function resetFilters(category) {
        const dishes = document.querySelectorAll(`section[data-category="${category}"] .dish`);
        dishes.forEach(dish => {
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

// Код для корзины (оставляем без изменений, если он работает)
const cart = [];
const dishes = document.querySelectorAll('.dish');

dishes.forEach(dish => {
    const button = dish.querySelector('button');
    button.addEventListener('click', () => {
        const name = dish.querySelector('p').innerText;
        const price = dish.querySelectorAll('p')[1].innerText;
        const weight = dish.querySelectorAll('p')[2].innerText;
        cart.push({ name, price, weight });
        updateCart();
    });
});

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

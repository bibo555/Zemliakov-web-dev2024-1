document.addEventListener("DOMContentLoaded", function() {
    const orderSummaryContent = document.getElementById("order-summary-content");
    const emptyOrderMessage = document.getElementById("empty-order");
    
    const soupSummary = document.getElementById("soup-summary");
    const mainDishSummary = document.getElementById("main-dish-summary");
    const drinkSummary = document.getElementById("drink-summary");
    
    const soupSelected = document.getElementById("soup-selected");
    const mainDishSelected = document.getElementById("main-dish-selected");
    const drinkSelected = document.getElementById("drink-selected");
    
    let selectedItems = {
        soup: null,
        mainDish: null,
        drink: null
    };
    
    function updateOrderSummary() {
        let anyItemSelected = false;

        // Обновляем отображение для супов
        if (selectedItems.soup) { 
            soupSelected.textContent = `${selectedItems.soup.name} - ${selectedItems.soup.price}₽`;
            soupSummary.style.display = "block";
            anyItemSelected = true;
        } else {
            soupSelected.textContent = "Блюдо не выбрано";
            soupSummary.style.display = "block";
        }
        
        // Обновляем отображение для главного блюда
        if (selectedItems.mainDish) {
            mainDishSelected.textContent = `${selectedItems.mainDish.name} - ${selectedItems.mainDish.price}₽`;
            mainDishSummary.style.display = "block";
            anyItemSelected = true;
        } else {
            mainDishSelected.textContent = "Блюдо не выбрано";
            mainDishSummary.style.display = "block";
        }
        
        // Обновляем отображение для напитка
        if (selectedItems.drink) {
            drinkSelected.textContent = `${selectedItems.drink.name} - ${selectedItems.drink.price}₽`;
            drinkSummary.style.display = "block";
            anyItemSelected = true;
        } else {
            drinkSelected.textContent = "Напиток не выбран";
            drinkSummary.style.display = "block";
        }

        // Показываем или скрываем сообщение "Ничего не выбрано"
        emptyOrderMessage.style.display = anyItemSelected ? "none" : "block";
    }
    
    // Функция для выбора блюда и обновления итогов заказа
    function selectItem(category, item) {
        // Присваиваем выбранный элемент в соответствующую категорию
        if (category === "main") {
            selectedItems.mainDish = item;
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
                price: parseInt(dishElement.querySelector("p:nth-of-type(2)").textContent.replace(/\D/g, ""))
            };

            selectItem(category, item); // Обновляем выбранный элемент
        });
    });
});

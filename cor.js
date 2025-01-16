async function fetchProducts() {
    try {
        const response = await fetch(
            'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?api_key=701002ea-0438-450a-a625-ee55a139c880'
        );
        if (!response.ok) {
            throw new Error("Ошибка загрузки: ${response.statusText}");
        }

        const data = await response.json();
        console.log(data);
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
// Функция для расчета стоимости доставки
function calculateDeliveryCost(deliveryDate, deliveryTime) {
    const baseDeliveryCost = 200;
    let extraCost = 0;

    if (deliveryDate) {
        const date = new Date(deliveryDate);
        const dayOfWeek = date.getDay(); // 0 = воскресенье, 6 = суббота

        // Увеличение стоимости для выходных
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            extraCost += 300;
        } else if (deliveryTime && deliveryTime.startsWith('18:')) {
            // Увеличение стоимости для будних вечерних часов
            extraCost += 200;
        }
    }

    return baseDeliveryCost + extraCost;
}

// Функция для обновления итоговой стоимости
async function updateTotalCost() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log(cart);
    const goods = await fetchProducts();
    let totalCost = 0;
    for (const id of cart) {
        const item = goods.find(good => good.id === id);
        const itemPrice = item.discountPrice || item.price;
        totalCost += itemPrice;
    }
    
    



    // Получаем данные доставки
    const deliveryDateInput = document.querySelector('input[type="date"]');
    const deliveryTimeSelect = document.querySelector('select');
    const deliveryDate = deliveryDateInput?.value;
    const deliveryTime = deliveryTimeSelect?.value;

    // Рассчитываем стоимость доставки
    const deliveryCost = calculateDeliveryCost(deliveryDate, deliveryTime);

    // Общая стоимость
    const totalWithDelivery = totalCost + deliveryCost;

    // Обновляем отображение стоимости
    const totalElement = document.querySelector('.total-cost');
    totalElement.innerHTML = `
        Итоговая стоимость: ${totalCost.toFixed(2)}₽ 
        <span>(стоимость доставки ${deliveryCost}₽)</span><br>
        Общая стоимость с доставкой: ${totalWithDelivery.toFixed(2)}₽
    `;
}

// Событие изменения даты или временного интервала доставки
document.addEventListener('change', (event) => {
    if (event.target.matches('input[type="date"]') || event.target.matches('select')) {
        updateTotalCost();
    }
});

// Функция загрузки товаров из корзины
 async function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log(cart);
    const goods = await fetchProducts();
    const cartItemsContainer = document.querySelector('.cart-items');
   
    

    cartItemsContainer.innerHTML = ''; // Очищаем контейнер
    for (const id of cart) {
        const item = goods.find(good => good.id === id);
        console.log(item)
        if (item)
            {const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.setAttribute("good-id", id);
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h3>${item.name}</h3>
                    ${
                        item.discountPrice
                            ? `<p class="price">
                                   <span class="price-original">${item.price.toFixed(2)}₽</span> 
                                   <span class="price-discount">${item.discountPrice.toFixed(2)}₽</span>
                                   <span class="discount-percent">-${item.discount}%</span>
                               </p>`
                            : `<p class="price">${item.price.toFixed(2)}₽</p>`
                    }
                    <button class="remove-btn" data-id="${item.id}">Удалить</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            
        }
        

        
    };

    // Обновляем стоимость при загрузке
    updateTotalCost();
}
async function submitOrder(order) {
    try {
        console.log('Отправка заказа на сервер:', order); // Логирование данных, которые отправляются на сервер

        const response = await fetch('https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=701002ea-0438-450a-a625-ee55a139c880', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify(order),
        });

        if (!response.ok) {
            throw new Error(`Ошибка при создании заказа: ${response.status}`);
        }

        const result = await response.json();
        console.log('Заказ успешно создан:', result);

        // Показать уведомление
        showNotification('Ваш заказ успешно оформлен!');
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('Произошла ошибка при оформлении заказа. Попробуйте ещё раз.');
    }
}

let goodIds=localStorage.getItem('cart');
let cart_ids=JSON.parse(goodIds);

// Удаление товара из корзины
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
        const goodCard = event.target.closest(".cart-item");
        const goodId = parseInt(goodCard.getAttribute("good-id"), 10);
        cart_ids = cart_ids.filter(id => id !== goodId);
        localStorage.setItem(
            'cart', JSON.stringify(cart_ids)
        );
  
   
        
        // Обновляем корзину и пересчитываем итоговую стоимость
        loadCart();
    }
});

console.log(cart_ids);
document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    // Собираем данные формы
    const formData = new FormData(document.getElementById("orderForm"));
    const deliveryAddress = formData.get("address");
    let deliveryDate = formData.get("delivery_date");
    const deliveryInterval = formData.get("delivery_interval");
    const fullName = formData.get("full_name");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const comment = formData.get("comment");
    let sub = formData.get("subscribe");

    if (sub === "on") {
        sub = 1;
    } else {
        sub = 0;
    }
    const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = deliveryDate.match(datePattern);

    if (match) {
        const [, year, month, day] = match;
        deliveryDate = `${day}.${month}.${year}`;
    }
    const order = {
        delivery_address: deliveryAddress,
        delivery_date: deliveryDate,
        delivery_interval: deliveryInterval,
        full_name: fullName,
        phone: phone,
        email: email,
        good_ids: cart_ids,
        comment: comment,
        subscribe:sub,
    };

    // Отправляем заказ на сервер
    await submitOrder(order);

    // Очищаем корзину
    localStorage.removeItem('cart');
    loadCart();
});

function showNotification(message) {
    const notificationElement = document.getElementById('notifications');
    const notificationMessage = document.getElementById('notificationMessage');

    notificationMessage.textContent = message;
    notificationElement.style.display = 'block';

   
}
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
        const productId = parseInt(event.target.dataset.id, 10);
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Фильтруем корзину, удаляя товар по его ID
        cart = cart.filter((item) => item.id !== productId);
        
        // Сохраняем обновленную корзину в localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Обновляем корзину и пересчитываем итоговую стоимость
        loadCart();

        // Показать уведомление
        showNotification('Вы удалили товар из корзины');
    }
});


// Скрытие уведомления при нажатии на кнопку "×"
document.getElementById('closeNotification').addEventListener('click', () => {
    document.getElementById('notifications').style.display = 'none';
});





// Загрузка корзины при открытии страницы
document.addEventListener('DOMContentLoaded', loadCart);

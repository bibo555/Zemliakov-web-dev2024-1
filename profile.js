document.addEventListener("DOMContentLoaded", async () => {
    await fetchProducts(); // Ждём загрузки товаров
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    displayOrders(orders); // Теперь товары должны быть загружены
});


async function fetchOrdersFromServer() {
    try {
        const response = await fetch('https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=701002ea-0438-450a-a625-ee55a139c880');
        if (!response.ok) throw new Error(`Ошибка при загрузке заказов: ${response.status} ${response.statusText}`);

        const rawOrders = await response.json();

        // Преобразование данных с расчетом стоимости
        const orders = rawOrders.map(order => {
            let totalCost = 0;  // Начальная стоимость заказа

            const items = order.good_ids.map(id => {
                const product = productsData.find(p => p.id === id);
                const price = product ? (product.discountPrice || product.price) : 0; // Берём цену со скидкой
                totalCost += price; // Считаем сумму заказа
                return { id, quantity: 1, price };
            });

            return {
                id: order.id,
                orderDate: order.created_at,
                name: order.full_name,
                phone: order.phone,
                email: order.email,
                address: order.delivery_address,
                deliveryDate: order.delivery_date,
                deliveryTime: order.delivery_interval,
                totalCost, // Считаем итоговую сумму заказа
                items
            };
        });

        console.log("Преобразованные данные:", orders);

        localStorage.setItem('orders', JSON.stringify(orders));
        displayOrders(orders);
    } catch (error) {
        console.error("Ошибка:", error);
        displayNotification('Не удалось загрузить заказы. Попробуйте позже.', 'error');
    }
}

// Глобальная переменная для хранения данных о продуктах
let productsData = [];

// Функция загрузки товаров
async function fetchProducts() {
    try {
        const response = await fetch(
            'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?api_key=701002ea-0438-450a-a625-ee55a139c880'
        );
        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);

        productsData = data.map((item) => {
            const discount = item.actual_price && item.discount_price
                ? Math.round(((item.actual_price - item.discount_price) / item.actual_price) * 100)
                : null;

            return {
                id: item.id,
                name: item.name,
                price: item.actual_price,
                discountPrice: item.discount_price || null,
                image: item.image_url,
                rating: item.rating,
                mainCategory: item.main_category,
                subCategory: item.sub_category,
            };
        });

        return productsData;
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        alert('Не удалось загрузить товары. Попробуйте позже.');
        return [];
    }
}

// Форматирование данных о товарах заказа
function getOrderItemsDetails(orderItems) {
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
        return "Товары отсутствуют";
    }

    return orderItems.map((orderItem) => {
        const product = productsData.find((p) => p.id === orderItem.id);

        if (product) {
            const price = product.discountPrice || product.price; // Цена со скидкой, если есть
            return `${product.name} (${orderItem.quantity || 0} шт.) — ${price * (orderItem.quantity || 1)} ₽`;
        } else {
            return `Неизвестный товар (${orderItem.quantity || 0} шт.)`;
        }
    }).join(", ");
}

// Отображение заказов с учётом данных о продуктах
function displayOrders(orders) {
    const tbody = document.querySelector(".orders-table tbody");
    tbody.innerHTML = "";

    orders.forEach((order, index) => {
        const itemsText = getOrderItemsDetails(order.items);

        const row = document.createElement("tr");
        row.id = order.id; // Устанавливаем id

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${formatDate(order.orderDate)}</td>
            <td>${itemsText}</td>
            <td>${order.totalCost || '0'} ₽</td>
            <td>${formatDate(order.deliveryDate)} ${order.deliveryTime || '—'}</td>
            <td>
                <button class="view-btn" data-index="${index}">👁️</button>
                <button class="edit-btn" data-index="${index}">✏️</button>
                <button class="delete-btn" data-index="${index}">🗑️</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}





// Показ уведомления
function displayNotification(message, type = 'info') {
    const notifications = document.getElementById('notifications');
    notifications.textContent = message;
    notifications.className = `notification ${type}`;
    notifications.style.display = 'block';

    setTimeout(() => {
        notifications.style.display = 'none';
    }, 3000);
}

// Загрузка заказов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    fetchOrdersFromServer();
});


// Отображение заказов в таблице
// function displayOrders(orders) {
//     const tbody = document.querySelector(".orders-table tbody");
//     tbody.innerHTML = "";

//     orders.forEach((order, index) => {
//         const itemsText = Array.isArray(order.items)
//             ? order.items.map(item => `${item.name || 'Неизвестный товар'} (${item.quantity || 0} шт.)`).join(", ")
//             : "Товары отсутствуют";

//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td>${index + 1}</td>
//             <td>${formatDate(order.orderDate)}</td>
//             <td>${itemsText}</td>
//             <td>${order.totalCost || '0'} ₽</td>
//             <td>${formatDate(order.deliveryDate)} ${order.deliveryTime || '—'}</td>
//             <td>
//                 <button class="view-btn" data-index="${index}">👁️</button>
//                 <button class="edit-btn" data-index="${index}">✏️</button>
//                 <button class="delete-btn" data-index="${index}">🗑️</button>
//             </td>
//         `;
//         tbody.appendChild(row);
//     });
// }



// Форматирование даты
function formatDate(date) {
    if (!date) return "—"; // Если дата отсутствует
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString("ru-RU");
}

document.addEventListener("click", async (event) => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const index = event.target.dataset.index;

    if (event.target.classList.contains("view-btn")) {
        const order = orders[index];
        const orderDetails = await fetchOrderDetails(order.id); // Получение данных заказа с сервера
        if (orderDetails) {
            showViewModal(orderDetails); // Отображение данных в модальном окне
        }
    }

    if (event.target.classList.contains("edit-btn")) {
        const order = orders[index];
        const orderDetails = await fetchOrderDetails(order.id);
        showEditModal(orderDetails);
        
    }

    if (event.target.classList.contains("delete-btn")) {
        showDeleteModal(index);
    }
});


async function fetchOrderDetails(orderId) {
    try {
        const response = await fetch(
            `https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${orderId}?api_key=701002ea-0438-450a-a625-ee55a139c880`
        );
        if (!response.ok) {
            throw new Error(`Ошибка загрузки заказа: ${response.status} ${response.statusText}`);
        }
        const orderDetails = await response.json();
        console.log(orderDetails);
        return orderDetails;
    } catch (error) {
        console.error('Ошибка при загрузке данных заказа:', error);
        displayNotification('Не удалось загрузить данные заказа. Попробуйте позже.', 'error');
        return null;
    }
}

// Функции модальных окон
// Функция отображения модального окна для просмотра заказа
// Функция отображения модального окна для просмотра заказа
function showViewModal(order) {
    const modal = document.getElementById("view-modal");
    
    // Отображаем основные данные заказа
    document.getElementById("view-order-date").textContent = formatDate(order.created_at);
    document.getElementById("view-order-name").textContent = order.full_name || "—";
    document.getElementById("view-order-phone").textContent = order.phone || "—";
    document.getElementById("view-order-email").textContent = order.email || "—";
    document.getElementById("view-order-address").textContent = order.delivery_address || "—";
    document.getElementById("view-order-delivery-date").textContent = formatDate(order.delivery_date);
    document.getElementById("view-order-delivery-time").textContent = order.delivery_interval || "—";

    // Отображаем товары (названия и количество)
    const itemsText = order.good_ids.map(id => {
        const product = productsData.find(p => p.id === id);
        if (product) {
            const price = product.discountPrice || product.price;
            return `${product.name} — ${price} ₽`;
        }
        return "Неизвестный товар";
    }).join(", ");
    document.getElementById("view-order-items").textContent = itemsText;

    // Рассчитываем итоговую стоимость, если она не передана
    let totalCost = order.totalCost || 0;
    if (!totalCost) {
        totalCost = order.good_ids.reduce((sum, id) => {
            const product = productsData.find(p => p.id === id);
            if (product) {
                sum += product.discountPrice || product.price;
            }
            return sum;
        }, 0);
    }

    // Отображаем итоговую стоимость
    document.getElementById("view-order-cost").textContent = `${totalCost} ₽`;

    // Отображаем комментарий
    document.getElementById("view-order-comment").textContent = order.comment || "Комментарий отсутствует";

    // Показываем модальное окно
    modal.style.display = "block";
}



async function updateOrderOnServer(orderId, updatedOrderData) {
    try {
        const response = await fetch(
            `https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${orderId}?api_key=701002ea-0438-450a-a625-ee55a139c880`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedOrderData),
            }
        );

        if (!response.ok) {
            throw new Error(`Ошибка при обновлении заказа: ${response.status} ${response.statusText}`);
        }

        const updatedOrder = await response.json();
        console.log(updatedOrder);
        console.log("Заказ успешно обновлен:", updatedOrder);

        // Уведомление об успешном обновлении заказа
        displayNotification('Заказ успешно обновлен!', 'success');
        return updatedOrder;
    } catch (error) {
        console.error("Ошибка при обновлении заказа:", error);
        displayNotification('Не удалось обновить заказ. Попробуйте позже.', 'error');
        return null;
    }
}

console.log(document.getElementById("edit-order-date"));
// Показ модального окна для редактирования
// Функция для отображения данных в окне редактирования
function showEditModal(order) {
    const modal = document.getElementById("edit-modal");

    // Устанавливаем id заказа в скрытое поле формы
    document.getElementById("edit-order-id").value = order.id;
    // Отображаем поля данных заказа в форме
    document.getElementById("edit-order-date").value = order.delivery_date || ""; // Дата доставки
    document.getElementById("edit-order-name").value = order.full_name || ""; // Имя
    document.getElementById("edit-order-phone").value = order.phone || ""; // Телефон
    document.getElementById("edit-order-email").value = order.email || ""; // Email
    document.getElementById("edit-order-address").value = order.delivery_address || ""; // Адрес доставки
    document.getElementById("comment").value = order.comment || ""; // Комментарий

    // Заполнение выпадающего списка для выбора времени доставки
    const timeSelect = document.querySelector("select[name='delivery_interval']");
    const timeOptions = ["08:00-12:00", "12:00-14:00", "14:00-18:00", "18:00-22:00"];

    // Очистка текущих опций и добавление новых
    timeSelect.innerHTML = "";
    timeOptions.forEach(timeSlot => {
        const option = document.createElement("option");
        option.value = timeSlot;
        option.textContent = timeSlot;
        if (order.delivery_interval === timeSlot) {
            option.selected = true;
        }
        timeSelect.appendChild(option);
    });

    // Показываем модальное окно
    modal.style.display = "block";
}



// Показ модального окна для удаления
function showDeleteModal(index) {
    const modal = document.getElementById("delete-modal");
    modal.dataset.index = index;
    modal.style.display = "block";
}

// Обновление заказа
document.getElementById("edit-order-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const orderId = document.getElementById("edit-order-id").value;

    const updatedOrderData = {
        name: event.target["edit-order-name"].value,
        phone: event.target["edit-order-phone"].value,
        email: event.target["edit-order-email"].value,
        address: event.target["edit-order-address"].value,
        deliveryDate: event.target["edit-order-date"].value,
        deliveryTime: event.target["delivery_interval"].value,
        comment: event.target["comment"].value,
    };

    // Отправляем обновленные данные на сервер
    const updatedOrder = await updateOrderOnServer(orderId, updatedOrderData);
    if (updatedOrder) {
        // Если заказ успешно обновлен, обновляем локальные данные
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const index = orders.findIndex(order => order.id === orderId);
        if (index !== -1) {
            orders[index] = { ...orders[index], ...updatedOrderData };
            localStorage.setItem("orders", JSON.stringify(orders));
            displayOrders(orders); // Обновляем отображение заказов
        }
        closeModals(); // Закрываем модальное окно
    }
});

function displayNotification(message, type = 'info') {
    const notifications = document.getElementById('notifications');
    const messageElement = document.getElementById('notification-message');
    const closeButton = document.getElementById('close-notification');

    // Устанавливаем текст уведомления
    messageElement.textContent = message;

    // Применяем класс для типа уведомления (info, success, error)
  

    // Показываем уведомление
    notifications.style.display = 'flex';  // Убедимся, что оно отображается как flex

    // Показываем кнопку закрытия
    closeButton.style.display = 'inline-block';  // Кнопка должна быть видна

    
}





async function deleteOrderFromServer(orderId) {
    try {
        const response = await fetch(
            `https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${orderId}?api_key=701002ea-0438-450a-a625-ee55a139c880`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Ошибка при удалении заказа: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();  // Ответ от сервера (можно использовать для уведомлений)
        console.log("Заказ успешно удален:", result);

        // Уведомление об успешном удалении заказа
        displayNotification('Заказ успешно удален!', 'success');
        return result;
    } catch (error) {
        console.error("Ошибка при удалении заказа:", error);
        displayNotification('Не удалось удалить заказ. Попробуйте позже.', 'error');
        return null;
    }
}


// Удаление заказа
document.getElementById("confirm-delete-btn").addEventListener("click", async () => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const index = document.getElementById("delete-modal").dataset.index;
    const orderId = orders[index].id;  // Получаем ID заказа

    // Удаляем заказ с сервера
    const deletedOrder = await deleteOrderFromServer(orderId);
    
    if (deletedOrder) {
        // Если заказ был удален с сервера, удаляем его и из localStorage
        orders.splice(index, 1);
        localStorage.setItem("orders", JSON.stringify(orders));

        // Обновляем отображение таблицы заказов
        displayOrders(orders);

        // Закрываем модальное окно
        closeModals();
    }
});



// Закрытие модальных окон
document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", closeModals);
});
const notification = document.getElementById("notifications");
const closeButton = document.getElementById("close-notification");

function showNotification(message) {
    document.getElementById("notification-message").textContent = message;
    notification.style.display = "flex"; // Показать уведомление
    closeButton.style.display = "inline-block";
}

// Закрытие уведомления
closeButton.addEventListener("click", () => {
    notification.style.display = "none";
});




function closeModals() {
    document.querySelectorAll(".modal").forEach((modal) => {
        modal.style.display = "none";
    });
}

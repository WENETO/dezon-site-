// ===== ОБРАБОТКА ФОРМ С ОТПРАВКОЙ В TELEGRAM =====

const TELEGRAM_CONFIG = {
    token: '8791864673:AAFJNXdyJ3HmJ_kKyhw-bfLuB6JoicpxTng',
    chatId: '2068108259'
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Forms.js загружен');
    
    // ФОРМА ЗАКАЗА (самая важная!)
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        console.log('✅ Форма заказа найдена');
        
        // Управление чекбоксом и кнопкой
        const memoCheckbox = document.getElementById('clientMemoAgreement');
        const submitBtn = document.getElementById('orderSubmitBtn');
        
        if (memoCheckbox && submitBtn) {
            submitBtn.disabled = true;
            memoCheckbox.addEventListener('change', function() {
                submitBtn.disabled = !this.checked;
            });
        }
        
        // Обработчик отправки
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('📤 Отправка формы заказа...');
            
            // Собираем данные
            const formData = new FormData(this);
            
            // Проверка согласия
            if (!formData.get('clientMemoAgreement')) {
                alert('Необходимо подтвердить согласие с Памяткой клиенту');
                return;
            }
            
            const data = {
                name: formData.get('name') || 'Не указано',
                phone: formData.get('phone') || 'Не указан',
                service: formData.get('service') || 'Не указана',
                address: formData.get('address') || 'Не указан',
                formType: 'Заказ услуги',
                timestamp: new Date().toLocaleString('ru-RU'),
                pageUrl: window.location.href
            };
            
            // Получаем данные калькулятора
            const calculatorData = sessionStorage.getItem('calculatorData');
            if (calculatorData) {
                data.calculator = JSON.parse(calculatorData);
                sessionStorage.removeItem('calculatorData');
            }
            
            console.log('📦 Данные:', data);
            
            // Отправляем в Telegram
            const success = await sendToTelegram(data);
            
            if (success) {
                showNotification('✓ Заявка успешно отправлена!', 'success');
                
                // Закрываем модальное окно
                const modal = document.getElementById('orderModal');
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Очищаем форму
                this.reset();
                
                // Сбрасываем чекбокс и кнопку
                if (memoCheckbox && submitBtn) {
                    memoCheckbox.checked = false;
                    submitBtn.disabled = true;
                }
            } else {
                showNotification('❌ Ошибка отправки. Попробуйте позже.', 'error');
            }
        });
    }
    
    // ФОРМА КОНСУЛЬТАЦИИ
    const consultForm = document.getElementById('consultForm');
    if (consultForm) {
        console.log('✅ Форма консультации найдена');
        
        consultForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name') || 'Не указано',
                phone: formData.get('phone') || 'Не указан',
                message: formData.get('message') || 'Не указано',
                formType: 'Бесплатная консультация',
                timestamp: new Date().toLocaleString('ru-RU'),
                pageUrl: window.location.href
            };
            
            console.log('📦 Данные консультации:', data);
            
            const success = await sendToTelegram(data);
            
            if (success) {
                showNotification('✓ Заявка на консультацию отправлена!', 'success');
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
                this.reset();
            }
        });
    }
    
    // ФОРМА В ФУТЕРЕ
    const footerForm = document.getElementById('footerForm');
    if (footerForm) {
        console.log('✅ Форма в футере найдена');
        
        footerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name') || 'Не указано',
                phone: formData.get('phone') || 'Не указан',
                formType: 'Обратный звонок',
                timestamp: new Date().toLocaleString('ru-RU'),
                pageUrl: window.location.href
            };
            
            console.log('📦 Данные обратного звонка:', data);
            
            const success = await sendToTelegram(data);
            
            if (success) {
                showNotification('✓ Заявка на звонок отправлена!', 'success');
                this.reset();
            }
        });
    }
    
    // ФОРМА ОТЗЫВА (ИСПРАВЛЕННАЯ)
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        console.log('✅ Форма отзыва найдена');
        
        reviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            // Получаем значение рейтинга
            let rating = formData.get('rating') || '5';
            
            const data = {
                name: formData.get('name') || 'Не указано',
                city: formData.get('city') || 'Не указан',
                service: formData.get('service') || 'Не указана',
                rating: rating,
                review: formData.get('review') || 'Не указан',
                formType: 'Отзыв клиента',
                timestamp: new Date().toLocaleString('ru-RU'),
                pageUrl: window.location.href
            };
            
            console.log('📦 Данные отзыва:', data);
            
            const success = await sendToTelegram(data);
            
            if (success) {
                showNotification('✓ Спасибо за отзыв!', 'success');
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
                this.reset();
                
                // Сброс звезд
                const stars = document.querySelectorAll('.star');
                if (stars.length > 0) {
                    stars.forEach(s => {
                        s.style.color = '#ddd';
                    });
                    // Устанавливаем 5 звезд по умолчанию
                    const defaultStars = document.querySelectorAll('.star[data-value="5"]');
                    if (defaultStars.length > 0) {
                        defaultStars[0].style.color = '#ff9800';
                    }
                }
                
                const ratingValue = document.getElementById('ratingValue');
                if (ratingValue) {
                    ratingValue.value = '5';
                }
            }
        });
    }
    
    // ФОРМА ДЛЯ ЮРИДИЧЕСКИХ ЛИЦ (НОВАЯ)
    const orgConsultForm = document.getElementById('orgConsultForm');
    if (orgConsultForm) {
        console.log('✅ Форма для юридических лиц найдена');
        
        orgConsultForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                organization: formData.get('organization') || 'Не указано',
                name: formData.get('name') || 'Не указано',
                phone: formData.get('phone') || 'Не указан',
                email: formData.get('email') || 'Не указан',
                message: formData.get('message') || 'Не указано',
                formType: 'Консультация для юр.лиц',
                timestamp: new Date().toLocaleString('ru-RU'),
                pageUrl: window.location.href
            };
            
            console.log('📦 Данные для юр.лиц:', data);
            
            const success = await sendToTelegram(data);
            
            if (success) {
                showNotification('✓ Заявка отправлена! Мы подготовим коммерческое предложение.', 'success');
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
                this.reset();
            }
        });
    }
    
    // ФОРМА ПОДПИСКИ НА РАССЫЛКУ
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        console.log('✅ Форма подписки найдена');
        
        subscribeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const data = {
                email: emailInput ? emailInput.value : 'Не указан',
                formType: 'Подписка на рассылку',
                timestamp: new Date().toLocaleString('ru-RU'),
                pageUrl: window.location.href
            };
            
            console.log('📦 Данные подписки:', data);
            
            const success = await sendToTelegram(data);
            
            if (success) {
                showNotification('✓ Спасибо за подписку!', 'success');
                this.reset();
            }
        });
    }
});

// ОТПРАВКА В TELEGRAM
async function sendToTelegram(data) {
    const message = formatTelegramMessage(data);
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const result = await response.json();
        console.log('✅ Ответ от Telegram:', result);
        return result.ok;
    } catch (error) {
        console.error('❌ Ошибка отправки в Telegram:', error);
        return false;
    }
}

// ФОРМАТИРОВАНИЕ СООБЩЕНИЯ
function formatTelegramMessage(data) {
    let message = `<b>🔔 НОВАЯ ЗАЯВКА С САЙТА DEZ-ONE</b>\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `<b>📋 Форма:</b> ${data.formType}\n`;
    message += `<b>📅 Дата:</b> ${data.timestamp}\n`;
    message += `<b>🌐 Страница:</b> ${data.pageUrl}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `<b>📝 ДАННЫЕ КЛИЕНТА:</b>\n`;
    
    // Основные поля
    if (data.name) message += `<b>Имя:</b> ${data.name}\n`;
    if (data.phone) message += `<b>Телефон:</b> ${data.phone}\n`;
    if (data.email) message += `<b>Email:</b> ${data.email}\n`;
    if (data.organization) message += `<b>Организация:</b> ${data.organization}\n`;
    if (data.service) message += `<b>Услуга:</b> ${data.service}\n`;
    if (data.address) message += `<b>Адрес:</b> ${data.address}\n`;
    if (data.message) message += `<b>Сообщение:</b> ${data.message}\n`;
    if (data.city) message += `<b>Город:</b> ${data.city}\n`;
    
    // Рейтинг для отзыва
    if (data.rating) {
        const stars = '★'.repeat(parseInt(data.rating)) + '☆'.repeat(5 - parseInt(data.rating));
        message += `<b>Оценка:</b> ${stars} (${data.rating}/5)\n`;
    }
    
    if (data.review) message += `<b>Отзыв:</b> ${data.review}\n`;
    
    // Данные калькулятора
    if (data.calculator) {
        message += `\n<b>📊 ДЕТАЛИ КАЛЬКУЛЯТОРА:</b>\n`;
        message += `<b>Услуга:</b> ${data.calculator.service}\n`;
        message += `<b>Объект:</b> ${data.calculator.property}\n`;
        message += `<b>Площадь:</b> ${data.calculator.area} м²\n`;
        if (data.calculator.options && data.calculator.options.length > 0) {
            message += `<b>Опции:</b> ${data.calculator.options.join(', ')}\n`;
        }
        message += `<b>Цена:</b> ${data.calculator.price}\n`;
    }
    
    // Отметка о памятке для заказов
    if (data.formType === 'Заказ услуги') {
        message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `✅ Клиент ознакомлен с Памяткой клиенту\n`;
    }
    
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📱 <b>DEZ-ONE</b> | Профессиональная дезинсекция`;
    
    return message;
}

// ПОКАЗ УВЕДОМЛЕНИЯ
function showNotification(message, type = 'info') {
    // Удаляем предыдущее уведомление, если есть
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    let bgColor = '#2196f3'; // info
    if (type === 'success') bgColor = '#2a6b3f';
    if (type === 'error') bgColor = '#dc3545';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 9999;
        font-family: 'Open Sans', sans-serif;
        font-size: 14px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Автоматически скрываем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// ЗАКРЫТЬ ВСЕ МОДАЛЬНЫЕ ОКНА
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// ДОБАВЛЯЕМ СТИЛИ ДЛЯ АНИМАЦИЙ
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ЭКСПОРТ ФУНКЦИЙ
window.Forms = {
    sendToTelegram,
    showNotification,
    closeAllModals
};

// ДЛЯ СОВМЕСТИМОСТИ СО СТАРЫМ КОДОМ
window.DEZ = window.DEZ || {};
window.DEZ.showNotification = showNotification;
window.DEZ.closeAllModals = closeAllModals;
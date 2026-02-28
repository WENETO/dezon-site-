// ===== КАЛЬКУЛЯТОР СТОИМОСТИ =====

// Базывые цены для расчета
const basePrices = {
    cockroach: { flat: 1800, house: 2500, office: 2200, cafe: 3000, warehouse: 3500 },
    bedbug: { flat: 2500, house: 3200, office: 2800, cafe: 3800, warehouse: 4200 },
    rodent: { flat: 2200, house: 3500, office: 3000, cafe: 4000, warehouse: 4500 },
    disinfection: { flat: 2000, house: 2800, office: 2500, cafe: 3500, warehouse: 4000 },
    complex: { flat: 3500, house: 5000, office: 4200, cafe: 5500, warehouse: 6000 }
};

const propertyTypeMap = { flat: 'flat', house: 'house', office: 'office', cafe: 'cafe', warehouse: 'warehouse' };
const serviceNames = {
    cockroach: 'Уничтожение тараканов',
    bedbug: 'Уничтожение клопов',
    rodent: 'Уничтожение грызунов',
    disinfection: 'Дезинфекция помещений',
    complex: 'Комплексная обработка'
};
const propertyNames = {
    flat: 'Квартира',
    house: 'Частный дом',
    office: 'Офис',
    cafe: 'Кафе/ресторан',
    warehouse: 'Склад/производство'
};
const optionNames = {
    urgent: 'Срочный выезд (+20%)',
    strengthened: 'Усиленная защита (+15%)',
    barrier: 'Барьерная защита (+20%)',
    odorless: 'Препараты без запаха (+20%)',
    sticker: 'Наклейка сеточки от тараканов (+5%)'
};
const optionMultipliers = {
    urgent: 1.2, strengthened: 1.15, barrier: 1.2, odorless: 1.2, sticker: 1.05
};

// Инициализация калькулятора
function initCalculator() {
    const calculatorForm = document.getElementById('calculatorForm');
    const serviceTypeSelect = document.getElementById('serviceType');
    const propertyTypeSelect = document.getElementById('propertyType');
    const areaRange = document.getElementById('area');
    const areaValue = document.getElementById('areaValue');
    const totalPriceElement = document.getElementById('totalPrice');
    const checkboxes = document.querySelectorAll('input[name="options"]');
    
    if (!calculatorForm) {
        console.log('Калькулятор не найден на странице');
        return;
    }
    
    console.log('Калькулятор инициализирован');
    
    // Обновление значения площади (ИСПРАВЛЕНО!)
    if (areaRange && areaValue) {
        // Устанавливаем начальное значение
        areaValue.textContent = areaRange.value + ' м²';
        
        // Обновляем при движении ползунка
        areaRange.addEventListener('input', function() {
            areaValue.textContent = this.value + ' м²';
            calculatePrice(); // Пересчитываем цену
            
            // Анимация
            areaValue.style.transform = 'scale(1.2)';
            areaValue.style.color = '#ff9800';
            setTimeout(() => {
                areaValue.style.transform = 'scale(1)';
                areaValue.style.color = '#ffffff';
            }, 300);
        });
    }
    
    // Пересчет при любом изменении
    if (serviceTypeSelect) {
        serviceTypeSelect.addEventListener('change', calculatePrice);
    }
    if (propertyTypeSelect) {
        propertyTypeSelect.addEventListener('change', calculatePrice);
    }
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculatePrice);
    });
    
    // Анимация для чекбоксов
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkmark = this.nextElementSibling;
            if (checkmark) {
                checkmark.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    checkmark.style.transform = 'scale(1)';
                }, 300);
            }
        });
    });
    
    // Обработка отправки формы калькулятора
    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleCalculatorSubmit();
    });
    
    // Первоначальный расчет
    calculatePrice();
}

// Расчет стоимости
function calculatePrice() {
    const serviceTypeSelect = document.getElementById('serviceType');
    const propertyTypeSelect = document.getElementById('propertyType');
    const areaRange = document.getElementById('area');
    const totalPriceElement = document.getElementById('totalPrice');
    const checkboxes = document.querySelectorAll('input[name="options"]:checked');
    const savingsAmount = document.querySelector('.savings-amount');
    
    if (!serviceTypeSelect || !propertyTypeSelect || !areaRange || !totalPriceElement) {
        return;
    }
    
    const serviceType = serviceTypeSelect.value;
    const propertyType = propertyTypeSelect.value;
    const area = parseInt(areaRange.value);
    const propertyKey = propertyTypeMap[propertyType];
    
    if (!serviceType || !propertyType || !propertyKey) {
        totalPriceElement.textContent = '0 ₽';
        if (savingsAmount) savingsAmount.textContent = '0 ₽';
        return;
    }
    
    let basePrice = basePrices[serviceType] ? basePrices[serviceType][propertyKey] : 2000;
    
    let areaMultiplier = 1;
    if (area > 100) areaMultiplier = 1.2;
    if (area > 200) areaMultiplier = 1.5;
    if (area > 300) areaMultiplier = 1.8;
    if (area > 400) areaMultiplier = 2.0;
    
    let total = basePrice * areaMultiplier;
    
    checkboxes.forEach(checkbox => {
        if (optionMultipliers[checkbox.value]) {
            total *= optionMultipliers[checkbox.value];
        }
    });
    
    const formattedPrice = Math.round(total).toLocaleString('ru-RU');
    totalPriceElement.textContent = formattedPrice + ' ₽';
    
    if (savingsAmount) {
        const savings = Math.round(total * 0.1);
        savingsAmount.textContent = savings.toLocaleString('ru-RU') + ' ₽';
    }
}

// Обработка отправки формы калькулятора
function handleCalculatorSubmit() {
    const serviceTypeSelect = document.getElementById('serviceType');
    const propertyTypeSelect = document.getElementById('propertyType');
    const areaRange = document.getElementById('area');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (!serviceTypeSelect || !propertyTypeSelect || !areaRange || !totalPriceElement) {
        alert('Пожалуйста, заполните все поля калькулятора');
        return;
    }
    
    const serviceTypeValue = serviceTypeSelect.value;
    const propertyTypeValue = propertyTypeSelect.value;
    
    if (!serviceTypeValue || !propertyTypeValue) {
        alert('Пожалуйста, выберите услугу и тип объекта');
        return;
    }
    
    const serviceTypeText = serviceNames[serviceTypeValue] || serviceTypeSelect.options[serviceTypeSelect.selectedIndex]?.text || 'Не выбрано';
    const propertyTypeText = propertyNames[propertyTypeValue] || propertyTypeSelect.options[propertyTypeSelect.selectedIndex]?.text || 'Не выбрано';
    const area = areaRange.value;
    const price = totalPriceElement.textContent;
    
    const selectedOptions = [];
    const checkboxes = document.querySelectorAll('input[name="options"]:checked');
    checkboxes.forEach(checkbox => {
        selectedOptions.push(optionNames[checkbox.value] || checkbox.value);
    });
    
    let serviceText = `${serviceTypeText} для ${propertyTypeText} (${area} м²)`;
    if (selectedOptions.length > 0) {
        serviceText += ` + ${selectedOptions.join(', ')}`;
    }
    serviceText += ` - ${price}`;
    
    const serviceInput = document.getElementById('serviceInput');
    if (serviceInput) {
        serviceInput.value = serviceText;
    }
    
    const calculatorData = {
        service: serviceTypeText,
        property: propertyTypeText,
        area: area,
        options: selectedOptions,
        price: price
    };
    sessionStorage.setItem('calculatorData', JSON.stringify(calculatorData));
    
    const orderModal = document.getElementById('orderModal');
    if (orderModal) {
        if (window.DEZ && window.DEZ.closeAllModals) {
            window.DEZ.closeAllModals();
        }
        orderModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const submitBtn = orderModal.querySelector('button[type="submit"]');
        const memoCheckbox = orderModal.querySelector('#clientMemoAgreement');
        if (submitBtn && memoCheckbox) {
            submitBtn.disabled = true;
            memoCheckbox.checked = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initCalculator();
});

window.Calculator = { initCalculator, calculatePrice, handleCalculatorSubmit };
// 1. Запрещаем браузеру запоминать старую позицию скролла
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// 2. Убираем фокус с формы (чтобы браузер не прыгал к ней)
document.addEventListener('DOMContentLoaded', function() {
    if (document.activeElement) {
        document.activeElement.blur();
    }
});

// 3. Убираем якорь (#booking) из адресной строки, если он там остался
if (window.location.hash) {
    history.replaceState(null, null, window.location.href.split('#')[0]);
}

// 4. Принудительно возвращаем страницу на самый верх
window.scrollTo(0, 0);

// ---------------------------------------------------------

// Мобильное меню
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Анимации при скролле
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

reveals.forEach(reveal => {
    observer.observe(reveal);
});

// Модальные окна
function openModal(imgSrc, title) {
    const modal = document.getElementById('myModal');
    const modalBody = document.getElementById('modalBody');
    
    if (imgSrc) {
        modalBody.innerHTML = `
            <img src="${imgSrc}" alt="${title}">
            <h3>${title}</h3>
        `;
    } else {
        modalBody.innerHTML = `
            <h3>${title}</h3>
            <p>Подробная информация о студии.</p>
            <p>Здесь будет располагаться увеличенное фото и полное описание интерьера.</p>
        `;
    }
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}

// Закрытие по клику вне окна
window.onclick = function(event) {
    const modal = document.getElementById('myModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Обработка формы
function submitBooking(event) {
    event.preventDefault();
    openModal('', 'Спасибо!'); // Открываем кастомное окно
    document.getElementById('modalBody').innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 3rem; color: #C1A35F; margin-bottom: 20px;"></i>
        <h3>Заявка отправлена!</h3>
        <p>Спасибо! Мы свяжемся с вами для подтверждения записи.</p>
    `;
    document.getElementById('booking').reset(); // Очистка формы
}

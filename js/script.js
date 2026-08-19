// 1. Запрещаем браузеру запоминать старую позицию скролла
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// 2. Сбрасываем фокус
document.addEventListener('DOMContentLoaded', function() {
    if (document.activeElement) {
        document.activeElement.blur();
    }
});

// 3. Убираем якорь из адресной строки
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

// Модальные окна для дипломов
function openModal(imgSrc, title) {
    const modal = document.getElementById('myModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <img src="${imgSrc}" alt="${title}">
        <h3>${title}</h3>
    `;
    modal.style.display = 'flex';
}

// Модальное окно со СЛАЙДЕРОМ для студий
let galleryImages = [];
let currentIndex = 0;

function openGallery(images, title) {
    const modal = document.getElementById('myModal');
    const modalBody = document.getElementById('modalBody');
    galleryImages = images;
    currentIndex = 0;

    modalBody.innerHTML = `
        <h3 style="margin-bottom: 15px;">${title}</h3>
        <div class="gallery-container">
            <button class="gallery-btn gallery-prev" onclick="changeImage(-1)"><i class="fas fa-chevron-left"></i></button>
            <img src="${galleryImages[currentIndex]}" alt="${title}" id="galleryMainImg">
            <button class="gallery-btn gallery-next" onclick="changeImage(1)"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="gallery-counter">Фото ${currentIndex + 1} из ${galleryImages.length}</div>
    `;
    modal.style.display = 'flex';
}

function changeImage(direction) {
    currentIndex += direction;
    if (currentIndex >= galleryImages.length) {
        currentIndex = 0;
    }
    if (currentIndex < 0) {
        currentIndex = galleryImages.length - 1;
    }
    
    const img = document.getElementById('galleryMainImg');
    const counter = document.querySelector('.gallery-counter');
    if (img) img.src = galleryImages[currentIndex];
    if (counter) counter.textContent = `Фото ${currentIndex + 1} из ${galleryImages.length}`;
}

// Поддержка свайпов и клика мышкой для слайдера
let touchStartX = 0;
const modal = document.getElementById('myModal');

modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

modal.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    if (galleryImages.length > 0) { // Если открыта галерея
        if (touchStartX - touchEndX > 50) {
            changeImage(1); // Свайп влево -> следующее
        } else if (touchEndX - touchStartX > 50) {
            changeImage(-1); // Свайп вправо -> предыдущее
        }
    }
}, false);

// Стрелки на клавиатуре
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'flex' && galleryImages.length > 0) {
        if (e.key === 'ArrowRight') changeImage(1);
        if (e.key === 'ArrowLeft') changeImage(-1);
        if (e.key === 'Escape') closeModal();
    }
});

function closeModal() {
    document.getElementById('myModal').style.display = 'none';
    galleryImages = []; // Очищаем массив картинок при закрытии
}

// Закрытие по клику вне окна
window.onclick = function(event) {
    if (event.target == document.getElementById('myModal')) {
        closeModal();
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

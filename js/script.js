// 1. ОТКЛЮЧЕНИЕ ЗАПОМИНАНИЯ СКРОЛЛА (чтобы сайт всегда открывался сверху)
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
document.addEventListener('DOMContentLoaded', function() {
    if (document.activeElement) {
        document.activeElement.blur();
    }
});
if (window.location.hash) {
    history.replaceState(null, null, window.location.href.split('#')[0]);
}
window.scrollTo(0, 0);

// 2. МОБИЛЬНОЕ МЕНЮ
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// 3. АНИМАЦИИ ПРИ СКРОЛЛЕ
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

// 4. ЛОГИКА МОДАЛЬНЫХ ОКОН И СЛАЙДЕРА
const modal = document.getElementById('myModal');
const modalBody = document.getElementById('modalBody');
let galleryImages = [];
let currentIndex = 0;

function openModal(imgSrc, title) {
    galleryImages = []; // Очищаем массив дипломов
    modalBody.innerHTML = `
        <img src="${imgSrc}" alt="${title}">
        <h3>${title}</h3>
    `;
    modal.style.display = 'flex';
}

function openGallery(imagesArray, title) {
    galleryImages = imagesArray;
    currentIndex = 0;
    modalBody.innerHTML = `
        <h3 style="margin-bottom: 15px;">${title}</h3>
        <div class="gallery-container">
            <button class="gallery-btn gallery-prev" onclick="changeImage(-1)"><i class="fas fa-chevron-left"></i></button>
            <img src="${galleryImages[currentIndex]}" alt="${title}" id="galleryMainImg" style="max-width:100%; max-height:70vh; border-radius:8px;">
            <button class="gallery-btn gallery-next" onclick="changeImage(1)"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="gallery-counter" style="margin-top:10px; font-size:0.9rem; color:#888;">Фото ${currentIndex + 1} из ${galleryImages.length}</div>
    `;
    modal.style.display = 'flex';
}

function changeImage(direction) {
    if (galleryImages.length === 0) return;
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

// Назначаем клик на карточки студий
document.querySelectorAll('.studio-img-placeholder').forEach(card => {
    card.addEventListener('click', function() {
        const imagesStr = this.getAttribute('data-images');
        const title = this.getAttribute('data-title');
        if (imagesStr && title) {
            const imagesArr = imagesStr.split(',');
            openGallery(imagesArr, title);
        }
    });
});

// Поддержка свайпов для слайдера
let touchStartX = 0;
modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);
modal.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    if (galleryImages.length > 0) {
        if (touchStartX - touchEndX > 50) {
            changeImage(1);
        } else if (touchEndX - touchStartX > 50) {
            changeImage(-1);
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

// Закрытие модалки
function closeModal() {
    modal.style.display = 'none';
    galleryImages = [];
}
modal.querySelector('.modal-close').addEventListener('click', closeModal);
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// 5. ОБРАБОТКА ФОРМЫ ЗАПИСИ
function submitBooking(event) {
    event.preventDefault();
    openModal('', 'Спасибо!');
    modalBody.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 3rem; color: #C1A35F; margin-bottom: 20px;"></i>
        <h3>Заявка отправлена!</h3>
        <p>Спасибо! Мы свяжемся с вами для подтверждения записи.</p>
    `;
    document.querySelector('.booking-form').reset();
}
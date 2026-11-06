document.addEventListener("DOMContentLoaded", () => {
    let currentGlitchTarget = null;

    const hum = document.getElementById('lamp-hum');
    const glitchAudio = document.getElementById('lamp-glitch');

    // Запуск фонового гула при первом клике на страницу
    document.addEventListener('click', () => {
        if (hum && hum.paused) {
            hum.play().catch(e => console.log("Аудио заблокировано браузером"));
        }
    }, { once: true });

    function triggerGlitch() {
        const elements = document.querySelectorAll('p, h1, h2, td, .archive-box');
        if (elements.length > 0) {
            // Если старый элемент существовал, снимаем с него класс и звуковые слушатели
            if (currentGlitchTarget) {
                currentGlitchTarget.classList.remove('active-glitch');
                currentGlitchTarget.removeEventListener('mouseenter', onMouseEnter);
                currentGlitchTarget.removeEventListener('mouseleave', onMouseLeave);
            }

            // Выбираем новый случайный элемент
            currentGlitchTarget = elements[Math.floor(Math.random() * elements.length)];
            currentGlitchTarget.classList.add('active-glitch');

            // Вешаем звук при наведении на этот конкретный элемент
            currentGlitchTarget.addEventListener('mouseenter', onMouseEnter);
            currentGlitchTarget.addEventListener('mouseleave', onMouseLeave);

            // Держим глитч активным 4 секунды
            setTimeout(() => {
                if (currentGlitchTarget && !currentGlitchTarget.matches(':hover')) {
                    cleanupGlitch();
                }
            }, 4000);
        }
    }

    function onMouseEnter() {
        if (hum) hum.pause();
        if (glitchAudio) {
            glitchAudio.currentTime = 0;
            glitchAudio.play().catch(e => {});
        }
    }

    function onMouseLeave() {
        if (glitchAudio) glitchAudio.pause();
        if (hum) hum.play().catch(e => {});
        cleanupGlitch();
    }

    function cleanupGlitch() {
        if (currentGlitchTarget) {
            currentGlitchTarget.classList.remove('active-glitch');
            currentGlitchTarget.removeEventListener('mouseenter', onMouseEnter);
            currentGlitchTarget.removeEventListener('mouseleave', onMouseLeave);
            currentGlitchTarget = null;
        }
    }

    // Таймер глитча (для теста 10 секунд, потом вернешь сколько надо)
    setInterval(triggerGlitch, 10000);

    // Обработка клика для перехода на основной сайт
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.active-glitch');
        if (target) {
            document.body.style.filter = 'invert(100%) blur(2px)';
            setTimeout(() => {
                window.location.href = './main_site/restricted_area.html';
            }, 200);
        }
    });
});

// Перехватываем клик по глитчу
document.addEventListener('click', (e) => {
    const target = e.target.closest('.active-glitch');
    if (target) {
        e.preventDefault();
        const modal = document.getElementById('breach-modal');
        if (modal) modal.classList.add('visible');
    }
});

// Логика падающей кнопки и смайлика
const abortBtn = document.getElementById('abort-btn');
if (abortBtn) {
    abortBtn.addEventListener('click', () => {
        // Кнопка падает вниз
        abortBtn.classList.add('fall');

        // Через секунду после падения кнопки — пускаем в сам Restricted AREA
        setTimeout(() => {
            document.body.style.filter = 'invert(100%) blur(2px)';
            setTimeout(() => {
                window.location.href = 'restricted_area.html'; // Путь к главному сайту
            }, 300);
        }, 1000);
    });
}

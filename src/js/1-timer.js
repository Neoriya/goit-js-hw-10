import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;

const options = {
  enableTime: true, // Вмикає засіб вибору часу
  time_24hr: true, //Відображає засіб вибору часу в 24-годинному режимі
  defaultDate: new Date(), //Встановлює початкові вибрані дати.
  minuteIncrement: 1, //Регулює крок для введення хвилин

  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate <= new Date()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        messageColor: 'rgba(255, 255, 255, 1)',
        messageSize: '16px',
        backgroundColor: '#EF4040',
        position: 'topRight',
        messageLineHeight: '64px',
      });
      startBtn.disabled = true; // Деактивація кнопки "СТАРТ"
    } else {
      startBtn.disabled = false; // Активація кнопки "СТАРТ"
    }

    console.log(userSelectedDate);
  },
};

let flatpickrInstance = flatpickr('#datetime-picker', options);

const startBtn = document.querySelector('button[data-start]');
const calendar = document.querySelector('#datetime-picker');

startBtn.disabled = true;

// ------------------------------------------------------------------------

class Timer {
  constructor(convertFunction) {
    // Додано параметр для збереження функції convertMs

    this.isActive = false;
    this.convertFunction = convertFunction; // Зберігаємо посилання на функцію
    this.timerId = null; // Додано для зберігання id інтервалу
  }

  start() {
    if (this.isActive) {
      return;
    }

    const startTime = userSelectedDate.getTime();
    this.isActive = true;

    startBtn.disabled = true; // Деактивація кнопки
    // calendar.disabled = true; // Деактивація календаря (не працює як мені треба)
    calendar.classList.add('inactive'); // Додаємо клас 'inactive'
    flatpickrInstance.destroy(); // Деактивація календаря

    this.timerId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = startTime - currentTime;
      if (deltaTime <= 0) {
        this.stop();
        return;
      }

      const time = this.getTimeComponent(deltaTime); // Виклик функції convertMs
      console.log(time);
      updateTimerDisplay(time.days, time.hours, time.minutes, time.seconds);
    }, 1000);
  }

  stop() {
    clearInterval(this.timerId);
    this.isActive = false;

    flatpickrInstance = flatpickr('#datetime-picker', options); // Створення нового екземпляру flatpickr і оновлення посилання на нього
    // calendar.disabled = false; // Активація календаря
    calendar.classList.remove('inactive'); // Видаляємо клас 'inactive'
    startBtn.disabled = true; // Активація кнопки
  }

  getTimeComponent(time) {
    return this.convertFunction(time); // Викликаємо зовнішню функцію
  }
}

const timer = new Timer(convertMs); // Передаємо функцію convertMs під час створення екземпляра класу

startBtn.addEventListener('click', timer.start.bind(timer)); // Прив'язка методу start до екземпляра класу

// ------------------------------------------------------------------------

function convertMs(ms) {
  // Кількість мілісекунд на одиницю часу
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day); // Решта днів
  const hours = Math.floor((ms % day) / hour); // Решта годин
  const minutes = Math.floor(((ms % day) % hour) / minute); // Решта хвилин
  const seconds = Math.floor((((ms % day) % hour) % minute) / second); // Решта секунд

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0'); // Додавання нуля в таймері
}

// ------------------------------------------------------------------------

// Отримуємо посилання на всі елементи для відображення значень таймера
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

function updateTimerDisplay(days, hours, minutes, seconds) {
  // Оновлюємо значення елементів HTML
  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

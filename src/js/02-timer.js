// Підключаємо бібліотеку flatpickr для календаря
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from 'notiflix';

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    
    if(selectedDates[0] < Date.now()) {  
return Notiflix.Notify.failure('Please choose a date in the future', {position: 'center-top',});
    }
    refs.startBtn.disabled = false;
  },
};

const refs = {
  startBtn: document.querySelector('button[data-start]'),
  input: document.querySelector('input'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
} 

const fp = flatpickr("#datetime-picker", options);
refs.startBtn.disabled = true;

// Створюємо клас для таймера
class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.onTick = onTick;
  }

  // запуск таймера
  start() {
    const targetDate = fp.selectedDates[0];

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = targetDate - currentTime;
      const time = this.convertMs(deltaTime);

      this.onTick(time);

      if (deltaTime < 1000) {
        clearInterval(this.intervalId);
        refs.input.disabled = false;
      }
    }, 1000);
  }

  // Приймає час в мілісекундах, рахує скільки поміщається днів, годин, хвилин та секунд
  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
  
    const days = this.addLeadingZero(Math.floor(ms / day));
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    const minutes = this.addLeadingZero(Math.floor(((ms % day) % hour) / minute));
    const seconds = this.addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));
  
    return { days, hours, minutes, seconds };
  }

  //приймає число, приводить до рядка, та добавляє на початок 0, якщо менше 2 знаків
  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
}

// Викликаємо екземпляр класу
const timer = new Timer({
  onTick: updateMarkup,
});

// Додаємо слухача події на кнопку, та функцію яка запускає таймер
refs.startBtn.addEventListener('click', onStartBtnClick)

function onStartBtnClick () {
  refs.startBtn.disabled = true;
  refs.input.disabled = true;
  timer.start.bind(timer)();
}

// змінює інтерфес таймера кожну секунду 
function updateMarkup({ days, hours, minutes, seconds }) {
  refs.days.textContent = `${days}`;
  refs.hours.textContent = `${hours}`;
  refs.minutes.textContent = `${minutes}`;
  refs.seconds.textContent = `${seconds}`;
}
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const stopBtn = document.querySelector('[data-stop]');
const dateInput = document.getElementById('datetime-picker');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;
let isTimerRunning = false;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimer({ days, hours, minutes, seconds }) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function resetTimer() {
  updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
}

function setControlsState({ startDisabled, stopDisabled, inputDisabled }) {
  startBtn.disabled = startDisabled;
  stopBtn.disabled = stopDisabled;
  dateInput.disabled = inputDisabled;
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];

    if (!selected || selected <= new Date()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      userSelectedDate = null;
      setControlsState({
        startDisabled: true,
        stopDisabled: true,
        inputDisabled: false,
      });
    } else {
      userSelectedDate = selected;
      setControlsState({
        startDisabled: false,
        stopDisabled: true,
        inputDisabled: false,
      });
    }
  },
};

flatpickr(dateInput, options);

startBtn.addEventListener('click', () => {
  if (!userSelectedDate || isTimerRunning) return;

  isTimerRunning = true;
  setControlsState({
    startDisabled: true,
    stopDisabled: false,
    inputDisabled: true,
  });

  timerId = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now;
    if (diff <= 0) {
      clearInterval(timerId);
      isTimerRunning = false;
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setControlsState({
        startDisabled: true,
        stopDisabled: true,
        inputDisabled: false,
      });
      iziToast.success({
        message: 'Countdown finished!',
        position: 'topRight',
      });
      return;
    }
    updateTimer(convertMs(diff));
  }, 1000);

  updateTimer(convertMs(userSelectedDate - new Date()));
});

stopBtn.addEventListener('click', () => {
  if (!isTimerRunning) return;
  clearInterval(timerId);
  isTimerRunning = false;
  setControlsState({
    startDisabled: false,
    stopDisabled: true,
    inputDisabled: false,
  });
  iziToast.info({
    message: 'Timer stopped.',
    position: 'topRight',
  });
  resetTimer();
});

setControlsState({
  startDisabled: true,
  stopDisabled: true,
  inputDisabled: false,
});
resetTimer();

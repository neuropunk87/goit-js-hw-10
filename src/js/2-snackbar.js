import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();

  const delay = Number(event.target.elements.delay.value);
  const state = event.target.elements.state.value;

  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  })
    .then(delay => {
      iziToast.success({
        icon: '',
        message: `✅ Fulfilled promise in ${delay}ms`,
        backgroundColor: '#33c682',
        messageColor: '#fff',
        messageSize: '16px',
        position: 'topRight',
        maxWidth: '383px',
      });
    })
    .catch(delay => {
      iziToast.error({
        icon: '',
        message: `❌ Rejected promise in ${delay}ms`,
        backgroundColor: '#fe5549',
        messageColor: '#fff',
        messageSize: '16px',
        position: 'topRight',
        maxWidth: '383px',
      });
    });

  event.currentTarget.reset();
}

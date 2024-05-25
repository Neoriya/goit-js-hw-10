import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const delayInput = document.querySelector('input[type="number"][name="delay"]');
const stateRadios = document.querySelectorAll(
  'input[type="radio"][name="state"]'
);
const submitButton = document.querySelector('button[type="submit"]');

submitButton.addEventListener('click', handleButton);

function handleButton(event) {
  event.preventDefault(); // Запобігає перезавантаженню сторінки

  const delay = parseInt(delayInput.value); // Отримуємо значення затримки з поля вводу
  const state = Array.from(stateRadios).find(radio => radio.checked).value; // Знаходимо вибрану радіо-кнопку

  function createPromise(delay, state) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (state === 'fulfilled') {
          resolve(`✅ Fulfilled promise in ${delay}ms`);
        } else {
          reject(`❌ Rejected promise in ${delay}ms`);
        }
      }, delay);
    });
  }

  createPromise(delay, state)
    .then(message => {
      iziToast.success({
        title: 'Success',
        message: message,
      });
    })
    .catch(message => {
      iziToast.error({
        title: 'Error',
        message: message,
      });
    });

  delayInput.value = ''; // Очищення поля вводу
  stateRadios.forEach(radio => {
    radio.checked = false;
  }); // Очищення радіокнопок
}

// інший варіант логіки перевірки яка радіокнопка активна:

// const fulfilledRadio = document.querySelector('input[type="radio"][value="fulfilled"]');
// const rejectedRadio = document.querySelector('input[type="radio"][value="rejected"]');

// let state;
// if (fulfilledRadio.checked) {
//   state = 'fulfilled';
// } else if (rejectedRadio.checked) {
//   state = 'rejected';
// }

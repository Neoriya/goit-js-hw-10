import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// const inputWindow = document.querySelector('button[data-start]');
// const button = document.querySelector('#datetime-picker');

const prom = new Promise((reslove, reject) => {
  const random = Math.random();

  setTimeout(() => {
    if (random > 0.5) {
      reslove('fulfilled');
    } else {
      reject('rejected');
    }
  }, 1000);
});
console.log(prom);

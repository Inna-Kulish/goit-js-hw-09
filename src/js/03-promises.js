import Notiflix from 'notiflix';

const promiseForm = document.querySelector('.form');

promiseForm.addEventListener('submit', onSubmitForm);

function onSubmitForm(e) {
  e.preventDefault();

  const form = e.target;
  const firstDelay = Number(form.elements.delay.value);
  const step = Number(form.elements.step.value);
  const amount = Number(form.elements.amount.value);
  
  for (let i = 0; i < amount; i += 1) {
    const delay = firstDelay + i*step;
    const position = i + 1;

  createPromise(position, delay)
  .then(messagePromise)
  .catch(onRejected)
  .finally(() => form.reset());
  }
}

function createPromise(position, delay) {
  
    return new Promise ((resolve, reject) => {
      const shouldResolve = Math.random() > 0.3;
      
      setTimeout(() => {
        if (shouldResolve) {
          resolve({ position, delay })
        } else {
          reject({ position, delay })
        }
      }, delay)
    })
}

function messagePromise({position, delay}) {
  Notiflix.Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
}

function onRejected({position, delay}) {
  Notiflix.Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
}
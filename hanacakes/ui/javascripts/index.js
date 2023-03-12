/**
 * Import styles.
 */
import '../stylesheets/index.scss';

/**
 * Libraries.
 */
import feather from 'feather-icons';
import { tns } from 'tiny-slider/src/tiny-slider';
import { endOfWeek, getDay, setDay, startOfDay } from 'date-fns';

feather.replace();

window.cookieconsent.initialise({
  palette: {
    popup: {
      background: '#d73853'
    },
    button: {
      background: 'transparent',
      border: '#fff',
      text: '#fff'
    }
  },
  content: {
    message:
      'Táto web stránka používa 🍪 s cieľom zaistiť čo najlepší užívateľský zážitok.',
    dismiss: 'Rozumiem',
    link: 'Zisti viac',
    href: 'https://hanacakes.sk/stranky/gdpr'
  }
});

const nav = document.querySelector('[data-selector=nav]');
const navTrigger = document.querySelector('[data-trigger=nav]');
navTrigger.addEventListener('click', () => {
  nav.classList.toggle('header__nav--opened');
});
const showcasesEl = document.querySelector('.showcases');
if (showcasesEl) {
  tns({
    autoplay: true,
    autoplayButtonOutput: null,
    autoplayTimeout: 10000,
    container: '.showcases',
    controls: false,
    items: 1,
    loop: true,
    mouseDrag: true
  });
}

document.querySelectorAll('.message').forEach(message => {
  const timeout = setTimeout(
    () => message.classList.add('message--dismissed'),
    10000
  );
  message.querySelector('.message__close').addEventListener('click', () => {
    message.classList.add('message--dismissed');
    clearTimeout(timeout);
  });
});

document
  .querySelectorAll('[data-toggle=product-carousel-item]')
  .forEach(item => {
    const { target } = item.dataset;
    const targetElement = document.getElementById(target);
    item.addEventListener('mouseover', () => {
      const { src } = item.dataset;
      targetElement.src = src;
    });
  });

document.querySelectorAll('table').forEach(table => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('scrollable');
  table.parentNode.insertBefore(wrapper, table);
  wrapper.appendChild(table);
});

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', () => {
    const submitButton = form.querySelector('[type=submit]');
    submitButton.disabled = true;
  });
});

const pickupDate = document.getElementById('pickupDate');
if (pickupDate) {
  const flatpickrProps = {
    altFormat: 'd.m.Y',
    altInput: true,
    dateFormat: 'Z',
    disable: [
      {
        from: '2023-01-01',
        to: '2023-01-08'
      }
    ],
    locale: 'sk',
    minDate: 'today'
  };

  const today = new Date();

  if (getDay(today) >= 4) {
    const thursday = startOfDay(setDay(today, 4));
    const sunday = endOfWeek(today, {
      weekStartsOn: 1
    });

    flatpickrProps.disable.push({
      from: thursday,
      to: sunday,
    });
  }

  window.flatpickr(pickupDate, flatpickrProps);
}

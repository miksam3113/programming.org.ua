import './index.scss';

const phoneRegExp = /\d+/;
const emailRegExp = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

const uploader = document.querySelector('.uploader');
const uploaderFill = document.querySelector('.uploader_fill');
const closeBtn = document.getElementById('closeBtn');
const photo = document.getElementById('photo');

window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  Array.from(form.elements).forEach((input) => {
    if (input.type === 'checkbox') {
      const checked = localStorage.getItem(`anketa_adults_${input.name}`) || 'false';

      input.checked = checked === 'true';
    } else if (input.type === 'radio') {
      const checked =
        localStorage.getItem(`anketa_adults_${input.name}_${input.id}`) || input.id === 'true'
          ? 'false'
          : 'true';

      input.checked = checked === 'true';
    } else if (input.type === 'file') {
      const image = document.getElementById('photo');

      const dataImage = localStorage.getItem(`anketa_adults_${input.name}`) || null;

      if (dataImage) {
        uploaderFill.classList.remove('invisible');
        uploader.classList.add('invisible');

        image.src = dataImage;
      }
    } else {
      const value = localStorage.getItem(`anketa_adults_${input.name}`) || '';

      input.value = value;
    }
  });
});

document.querySelector('form').addEventListener('submit', (e) => {
  const form = e.target;
  let isValid = true;

  function setError(element) {
    element.classList.add('error');
    isValid = false;
  }

  function clearError(element) {
    element.classList.remove('error');
  }

  const city = form.city;
  const phone = form.phone;
  const email = form.email;
  const occupation = form.occupation;
  const experience = form.querySelector('input[name="experience"]:checked');
  const about = form.about;
  const findOut = form.find_out;
  const photo = form.photo;
  const agreement = form.agreement;

  [city, phone, email, occupation, about, findOut].forEach(clearError);

  if (!city.value.trim()) {
    setError(city);
  }

  if (!phoneRegExp.test(phone.value.trim())) {
    setError(phone);
  }

  if (!emailRegExp.test(email.value.trim())) {
    setError(email);
  }

  if (!occupation.value.trim()) {
    setError(occupation);
  }

  if (!experience) {
    isValid = false;
  }

  if (!about.value.trim()) {
    setError(about);
  }

  if (!findOut.value.trim()) {
    setError(findOut);
  }

  if (photo.files.length === 0) {
    setError(document.querySelector('.uploader'));
  }

  if (!agreement.checked) {
    setError(document.querySelector('.agreement'));
  }

  if (!isValid) {
    e.preventDefault();
  }
});

document.querySelectorAll('input, textarea').forEach((input) => {
  input.addEventListener('input', () => {
    if (input.type === 'checkbox') {
      localStorage.setItem(`anketa_adults_${input.name}`, input.checked);
    } else if (input.type === 'radio') {
      localStorage.setItem(`anketa_adults_${input.name}_${input.id}`, `${input.checked}`);
      localStorage.setItem(
        `anketa_adults_${input.name}_${input.id === 'true' ? 'false' : 'true'}`,
        `${!input.checked}`
      );
    } else if (input.type === 'file') {
      const file = input.files[0];

      if (!file) return;

      uploader.classList.add('invisible');
      uploaderFill.classList.remove('invisible');

      const reader = new FileReader();

      reader.onload = function (e) {
        const base64Image = e.target.result;

        photo.src = base64Image;

        localStorage.setItem('anketa_adults_photo', `${base64Image}`);
      };

      reader.readAsDataURL(file);
    } else {
      localStorage.setItem(`anketa_adults_${input.name}`, input.value);
    }

    function validation(input) {
      if (input.name !== 'phone' && input.name !== 'email' && input.name !== 'agreement') {
        return true;
      } else if (
        (input.name === 'phone' && phoneRegExp.test(input.value.trim())) ||
        (input.name === 'email' && emailRegExp.test(input.value.trim()))
      ) {
        return true;
      } else if (input.name === 'agreement') {
        document.querySelector('.agreement').classList.remove('error');
      }
      return false;
    }

    if (validation(input)) {
      input.classList.remove('error');
    }
  });
});

uploader.addEventListener('dragover', (e) => {
  uploader.classList.add('uploading');
  e.preventDefault();
});

uploader.addEventListener('dragleave', (e) => {
  uploader.classList.remove('uploading');
  e.preventDefault();
});

uploader.addEventListener('drop', (e) => {
  const files = e.dataTransfer.files;

  if (!files[0]) return;

  uploader.classList.add('invisible');
  uploaderFill.classList.remove('invisible');
  e.preventDefault();

  const reader = new FileReader();

  reader.onload = function (e) {
    const base64Image = e.target.result;

    photo.src = base64Image;

    localStorage.setItem('anketa_adults_photo', `${base64Image}`);
  };

  reader.readAsDataURL(files[0]);
});

closeBtn.addEventListener('click', () => {
  uploader.classList.remove('invisible');
  uploader.classList.remove('uploading');
  uploaderFill.classList.add('invisible');

  localStorage.removeItem(`anketa_adults_photo`);
});

uploader.addEventListener('click', () => {
  document.querySelector('input[name="photo"]').click();
});

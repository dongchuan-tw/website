const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
const yearSpan = document.getElementById('year');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

if (contactForm) {
  const requiredFields = [
    { name: 'name', label: '聯絡人姓名' },
    { name: 'email', label: '電子郵件' },
    { name: 'message', label: '敘述說明' },
  ];

  const setFieldError = (fieldName, message) => {
    const field = contactForm.elements.namedItem(fieldName);
    const error = contactForm.querySelector(`[data-error-for="${fieldName}"]`);

    if (!(field instanceof HTMLElement) || !(error instanceof HTMLElement)) {
      return;
    }

    if (message) {
      field.classList.add('is-invalid');
      error.textContent = message;
      return;
    }

    field.classList.remove('is-invalid');
    error.textContent = '';
  };

  requiredFields.forEach(({ name }) => {
    const field = contactForm.elements.namedItem(name);

    if (field instanceof HTMLElement) {
      field.addEventListener('input', () => {
        const value = 'value' in field ? String(field.value || '').trim() : '';
        if (value) {
          setFieldError(name, '');
        }
        if (formStatus) {
          formStatus.textContent = '';
        }
      });
    }
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const inquiryType = String(formData.get('inquiryType') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const values = { name, email, message };

    let hasError = false;

    requiredFields.forEach(({ name: fieldName, label }) => {
      if (!values[fieldName]) {
        setFieldError(fieldName, `${label}為必填項目`);
        hasError = true;
      } else {
        setFieldError(fieldName, '');
      }
    });

    if (hasError) {
      if (formStatus) {
        formStatus.textContent = '請先完成必填欄位。';
      }
      return;
    }

    const subject = encodeURIComponent(`東川實業網站來訊 - ${name}`);
    const body = encodeURIComponent(
      `聯絡人姓名：${name}\n電子郵件：${email}\n手機或電話：${phone || '未填寫'}\n合作項目：${inquiryType || '未填寫'}\n\n敘述說明：\n${message}`
    );

    if (formStatus) {
      formStatus.textContent = '正在開啟您的郵件程式...';
    }

    window.location.href = `mailto:info@dongchuan.tw?subject=${subject}&body=${body}`;
  });
}

const galleryTiles = Array.from(document.querySelectorAll('.lp-photo-mosaic .lp-photo-tile[href]'));

if (galleryTiles.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <div class="lightbox-stage" role="dialog" aria-modal="true" aria-label="圖片預覽">
      <button type="button" class="lightbox-close" aria-label="關閉預覽">×</button>
      <button type="button" class="lightbox-btn prev" aria-label="上一張">‹</button>
      <img class="lightbox-image" alt="">
      <button type="button" class="lightbox-btn next" aria-label="下一張">›</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  const stage = lightbox.querySelector('.lightbox-stage');
  const image = lightbox.querySelector('.lightbox-image');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-btn.prev');
  const nextBtn = lightbox.querySelector('.lightbox-btn.next');
  let currentIndex = 0;

  const renderImage = (index) => {
    const item = galleryTiles[index];
    if (!(item instanceof HTMLAnchorElement) || !(image instanceof HTMLImageElement)) {
      return;
    }
    const preview = item.querySelector('img');
    image.src = item.href;
    image.alt = preview ? preview.alt : '';
  };

  const openLightbox = (index) => {
    currentIndex = index;
    renderImage(currentIndex);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn instanceof HTMLButtonElement) {
      closeBtn.focus();
    }
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + galleryTiles.length) % galleryTiles.length;
    renderImage(currentIndex);
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % galleryTiles.length;
    renderImage(currentIndex);
  };

  galleryTiles.forEach((tile, index) => {
    tile.addEventListener('click', (event) => {
      event.preventDefault();
      openLightbox(index);
    });
  });

  if (closeBtn instanceof HTMLButtonElement) {
    closeBtn.addEventListener('click', (event) => {
      event.preventDefault();
      closeLightbox();
    });
  }
  if (prevBtn instanceof HTMLButtonElement) {
    prevBtn.addEventListener('click', (event) => {
      event.preventDefault();
      showPrev();
    });
  }
  if (nextBtn instanceof HTMLButtonElement) {
    nextBtn.addEventListener('click', (event) => {
      event.preventDefault();
      showNext();
    });
  }

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  if (stage instanceof HTMLElement) {
    stage.addEventListener('click', (event) => event.stopPropagation());
  }

  window.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) {
      return;
    }
    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      showPrev();
    } else if (event.key === 'ArrowRight') {
      showNext();
    }
  });
}

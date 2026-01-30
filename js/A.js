(function () {
  'use strict';

  // Jalankan setelah DOM siap
  document.addEventListener('DOMContentLoaded', function () {

    /* ===============================
       HERO BACKGROUND (SAFE)
    =============================== */
    try {
      const heroBg = document.querySelector('.st-hero-bg.st-dynamic-bg');
      if (heroBg && heroBg.dataset && heroBg.dataset.src) {
        heroBg.style.backgroundImage = `url(${heroBg.dataset.src})`;
      }
    } catch (err) {
      console.warn('Hero background error:', err);
    }


    /* ===============================
       FETCH BRAND LIST 
    =============================== */
    const brandContainer = document.getElementById('brand-list-modern');
    if (!brandContainer) return; 

    fetch('https://portal.sentralmedika.co.id/api/brands')
      .then(res => {
        if (!res.ok) throw new Error('HTTP Error ' + res.status);
        return res.json();
      })
      .then(res => {
        if (!res || !res.success || !Array.isArray(res.data)) return;

        brandContainer.innerHTML = res.data.map((b, i) => `
          <a href="/product/${b.slug}/"
             class="modern-product-card"
             data-aos="zoom-in"
             data-aos-delay="${i * 100}">
            <div class="modern-product-image">
              <img src="${b.foto}" alt="${b.nama}" loading="lazy">
            </div>
            <div class="modern-product-info">
              <h3 class="modern-product-title">${b.nama}</h3>
            </div>
          </a>
        `).join('');
      })
      .catch(err => {
        console.warn('Fetch brands failed:', err);
      });

  });
})();


      // Pastikan background image tetap di tempat, konten bergerak ke atas saat scroll
    document.addEventListener('DOMContentLoaded', function () {
      var heroBg = document.querySelector('.st-hero-bg.st-dynamic-bg');
      if (heroBg && heroBg.dataset.src) {
        heroBg.style.backgroundImage = 'url(' + heroBg.dataset.src + ')';
      }
    });

  
  fetch('https://portal.sentralmedika.co.id/api/brands')
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        document.getElementById('brand-list-modern').innerHTML = res.data.map((b, i) => `
          <a href="/product/${b.slug}/" class="modern-product-card" data-aos="zoom-in" data-aos-delay="${i * 100}">
            <div class="modern-product-image">
              <img src="${b.foto}" alt="${b.nama}">
            </div>
            <div class="modern-product-info">
              <h3 class="modern-product-title">${b.nama}</h3>
            </div>
          </a>
        `).join('');
      }
    });

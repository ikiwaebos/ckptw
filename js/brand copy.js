(async function () {
  'use strict';

  async function loadBrandAndProducts() {

    /* ===============================
       GET BRAND SLUG FROM URL
       /product/{brand-slug}
    =============================== */
    const pathParts = window.location.pathname.split('/');
    const productIdx = pathParts.indexOf('product');
    if (productIdx === -1 || !pathParts[productIdx + 1]) return;

    const brandSlug = pathParts[productIdx + 1];

    try {

      /* ===============================
         FETCH DATA (PARALLEL)
      =============================== */
      const [brandsRes, productsRes] = await Promise.all([
        fetch('https://portal.sentralmedika.co.id/api/brands'),
        fetch('https://portal.sentralmedika.co.id/api/products')
      ]);

      if (!brandsRes.ok || !productsRes.ok) return;

      const brandsData = await brandsRes.json();
      const productsData = await productsRes.json();

      if (!brandsData.success || !productsData.success) return;

      /* ===============================
         FIND SINGLE BRAND
      =============================== */
      const brand = brandsData.data.find(b => b.slug === brandSlug);
      if (!brand) return;

      /* ===============================
         RENDER BRAND INFO
      =============================== */
      const brandImg = document.getElementById('brand-img-modern');
      if (brandImg) {
        brandImg.src = brand.foto;
        brandImg.alt = brand.nama;
        brandImg.loading = 'lazy';
        brandImg.decoding = 'async';
      }

      const brandTitle = document.getElementById('brand-nama-title');
      if (brandTitle) {
        brandTitle.innerHTML = `${brand.nama} <span class="product-highlight">Products</span>`;
      }

      const brandDesc = document.getElementById('brand-deskripsi-main');
      if (brandDesc) {
        brandDesc.textContent = brand.deskripsi || '';
      }

      /* ===============================
         FILTER PRODUCTS BY BRAND
      =============================== */
      const brandProducts = productsData.data.filter(
        p => p.brand_slug === brandSlug
      );

      /* ===============================
         GROUP PRODUCTS BY CATEGORY
      =============================== */
      const kategoriMap = {};
      brandProducts.forEach(p => {
        if (!kategoriMap[p.kategori]) kategoriMap[p.kategori] = [];
        kategoriMap[p.kategori].push(p);
      });

      /* ===============================
         RENDER ACCORDION
      =============================== */
      const container = document.getElementById('modern-produk-accordions');
      if (!container) return;

      container.innerHTML = '';

      Object.entries(kategoriMap).forEach(([kategori, items], index) => {
        const list = items.map((p, i) => `
          <a href="/product/${brandSlug}/detail/${p.slug}" data-product-id="${p.id}">
            <span class="product-number">${i + 1}.</span>
            ${p.nama}
          </a>
        `).join('');

        container.insertAdjacentHTML('beforeend', `
          <div class="modern-accordion" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
            <button class="modern-accordion-header">
              ${kategori}
              <span class="product-count">(${items.length} products)</span>
              <i class="fas fa-chevron-down accordion-icon"></i>
            </button>
            <div class="modern-accordion-content">
              <div class="accordion-items-wrapper">
                ${list}
              </div>
            </div>
          </div>
        `);
      });

      /* ===============================
         ACCORDION INTERACTION
      =============================== */
      document.querySelectorAll('.modern-accordion-header').forEach(header => {
        header.addEventListener('click', function () {
          const content = this.nextElementSibling;
          const icon = this.querySelector('.accordion-icon');

          document.querySelectorAll('.modern-accordion-header').forEach(h => {
            if (h !== this) {
              h.classList.remove('active');
              h.nextElementSibling.classList.remove('active');
              h.querySelector('.accordion-icon').style.transform = 'rotate(0deg)';
            }
          });

          this.classList.toggle('active');
          content.classList.toggle('active');
          icon.style.transform = this.classList.contains('active')
            ? 'rotate(180deg)'
            : 'rotate(0deg)';
        });
      });

      /* ===============================
         BREADCRUMB (FIXED)
      =============================== */
      const breadcrumbMerek = document.getElementById('breadcrumb-merek');
      if (breadcrumbMerek) {
        breadcrumbMerek.innerHTML = `
          <a href="/product/${brand.slug}" style="color:#007bff;text-decoration:none;">
            ${brand.nama}
          </a>`;
      }

      const breadcrumbProduct = document.getElementById('breadcrumb-product');
      if (breadcrumbProduct) {
        breadcrumbProduct.textContent = 'Products';
      }

      /* ===============================
         REFRESH AOS
      =============================== */
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }

    } catch (err) {
      console.warn('Brand/Product load failed:', err);
    }
  }

  document.addEventListener('DOMContentLoaded', loadBrandAndProducts);

})();

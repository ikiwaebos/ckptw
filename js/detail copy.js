(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ===============================
       AOS INIT (SAFE)
    =============================== */
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }

    /* ===============================
       PRODUCT IMAGE MODAL
    =============================== */
    const img = document.getElementById('product-image');
    const modal = document.getElementById('img-modal');
    const modalImg = document.getElementById('img-modal-full');
    const modalCaption = document.getElementById('img-modal-caption');
    const modalClose = document.querySelector('.img-modal-close');

    if (img && modal && modalImg && modalClose) {
      img.onclick = function () {
        modal.style.display = 'block';
        modalImg.src = this.src;
        modalImg.alt = this.alt;
        if (modalCaption) modalCaption.textContent = this.alt;
      };
      modalClose.onclick = () => modal.style.display = 'none';
      modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
      document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.style.display = 'none'; });
    }

    /* ===============================
       FILE TYPE DETECTION (CARD)
    =============================== */
    function getFileExtension(url) {
      const clean = url.split('?')[0].split('#')[0];
      const name = clean.split('/').pop();
      return name && name.includes('.') ? name.split('.').pop().toLowerCase() : '';
    }

    function processCard(card) {
      const link = card.querySelector('a');
      if (link && link.href) {
        const ext = getFileExtension(link.href);
        if (ext) card.setAttribute('data-file-type', ext);
      }
    }

    document.querySelectorAll('.produk-link-card').forEach(processCard);

    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType === 1 && node.classList?.contains('produk-link-card')) {
            processCard(node);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    /* ===============================
       PRODUCT DETAIL (TAMBAHAN BARU)
    =============================== */
    (async function () {

      // brand slug
      const pathArr = window.location.pathname.split('/');
      const productIdx = pathArr.indexOf('product');
      let merek = '';
      if (productIdx !== -1 && pathArr[productIdx + 1]) {
        merek = pathArr[productIdx + 1];
      }

      // product slug
      let slug = '';
      const match = window.location.pathname.match(/\/detail\/([^\/]+)\/?$/);
      if (match) slug = match[1];

      let products = [];
      try {
        const res = await fetch('https://portal.sentralmedika.co.id/api/products');
        const json = await res.json();
        products = json.data || [];
      } catch (e) {
        products = [];
      }

      const product = products.find(p => p.slug === slug);

      /* ===== DROPDOWN PER MEREK ===== */
      const produkListMerek = products.filter(p => p.brand_slug === merek);
      const produkDropdown = document.getElementById('produk-list-merek-dropdown');

      if (produkDropdown) {
        if (produkListMerek.length) {
          produkDropdown.innerHTML = produkListMerek.map(p => `
            <option value="/product/${merek}/detail/${p.slug}" ${p.slug === slug ? 'selected' : ''}>
              ${p.nama}
            </option>
          `).join('');

          if (typeof jQuery !== 'undefined' && $.fn.select2) {
            $(produkDropdown).select2({
              placeholder: "Ketik untuk mencari produk dari merek ini...",
              width: '100%'
            });
            $(produkDropdown).on('select2:select', function (e) {
              var val = e.params.data.id;
              if (val) window.location.href = val;
            });
          } else {
            produkDropdown.onchange = function () {
              if (this.value) window.location.href = this.value;
            };
          }
        } else {
          produkDropdown.innerHTML = '<option>Tidak ada produk lain untuk merek ini.</option>';
        }
      }

      /* ===== PRODUCT FOUND ===== */
      if (product) {

        const breadcrumbMerek = document.getElementById('breadcrumb-merek');
        if (breadcrumbMerek) {
          breadcrumbMerek.innerHTML = `
            <a href="/product/${merek}" style="color:#007bff;text-decoration:none;">
              ${merek}
            </a>`;
        }

        const breadcrumbProduct = document.getElementById('breadcrumb-product');
        if (breadcrumbProduct) breadcrumbProduct.textContent = product.nama || '-';

        const productImage = document.getElementById('product-image');
        if (productImage) {
          productImage.src = product.foto;
          productImage.alt = product.nama;
          productImage.loading = 'lazy';
          productImage.decoding = 'async';
        }

        const productName = document.getElementById('product-name');
        if (productName) productName.textContent = product.nama;

        const productDesc = document.getElementById('product-description');
        if (productDesc) productDesc.textContent = product.deskripsi;

        const fileList = document.getElementById('file-list');

        function getFileIcon(ext) {
          switch (ext) {
            case 'pdf': return '<i class="fas fa-file-pdf" style="color:#e74c3c"></i>';
            case 'doc':
            case 'docx': return '<i class="fas fa-file-word" style="color:#2980b9"></i>';
            case 'xls':
            case 'xlsx': return '<i class="fas fa-file-excel" style="color:#27ae60"></i>';
            case 'ppt':
            case 'pptx': return '<i class="fas fa-file-powerpoint" style="color:#e67e22"></i>';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'webp': return '<i class="fas fa-file-image" style="color:#9b59b6"></i>';
            case 'zip':
            case 'rar':
            case '7z': return '<i class="fas fa-file-archive" style="color:#f39c12"></i>';
            case 'txt': return '<i class="fas fa-file-alt" style="color:#7f8c8d"></i>';
            default: return '<i class="fas fa-file" style="color:#95a5a6"></i>';
          }
        }

        if (fileList) {
          fileList.innerHTML = (product.files || []).map(f => {
            const ext = getFileExtension(f.url);
            return `
              <div class="produk-link-card">
                <a href="${f.url}" target="_blank">
                  <div class="produk-link-card-body">
                    <div class="file-icon">${getFileIcon(ext)}</div>
                    <div class="produk-link-card-title">${f.title}</div>
                  </div>
                </a>
              </div>
            `;
          }).join('');
        }

        if (typeof AOS !== 'undefined') AOS.refresh();

      } else {
        document.title = '404 - Produk Tidak Ditemukan';
        document.body.innerHTML = `
          <section style="text-align:center;padding:50px">
            <h1 style="font-size:80px">404</h1>
            <p>Produk tidak ditemukan</p>
            <a href="/product" style="padding:10px 20px;background:#007bff;color:#fff;border-radius:5px;text-decoration:none">
              Kembali ke daftar produk
            </a>
          </section>
        `;
      }

      /* ===== GLOBAL SEARCH FUNCTIONALITY ===== */
      const searchInput = document.getElementById('globalSearchInput');
      const searchResults = document.getElementById('globalSearchResults');

      if (searchInput && searchResults) {
        searchInput.addEventListener('input', function () {
          const term = this.value.toLowerCase();
          searchResults.innerHTML = '';

          if (term.length < 2) {
            searchResults.style.display = 'none';
            return;
          }

          const filtered = products.filter(p => p.nama && p.nama.toLowerCase().includes(term));
          if (filtered.length > 0) {
            let html = '<ul style="list-style: none; padding: 0; margin: 0;">';
            filtered.slice(0, 10).forEach(p => {
              const brandSlug = p.brand_slug || p.slug;
              const link = `/product/${brandSlug}/detail/${p.slug}`;
              html += `
                <li style="border-bottom: 1px solid #eee;">
                  <a href="${link}" style="display: block; padding: 12px 20px; color: #333; text-decoration: none; font-weight: 500; transition: background 0.2s;" onmouseover="this.style.background='#f8f9ff'; this.style.color='#18689a';" onmouseout="this.style.background='transparent'; this.style.color='#333';">
                    <span style="font-size: 0.9em; color: #8ec5fc; margin-right: 10px;">${p.brand_slug ? p.brand_slug.toUpperCase() : ''}</span>
                    ${p.nama}
                  </a>
                </li>`;
            });
            html += '</ul>';
            searchResults.innerHTML = html;
            searchResults.style.display = 'block';
          } else {
            searchResults.innerHTML = '<div style="padding: 15px 20px; color: #777;">Tidak ada produk ditemukan</div>';
            searchResults.style.display = 'block';
          }
        });

        document.addEventListener('click', function (e) {
          if (!e.target.closest('.global-search-container')) {
            searchResults.style.display = 'none';
          }
        });
      }

    })();

  });

})();

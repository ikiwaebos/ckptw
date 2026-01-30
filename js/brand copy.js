async function loadBrandAndProducts() {
    // Ambil slug merek dari URL, otomatis setelah '/product/'
    const pathParts = window.location.pathname.split('/');
    const productIdx = pathParts.indexOf('product');
    let slug = '';
    if (productIdx !== -1 && pathParts.length > productIdx + 1) {
        slug = pathParts[productIdx + 1];
    }

    // Fetch data
    const [brandsRes, productsRes] = await Promise.all([
        fetch('https://portal.sentralmedika.co.id/api/brands'),
        fetch('https://portal.sentralmedika.co.id/api/products')
    ]);
    const brands = (await brandsRes.json()).data;
    const products = (await productsRes.json()).data;




    // Temukan brand yang sesuai
    const brand = brands.find(b => b.slug === slug);


    if (!brand) return;



    // Tampilkan info brand - update untuk struktur baru
    document.getElementById('brand-img-modern').src = brand.foto;
    document.getElementById('brand-nama-title').innerHTML = `${brand.nama} <span class="product-highlight">Products</span>`;
    document.getElementById('brand-deskripsi-main').textContent = brand.deskripsi;

    // Filter produk sesuai brand_slug
    const filteredProducts = products.filter(p => p.brand_slug === slug);



    // Kelompokkan produk per kategori
    const kategoriMap = {};
    filteredProducts.forEach(p => {
        if (!kategoriMap[p.kategori]) kategoriMap[p.kategori] = [];
        kategoriMap[p.kategori].push(p);
    });

    // Render modern accordion per kategori
    const container = document.getElementById('modern-produk-accordions');
    container.innerHTML = '';
    Object.keys(kategoriMap).forEach((kat, index) => {
        const items = kategoriMap[kat].map((p, itemIndex) =>
            `<a href="/product/${slug}/detail/${p.slug}" data-product-id="${p.id}">
      <span class="product-number">${itemIndex + 1}.</span>
      ${p.nama}
    </a>`
        ).join('');

        container.innerHTML += `
    <div class="modern-accordion" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
      <button class="modern-accordion-header" data-category="${kat}">
        ${kat} <span class="product-count">(${kategoriMap[kat].length} products)</span>
        <i class="fas fa-chevron-down accordion-icon"></i>
      </button>
      <div class="modern-accordion-content">
        <div class="accordion-items-wrapper">
          ${items}
        </div>
      </div>
    </div>
  `;
    });
    // Inisialisasi event listener accordion modern
    document.querySelectorAll('.modern-accordion-header').forEach(function (header) {
        header.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.accordion-icon');

            // Close all other accordions
            document.querySelectorAll('.modern-accordion-header').forEach(function (otherHeader) {
                if (otherHeader !== header) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.classList.remove('active');
                    otherHeader.querySelector('.accordion-icon').style.transform = 'rotate(0deg)';
                }
            });

            // Toggle current accordion
            this.classList.toggle('active');
            content.classList.toggle('active');

            if (this.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

// Initialize AOS and load content
document.addEventListener('DOMContentLoaded', function () {
    loadBrandAndProducts();
});

// Breadcrumb
const breadcrumbMerek = document.getElementById("breadcrumb-merek");
breadcrumbMerek.innerHTML = `<a href="/product/${merek}" style="color: #007bff; text-decoration: none;">${merek}</a>`;
document.getElementById("breadcrumb-product").textContent = product.nama || "-";
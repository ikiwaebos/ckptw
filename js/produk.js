function accordianSetup() {
  // Sembunyikan semua konten accordian dan hanya tampilkan yang aktif
  $('.custom-accordian').children('.custom-accordian-body').hide();
  $('.custom-accordian.active').children('.custom-accordian-body').show();

  // Menambahkan event listener untuk klik pada judul accordian
  $('.custom-accordian-title').on('click', function () {
    var $parentaccordian = $(this).parent('.custom-accordian');
    var $icon = $(this).children('.custom-accordian-toggle');

    // Cek apakah accordian yang diklik sudah aktif
    if ($parentaccordian.hasClass('active')) {
      // Jika ya, tutup accordian, hilangkan kelas active dan putar kembali ikon
      $parentaccordian.removeClass('active').children('.custom-accordian-body').slideUp(250);
      $icon.removeClass('fa-angle-up').addClass('fa-angle-down');
    } else {
      // Jika tidak, tutup semua accordian yang lain, buka yang diklik, dan beri kelas active
      $('.custom-accordian').removeClass('active').children('.custom-accordian-body').slideUp(250);
      $('.custom-accordian .custom-accordian-toggle').removeClass('fa-angle-up').addClass('fa-angle-down');
      $parentaccordian.addClass('active').children('.custom-accordian-body').slideDown(250);
      $icon.removeClass('fa-angle-down').addClass('fa-angle-up');
    }
  });
}

// Panggil fungsi saat dokumen siap
$(document).ready(function() {
  accordianSetup();
});

function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: "en"
  }, "google_translate_element");

  $('img.goog-te-gadget-icon').attr('alt','Google Translate');
  $('div#goog-gt-tt div.logo img').attr('alt','translate');
  $('div#goog-gt-tt .original-text').css('text-align','left');
  $('.goog-te-gadget-simple .goog-te-menu-value span').css('color','#000000');
}

$(function () {
  $.getScript("//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit");

  const interval = setInterval(() => {
    if (document.querySelector('.goog-te-combo')) {
      clearInterval(interval);
      const msg = document.createElement('div');
      msg.className = 'translate-ready';
      msg.innerText = 'translate.google.com siap!';
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 4500);
    }
  }, 100);
});

function changeLang(lang) {
  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
  } else {
  
  }
}

function toggleFlagContainer() {
  const container = document.querySelector('.flag-container');
  const button = document.querySelector('.togglle-button');
  if (container.style.right === '0px') {
    container.style.right = '-400px';
    button.innerHTML = '🌐&#9654;';
  } else {
    container.style.right = '0px';
    button.innerHTML = '🌐&#9664;';
  }
}

function isAdBlockActive() {
  const adElement = document.getElementById('ad-detector');
  if (!adElement) return false; // tidak bisa mendeteksi jika elemen tidak ada
  return adElement.offsetHeight === 0 || adElement.offsetWidth === 0;
}

window.addEventListener('load', function () {
  setTimeout(() => {
    if (isAdBlockActive()) {
      console.log('AdBlock aktif');
      // lakukan aksi lain jika perlu
    } else {
      console.log('AdBlock tidak terdeteksi');
    }
  }, 1000); // delay untuk memberi waktu AdBlock bekerja
});


  AOS.init({
    once: true,
    duration: 900
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

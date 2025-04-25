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
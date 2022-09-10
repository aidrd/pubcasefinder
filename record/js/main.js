$(document).on('click', '.open-options', function (event) {
  event.preventDefault();
  $('#modal-options').iziModal('open');
});
$('#modal-options').iziModal({
  headerColor: '#26A69A', //ヘッダー部分の色
  width: 400, //横幅
  overlayColor: 'rgba(0, 0, 0, 0.5)', //モーダルの背景色
  fullscreen: true, //全画面表示
  transitionIn: 'fadeInUp', //表示される時のアニメーション
  transitionOut: 'fadeOutDown' //非表示になる時のアニメーション
});



$(function () {
  $('span').on('click', function (event) {
    let getId = $(this).parent().attr('.search-button');
    event.preventDefault();
    $(this).toggleClass('active');
  });
});
$('.tab-content>div').hide();
$('.tab-content>div').first().slideDown();
$('.tab-buttons span').click(function () {
  var thisclass = $(this).attr('class');
  $('.tab-content>div').each(function () {
    if ($(this).hasClass(thisclass)) {
      $(this).fadeIn(800);
    }
    else {
      $(this).hide();
    }
  });
});

$('.modal_open').click(function () {
  openModal(true)
});

$(function () {
  $('.tab-btn').on('click', function () {
    var tabWrap = $(this).parents('.tab-wrap');
    var tabBtn = tabWrap.find(".tab-btn");
    var tabContents = tabWrap.find('.tab-contents');
    tabBtn.removeClass('show');
    $(this).addClass('show');
    var elmIndex = tabBtn.index(this);
    tabContents.removeClass('show');
    tabContents.eq(elmIndex).addClass('show');

    if ($(tabContents.eq(elmIndex)).children('#geneModal')[0]) {
      geneTable()
    } else if ($(tabContents.eq(elmIndex)).find('#bodyModal')[0]) {
      bodyTable()
    }
  });
});

$(function () {
  $(".panel-btn").click(function () {
    var clickPanel = $("+.panel", this);
    clickPanel.toggle();
    $(".panel").not(clickPanel).slideUp(0);
    $(".panel:visible").prev().css("background", "#ff5b77");
    $(".panel:hidden").prev().css("background", "#F73859");
    return false;
  });

});
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
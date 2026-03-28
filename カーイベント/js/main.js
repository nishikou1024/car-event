/*---イベントサイト JS---*/

$(function () {
    // リロード時の位置復元を完全に殺す
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    $('.tab-menu a').on('click', function (e) {
        e.preventDefault();

        var targetId = $(this).attr('href');
        var $target = $(targetId);
        var windowWidth = $(window).width();
        var $menu = $('.tab-menu'); // スクロールさせたい基準点

        if (!$target.length) return;

        // タブのアクティブ表示切り替え
        $('.tab-menu a').removeClass('active');
        $(this).addClass('active');

        if (windowWidth > 768) {
            // PC：スムーススクロール
            var position = $target.offset().top - 10;
            $('html, body').stop().animate({ scrollTop: position }, 700);
        } else {
            // --- スマホ：ガクつきを抑えた切り替え ---

            // 1. 今のスクロール位置を一旦変数に保存（動かさないため）
            var currentScroll = $(window).scrollTop();

            // 2. セクションを切り替える（この瞬間、高さが変わって画面がガタつく可能性がある）
            $('section.wrapper').hide().removeClass('active-section');
            $target.show().addClass('active-section');

            // 3. ブラウザが勝手に位置を補正しようとするのを防ぐため、
            // 「今の位置」を維持したまま、即座に目的地へジャンプさせる
            
            // 目的地：メインビジュアルの高さ（＝タブメニューが一番上にくる位置）
            var destination = $('.mainvisual').outerHeight();

            // requestAnimationFrameを使うと、ブラウザの描画タイミングに合わせられるので
            // setTimeoutよりさらに滑らか（ガクつきにくい）になります
            requestAnimationFrame(function() {
                window.scrollTo({
                    top: destination,
                    behavior: 'instant' // 余計なアニメーションをさせず、一瞬で切り替える
                });
            });
        }
    });
});
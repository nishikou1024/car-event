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
            // --- スマホ：【最終解決】scrollIntoViewハック ---

            // 1. まずコンテンツを切り替える（非表示にしてから表示）
            $('section.wrapper').removeClass('active-section');
            $target.addClass('active-section');

            // 2. ブラウザが勝手にスクロール位置をズラすのを待ってから（100ms）、
            // 「メニューの場所を画面の一番上に持ってこい」と強制命令を出す
            setTimeout(function() {
                $menu[0].scrollIntoView({
                    behavior: 'instant', // 瞬間移動
                    block: 'start'       // 画面の「上」に合わせる
                });
            }, 100); // 0.1秒待つのがミソです
        }
    });
});
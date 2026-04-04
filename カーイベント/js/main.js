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
            // --- スマホ：タブメニューを最上部に固定して切り替える ---

            // 1. セクションを切り替える
            $('section.wrapper').hide().removeClass('active-section');
            $target.show().addClass('active-section');

            // 2. ヘッダーがないので高さは 0
            var headerHeight = 0;

            // 3. タブメニューの固定位置を最上部(0)に設定
            $('.tab-menu').css({
                'position': 'sticky',
                'top': '0px',
                'z-index': '99'
            });

            // 4. 目的地を「メインビジュアルの高さ」ピッタリにする
            var mainVisualHeight = $('.mainvisual').outerHeight();
            
            // タブが最上部に張り付く瞬間は、メインビジュアルが完全に隠れた位置です
            // 確実に張り付かせるために、少しだけプラス（+1〜10px程度）してもOKです
            var destination = mainVisualHeight;

            // 5. 即座にジャンプ
            setTimeout(function() {
                window.scrollTo({
                    top: destination,
                    behavior: 'instant'
                });
            }, 0);
        }
    });
});
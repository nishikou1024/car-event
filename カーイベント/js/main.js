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
            setTimeout(function () {
                $menu[0].scrollIntoView({
                    behavior: 'instant', // 瞬間移動
                    block: 'start'       // 画面の「上」に合わせる
                });
            }, 100); // 0.1秒待つのがミソです
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const fadeItems = document.querySelectorAll('.fade');
    const revealItems = document.querySelectorAll('.js-reveal');

    if (!fadeItems.length && !revealItems.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const target = entry.target;

            if (target.classList.contains('fade')) {
                target.classList.add('show');
            }

            if (target.classList.contains('js-reveal')) {
                target.classList.add('is-visible');
            }

            obs.unobserve(target);
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15
    });

    fadeItems.forEach((item) => observer.observe(item));
    revealItems.forEach((item) => observer.observe(item));
})

    /* =========================
        schedule progress line
    ========================= */
    const scheduleList = document.querySelector('.js-schedule-list');
    const scheduleProgress = document.querySelector('.js-schedule-progress');

    if (scheduleList && scheduleProgress) {
        let ticking = false;

        const updateScheduleProgress = () => {
            const rect = scheduleList.getBoundingClientRect();
            const viewportH = window.innerHeight;

            // セクションが見え始めてから、見え終わるまでの進行率
            const start = viewportH * 0.88;
            const end = viewportH * 0.18;
            const total = rect.height + (start - end);
            const passed = start - rect.top;
            let progress = passed / total;

            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            const lineTopOffset = 10;
            const lineBottomOffset = 10;
            const maxHeight = scheduleList.offsetHeight - lineTopOffset - lineBottomOffset;
            const currentHeight = maxHeight * progress;

            scheduleProgress.style.height = currentHeight + 'px';

            ticking = false;
        };

        const onScrollOrResize = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScheduleProgress);
                ticking = true;
            }
        };

        updateScheduleProgress();
        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize);
        window.addEventListener('load', updateScheduleProgress);
    }

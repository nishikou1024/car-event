/*--- イベントサイト JS ---*/

$(function () {
    // リロード時の位置復元を無効化（ブラウザの自動スクロール干渉を防ぐ）
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    /* =========================
        1. タブメニュー切り替え
    ========================= */
    $('.tab-menu a').on('click', function (e) {
        e.preventDefault();

        var targetId = $(this).attr('href');
        var $target = $(targetId);
        var windowWidth = $(window).width();

        if (!$target.length) return;

        // アクティブ表示の切り替え
        $('.tab-menu a').removeClass('active');
        $(this).addClass('active');

        if (windowWidth > 768) {
            // 【PC】スムーススクロール
            var position = $target.offset().top - 10;
            $('html, body').stop().animate({ scrollTop: position }, 700);
        } else {
            // 【スマホ】タブメニューを最上部に固定して切り替える
            
            // セクションを切り替える
            $('section.wrapper').hide().removeClass('active-section');
            $target.show().addClass('active-section');

            // タブメニューをstickyで固定（CSSで設定済みなら削除可）
            $('.tab-menu').css({
                'position': 'sticky',
                'top': '0px',
                'z-index': '99'
            });

            // 目的地をメインビジュアルの高さに設定
            var mainVisualHeight = $('.mainvisual').outerHeight();
            var destination = mainVisualHeight;

            // 即座にジャンプ（setTimeout 0で実行順を保証）
            setTimeout(function() {
                window.scrollTo({
                    top: destination,
                    behavior: 'instant'
                });
            }, 0);
        }
        
        // 他のスクロールイベントが動かないようにイベントを停止させる（重要！）
        return false;
    });
});

/* =========================
    2. Intersection Observer (フェードイン演出)
========================= */
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
});

/* =========================
    3. スケジュール進行線 (Progress Line)
========================= */
const scheduleList = document.querySelector('.js-schedule-list');
const scheduleProgress = document.querySelector('.js-schedule-progress');

if (scheduleList && scheduleProgress) {
    let ticking = false;

    const updateScheduleProgress = () => {
        const rect = scheduleList.getBoundingClientRect();
        const viewportH = window.innerHeight;
        const start = viewportH * 0.88;
        const end = viewportH * 0.18;
        const total = rect.height + (start - end);
        const passed = start - rect.top;
        let progress = Math.min(Math.max(passed / total, 0), 1);

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

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('load', updateScheduleProgress);
}

/* =========================
    4. 汎用スムーススクロール (タブメニュー除外設定)
========================= */
$(function () {
    // 【最重要修正】 '.tab-menu a' は除外する
    $('a[href^="#"]').not('.tab-menu a').on('click', function (e) {
        const targetId = $(this).attr('href');
        const $target = $(targetId);

        if (!$target.length) return;

        e.preventDefault();

        const headerHeight = $('.header').outerHeight() || 0;
        const position = $target.offset().top - headerHeight;

        $('html, body').stop().animate({
            scrollTop: position
        }, 600);
    });
});

/* =========================
    5. ハンバーガーメニュー
========================= */
document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.header');
    const toggle = document.querySelector('.header__toggle');
    const navLinks = document.querySelectorAll('.header__nav a');

    if (!header || !toggle) return;

    toggle.addEventListener('click', function () {
        header.classList.toggle('is-open');
        const isOpen = header.classList.contains('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', function () {
            header.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
});


/* =========================
    6. 固定ナビ（MAIN/TOPボタン）の表示制御
========================= */
$(window).on('scroll load', function () {
    // ボタンの親要素を取得
    const $fixedNav = $('.fixed-navigation');
    if ($fixedNav.length === 0) return;

    const scrollTop = $(window).scrollTop();
    const $tabMenu = $('.tab-menu, .tabs-container').first();
    let threshold = 500;

    if ($tabMenu.length > 0) {
        threshold = $tabMenu.offset().top - 100;
    }

    // 両方のボタンが入った親要素に対してクラスを付け外しする
    if (scrollTop > threshold) {
        $fixedNav.addClass('is-visible');
    } else {
        $fixedNav.removeClass('is-visible');
    }
});
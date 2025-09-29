const windowwidth = $(window).width()

if (window.matchMedia('(min-width: 1440px)').matches) {
  document.addEventListener("DOMContentLoaded", () => {
    const pageNav = document.getElementById('page-nav');
    const footer = document.getElementById('footer');
    const firstSection = document.getElementById('about');
    const navLinks = document.querySelectorAll(".page-nav__link");
  
    if (!pageNav || !footer || !firstSection || navLinks.length === 0) return;
  
    let lastScrollY = window.scrollY;
    let isTicking = false;
  
    const updateNavVisibility = () => {
  
      const firstSectionTop = firstSection.getBoundingClientRect().top;
      const isInview = firstSectionTop > 240;
      pageNav.classList.toggle('is-hidden', isInview);
    }
  
    const updateCurrentSection = () => {
      navLinks.forEach(link => {
        link.classList.remove("is-current");
        const sectionId = link.getAttribute("href");
        const section = document.querySelector(sectionId);
        if (section) {
          const sectionTop = section.offsetTop - 240;
          const sectionBottom = sectionTop + section.offsetHeight;
          if (lastScrollY >= sectionTop && lastScrollY <= sectionBottom) {
            link.classList.add("is-current");
          }
        }
      });
    }
  
    const onScroll = () => {
      if (isTicking) return;
      lastScrollY = window.scrollY;
      isTicking = true;
  
      requestAnimationFrame(() => {
        updateNavVisibility();
        updateCurrentSection();
        isTicking = false;
      });
    }
  
    window.addEventListener('scroll', onScroll);
  
    // 初期状態を設定
    updateNavVisibility();
    updateCurrentSection();
  });
} else{

  document.addEventListener("DOMContentLoaded", () => {
    const pageNav = document.getElementById('page-nav');
    const footer = document.getElementById('footer');
    const firstSection = document.getElementById('about');
    const navLinks = document.querySelectorAll(".page-nav__link");
  
    if (!pageNav || !footer || !firstSection || navLinks.length === 0) return;
  
    let lastScrollY = window.scrollY;
    let isTicking = false;
  
    const updateNavVisibility = () => {
  
      const firstSectionTop = firstSection.getBoundingClientRect().top;
      const isInview = true;
      pageNav.classList.toggle('is-hidden', isInview);
    }
  
    const updateCurrentSection = () => {
      navLinks.forEach(link => {
        link.classList.remove("is-current");
        const sectionId = link.getAttribute("href");
        const section = document.querySelector(sectionId);
        if (section) {
          const sectionTop = section.offsetTop - 240;
          const sectionBottom = sectionTop + section.offsetHeight;
          if (lastScrollY >= sectionTop && lastScrollY <= sectionBottom) {
            link.classList.add("is-current");
          }
        }
      });
    }
  
    const onScroll = () => {
      if (isTicking) return;
      lastScrollY = window.scrollY;
      isTicking = true;
  
      requestAnimationFrame(() => {
        updateNavVisibility();
        updateCurrentSection();
        isTicking = false;
      });
    }
  
    window.addEventListener('scroll', onScroll);
  
    // 初期状態を設定
    updateNavVisibility();
    updateCurrentSection();
  });
}



var TxtRotate = function(el, period) {
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var fullTxt = "This is\nKey-S\nWebsite.";

  if (!this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt.replace(/\n/g, "<br>")+'</span>';

  var that = this;

  if (!this.isDeleting) {
    var delta = 150 - Math.random() * 100;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    delta = 10000;
  }
  if(this.isDeleting){
    delta = 10000;
    this.el.innerHTML = '<span class="wrap" id="blink">'+this.txt.replace(/\n/g, "<br>")+'</span>';
  }

  setTimeout(function() {
    that.tick();
  }, delta);

};

window.onload = function() {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var period = elements[i].getAttribute('data-period');
    new TxtRotate(elements[i], period);
  }
  elements.id = 'blink';
  // INJECT CSS
  var css = document.createElement("style");

  document.body.appendChild(css);
};




// swiper-wrapperの設定

document.addEventListener('DOMContentLoaded', function() {
    // ページ内のすべての.swiperコンテナを取得
    const swiperContainers = document.querySelectorAll('.swiper');

    swiperContainers.forEach(container => {
        // Swiperインスタンスを保持するための変数
        let swiperInstance;

        // Swiperの初期化関数
        const initSwiper = () => {
             // 既存のインスタンスがあれば破棄（二重初期化を防ぐ）
            if (swiperInstance) {
                swiperInstance.destroy(true, true);
            }
            
            // 新しいSwiperを初期化
            swiperInstance = new Swiper(container, {
                // スライド設定 (ここはお客様の既存設定を維持)
                slidesPerView: 1.2, 
                spaceBetween: 10,
                slidesOffsetBefore: 40, 
                slidesOffsetAfter: 40,

                navigation: {
                    nextEl: container.querySelector(".swiper-button-next"),
                    prevEl: container.querySelector(".swiper-button-prev")
                },

                breakpoints: {
                    0: {
                        slidesPerView: 2.5, 
                        spaceBetween: 50,
                        slidesOffsetBefore: 30,
                        slidesOffsetAfter: 30
                    },
                    600: {
                        slidesPerView: 2.5, 
                        spaceBetween: 70, 
                        slidesOffsetBefore: 50,
                        slidesOffsetAfter: 50
                    }
                }
            });
        };

        // ページ読み込み時に初期化
        initSwiper();

        /* 画面サイズ変更時の対応ロジックを追加 */
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            // リサイズが止まってから処理を実行
            resizeTimer = setTimeout(function() {
                // Swiperの update() を呼び出し、現在のサイズに合わせて位置を再計算させる
                if (swiperInstance) {
                    swiperInstance.update();
                    // 必要に応じて、最初のスライドに移動させる
                    // swiperInstance.slideTo(0); 
                }
            }, 300); // 300ms後に実行
        });
        /* 画面サイズ変更時の対応ロジック END */
    });
});

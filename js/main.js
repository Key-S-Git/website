window.onload = () => {
    const menuList = document.getElementById("header-ul");
    const menuCheckbox = document.getElementById("menu-check");

    document.addEventListener("click", (event) => {
        if (event.target !== menuList && event.target !== menuCheckbox) {
            menuCheckbox.checked = false;
        }
    });
};

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ナビゲーションの連動処理
document.addEventListener("DOMContentLoaded", () => {
    const pageNav = document.getElementById('page-nav');
    const firstSection = document.getElementById('about');
    const navLinks = document.querySelectorAll(".page-nav-link");
    
    // リンク先のセクション要素を配列化しておく
    const sections = Array.from(navLinks).map(link => {
        return document.querySelector(link.getAttribute("href"));
    });

    if (!pageNav || !firstSection || navLinks.length === 0) return;

    // 現在のセクションを判定してクラスを付与する関数
    const updateCurrentSection = () => {
        const scrollY = window.scrollY;
        const offset = 240; // 判定のしきい値

        sections.forEach((section, index) => {
            if (!section) return;
            const sectionTop = section.offsetTop - offset;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                navLinks[index].classList.add("is-current");
            } else {
                navLinks[index].classList.remove("is-current");
            }
        });

        // Aboutセクションより上ならナビを隠す（既存のロジック）
        const firstSectionTop = firstSection.getBoundingClientRect().top;
        pageNav.classList.toggle('is-hidden', firstSectionTop > 240);
    };

    // スクロール時に実行（リクエストアニメーションで最適化）
    let isTicking = false;
    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                updateCurrentSection();
                isTicking = false;
            });
            isTicking = true;
        }
    });

    // 初回実行
    updateCurrentSection();
});



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

window.addEventListener('load', function() {
  var elements = document.getElementsByClassName('txt-rotate');

  // 10秒後にテキスト回転を開始する
  setTimeout(function() {
    for (var i=0; i<elements.length; i++) {
      var period = elements[i].getAttribute('data-period');
      new TxtRotate(elements[i], period);
    }

    var css = document.createElement("style");
    document.body.appendChild(css);
  }, 1000); // 10000ミリ秒 = 10秒の遅延

});

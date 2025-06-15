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
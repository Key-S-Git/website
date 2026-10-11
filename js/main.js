// ===== 設定 =====
const TYPING_TEXT = 'This is\nKey-S\nWebsite.';
const TYPING_START_DELAY = 1000; // ms
const HEADER_THRESHOLD = 50;     // px

// ===== ヘッダー =====
// 一定量スクロールしたらクラスを付与、戻ったら除去
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  if (!header) return;

  let ticking = false;

  const update = () => {
    const scrolled = window.scrollY < HEADER_THRESHOLD;
    header.classList.toggle('not-scrolled', scrolled);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update(); // 読み込み時にすでにスクロール済みの場合に対応
});

// ===== タイピング演出 =====
function typeText(el, text) {
  let i = 0;

  const step = () => {
    i++;
    const html = text.slice(0, i).replace(/\n/g, '<br>');
    const done = i >= text.length;

    // 完了後は点滅用の id を付けて終了
    el.innerHTML = `<span class="wrap"${done ? ' id="blink"' : ''}>${html}</span>`;

    if (!done) setTimeout(step, 150 - Math.random() * 100);
  };

  step();
}

window.addEventListener('load', () => {
  const elements = document.querySelectorAll('.txt-rotate');
  setTimeout(() => {
    elements.forEach(el => typeText(el, TYPING_TEXT));
  }, TYPING_START_DELAY);
});

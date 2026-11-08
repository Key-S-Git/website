let bar = new ProgressBar.Line('.bar-wrapper', {
  strokeWidth: 5,
  easing: 'easeInOut',
  duration: 1400,
  color: 'var(--key-accent)',
  trailColor: 'var(--key-gray)',
  trailWidth: 1,
  svgStyle: {width: '100%', height: '100%'},
  text: {
    style: {
      // テキストカラー等
      color: 'var(--key-accent)',
      position: 'absolute',
      left: '50%', // 中央配置の修正

      padding: 0,
      margin: 0,
      transform: 'translateX(-50%)', // 中央配置の修正
      fontSize: '30px'
    },
    autoStyleContainer: false
  },
  from: {color: '#FFEA82'},
  to: {color: '#ED6A5A'},
});


// ===== ローディングテキストのアニメーション =====
const loadingTexts = [
    'Loading',
    'Loading.',
    'Loading..',
    'Loading...'
];
let textIndex = 0;

bar.setText(loadingTexts[textIndex]);
textIndex++; // 次のループのためにインデックスをインクリメント

// テキスト更新用のタイマーを設定し、変数に保持
const loadingTextInterval = setInterval(function() {
    const currentText = loadingTexts[textIndex % loadingTexts.length];
    bar.setText(currentText);
    textIndex++;
}, 300); // 300ミリ秒ごとに更新


// ===== fetch完了を待つための Promise を公開 =====
// ※ このJSは fetch側のJSより先に読み込むこと
let resolveDataLoaded;
window.dataLoaded = new Promise(function (resolve) {
    resolveDataLoaded = resolve;
});
window.notifyDataLoaded = function () {
    resolveDataLoaded();
};

// fetch を使わないページ(<html data-no-fetch>)は、待たずにすぐ解決する
if (document.documentElement.hasAttribute('data-no-fetch')) {
    resolveDataLoaded();
}


// ===== プログレスバーの制御 =====
// 1. まずアニメーションで99%まで進める (ロード完了を待たずに即時実行)
bar.animate(0.99, { duration: 3000 }); // 3秒かけて99%まで

// 2. window.load の完了を待つ Promise
//    (すでに load 済みでも確実に resolve されるようにする)
const windowLoaded = new Promise(function (resolve) {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.addEventListener('load', resolve);
    }
});

// 3. window.load と fetch の両方が終わったら 100% にしてフェードアウト
Promise.all([windowLoaded, window.dataLoaded]).then(function () {
    clearInterval(loadingTextInterval); // テキスト更新タイマーを停止

    bar.animate(1.0, { duration: 300 }, function () {
        const spinner = document.getElementById("loading");
        spinner.classList.add("loaded"); // loaded クラス付与

        // 1秒待機してからフェードアウト
        setTimeout(function() {
            $(".wrap").fadeOut(800);
        }, 1000);
    });
});

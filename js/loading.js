var bar = new ProgressBar.Line('.bar-wrapper', {
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
    // 配列からテキストを取得
    const currentText = loadingTexts[textIndex % loadingTexts.length];
    
    // progressbar.js の setText メソッドでテキストを更新
    bar.setText(currentText);
    
    // インデックスを進める
    textIndex++;

}, 300); // 300ミリ秒ごとに更新 (ループの速度)



// 1. まずアニメーションで99%まで進める (ロード完了を待たずに即時実行)
bar.animate(0.99, { duration: 3000 }); // 3秒かけて99%まで

// 2. 実際のロード完了を待つ
window.addEventListener('load', function () {
    // 3. ロードが完了したら、残りの10%を一瞬で100%にする
    bar.animate(1.0, { duration: 300 }, function () {
        const spinner = document.getElementById("loading");
        spinner.classList.add("loaded"); // loaded クラス付与
        
        // 1秒待機してからフェードアウト
        setTimeout(function() {
          $(".wrap").fadeOut(800);
        }, 1000);
    });
});

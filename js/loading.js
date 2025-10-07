var bar = new ProgressBar.Line('.bar-wrapper', {
  strokeWidth: 4,
  easing: 'easeInOut',
  duration: 1400,
  color: '#00face',
  trailColor: '#1d1d1f',
  trailWidth: 1,
  svgStyle: {width: '100%', height: '100%'},
  text: {
    style: {
      // テキストカラー等
      color: '#00face',
      position: 'absolute',
      left: '50%', // 中央配置の修正

      padding: 0,
      margin: 0,
      transform: 'translateX(-50%)' // 中央配置の修正
    },
    autoStyleContainer: false
  },
  from: {color: '#FFEA82'},
  to: {color: '#ED6A5A'},
  step: (state, bar) => {
    bar.setText(Math.round(bar.value() * 100) + ' %');
  }
});

// 1. まずアニメーションで90%まで進める (ロード完了を待たずに即時実行)
bar.animate(0.9, { duration: 3000 }); // 3秒かけて90%まで

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

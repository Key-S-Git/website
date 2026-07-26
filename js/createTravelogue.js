// URLの ?id=◯◯ の部分を取得
const urlParams = new URLSearchParams(window.location.search);
const travelId = urlParams.get('id');

fetch('json/travelogue.json')
  .then(res => res.json())
  .then(allData => {
    const data = allData[travelId]; // travelogue.jsonより、指定されたIDのデータだけ取り出す

    if (!data) {
      document.body.innerHTML = "データが見つかりませんでした。";
      return;
    }

    // タイトルの反映
    document.getElementById('title').textContent = data.title;

    // 日付の反映
    document.getElementById('date').textContent = data.date;

    // メインイベントの反映
    const eventList = document.getElementById('event-list');
    data.mainEvents.forEach(event => {
      const li = document.createElement('li');
      li.className = 'event';
      li.textContent = event;
      // eventListの子要素に、メインイベントを記述した<li>タグを挿入
      eventList.appendChild(li);
    });

    // アルバム（画像）の反映
    const albumContainer = document.getElementById('album-container');
    const albumHtml = data.album.map(item => `
      <div class="box">
        <a data-fancybox="gallery" href="${item.src}" class="album-item">
          <img src="${item.src}" loading="lazy">
        </a>
      </div>
    `).join('');
    
    albumContainer.innerHTML = albumHtml;

    // Fancyboxの再初期化（動的追加の場合に必要）
    // すでに読み込まれているFancyboxを適用させる
    $('[data-fancybox="gallery"]').fancybox({
      // オプションが必要ならここに記述
    });
  });

import { fetchDataById } from './common.js';

// URLの ?id=◯◯ の部分を取得
const urlParams = new URLSearchParams(window.location.search);
const travelId = urlParams.get('id');

(async () => {
  const data = await fetchDataById('json/travelogue.json', travelId);
  if (!data) return; // fetchDataById内でリダイレクト済み

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
  $('[data-fancybox="gallery"]').fancybox({
    // オプションが必要ならここに記述
  });
})();

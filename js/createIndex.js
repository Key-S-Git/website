/**
 * 各カテゴリーのデータを取得して画面に描画する共通関数
 * @param {String} type - 項目のジャンル（gunpla, travelogue, recipe）
 * @param {Function} parseData - 各データから[タイトル, サブタイトル]を抽出する関数
 */
function loadAndRenderCategory(type, parseData) {

  // type から自動的に JSON のパスを生成
  fetch(`json/${type}.json`)
    .then(res => {
      if (!res.ok) throw new Error(`Fetch error for ${type}`);
      return res.json();
    })
    .then(allData => {
      Object.keys(allData).forEach(id => {
        const data = allData[id];
        const { title, sub } = parseData(data);
        renderItem(type, id, data.thumbnail, title, sub);
      });
    })
    .catch(err => console.error(`Failed to load ${type}:`, err));
}

/**
 * JSONで取得した各データからHTML要素を作成する関数
 */
function renderItem(type, id, thumbnail, title, sub) {
  const item = `
    <div class="container">
        <a href="${type}.html?id=${id}" class="album-item">
            <div class="box"><img src="${thumbnail}"></div>
            <div class="overlay">
                <div class="title">${title}</div>
                <div class="sub">${sub}</div>
            </div>
        </a>
    </div>
  `;
  const container = document.getElementById(`${type}-container`);
  container.insertAdjacentHTML('beforeend', item);
}


// Gunpla
loadAndRenderCategory('gunpla', data => ({
  title: data.name.replace(' ', '<br>'), // 機体名の半角スペースを改行に置き換えて主題とする
  sub: data.number // 型番を副題とする
}));

// Travelogues
loadAndRenderCategory('travelogue', data => ({
  title: data.title, // 旅行先の名前を主題とする
  sub: data.date // 日付を副題とする
}));

// Recipes
loadAndRenderCategory('recipe', data => ({
  title: data.title, // 料理名を主題とする
  sub: '' // 副題はなし
}));

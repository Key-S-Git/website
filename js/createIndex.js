/**
 * 各カテゴリーのデータを取得して画面に描画する共通関数
 * @param {String} type - 項目のジャンル（gunpla, travelogue, recipe）
 * @param {Function} parseData - 各データから[タイトル, サブタイトル]を抽出する関数
 * @returns {Promise} 描画完了（失敗時も含む）で resolve される Promise
 */
function loadAndRenderCategory(type, parseData) {

  // type から自動的に JSON のパスを生成
  return fetch(`json/${type}.json`)
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
    // 1つ失敗しても Promise.all 全体が reject されないよう、ここで握りつぶす
    .catch(err => console.error(`Failed to load ${type}:`, err));
}

/**
 * JSONで取得した各データからHTML要素を作成する関数
 */
function renderItem(type, id, thumbnail, title, sub) {
  const item = `
      <a href="${type}.html?id=${id}" class="album-item">
          <div class="box"><img src="${thumbnail}"></div>
          <div class="overlay">
              <div class="title">${title}</div>
              <div class="sub">${sub}</div>
          </div>
      </a>
  `;
  const container = document.getElementById(`${type}-container`);
  container.insertAdjacentHTML('beforeend', item);
}


// 3つのカテゴリーを並行して読み込み、すべて終わるのを待つ
Promise.all([
  // Gunpla
  loadAndRenderCategory('gunpla', data => ({
    title: data.name.replace(' ', '<br>'), // 機体名の半角スペースを改行に置き換えて主題とする
    sub: data.number // 型番を副題とする
  })),

  // Travelogues
  loadAndRenderCategory('travelogue', data => ({
    title: data.title, // 旅行先の名前を主題とする
    sub: data.date // 日付を副題とする
  })),

  // Recipes
  loadAndRenderCategory('recipe', data => ({
    title: data.title, // 料理名を主題とする
    sub: '' // 副題はなし
  }))
]).finally(() => {
  // 成功・失敗どちらでもローディングを解除
  if (typeof window.notifyDataLoaded === 'function') {
    window.notifyDataLoaded();
  }
});

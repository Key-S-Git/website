// Gunpla の動的生成
fetch('json/gunpla.json')
  .then(res => res.json())
  .then(allData => {
    const container = document.getElementById('gunpla-container');
    if (!container) return;

    Object.keys(allData).forEach(id => {
      const data = allData[id];
      // サムネイル表示用に名前を改行させる
      const displayName = data.name.join('<br>');

      const item = `
      <div class="container">
            <a href="gunpla.html?id=${id}" class="album-item">
                <div class="box"><img src="${data.thumbnail}"></div>
                <div class="overlay">
                    <div class="title">${displayName}</div>
                    <div class="sub">${data.number}</div>
                </div>
            </a>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', item);
    });
  });

// Traveloguesの動的生成
fetch('json/travelogue.json')
  .then(res => res.json())
  .then(allData => {
    const container = document.getElementById('travelogue-container');
    if (!container) return;

    Object.keys(allData).forEach(id => {
      const data = allData[id];

      const item = `
          <div class="container">
              <a href="travelogue.html?id=${id}" class="album-item">
                  <div class="box"><img src="${data.thumbnail}"></div>
                  <div class="overlay">
                      <div class="title">${data.title}</div>
                      <div class="sub">${data.date}</div>
                  </div>
              </a>
          </div>
      `;
      container.insertAdjacentHTML('beforeend', item);
    });
  });

// Recipes の動的生成
fetch('json/recipe.json')
  .then(res => res.json())
  .then(allData => {
    const container = document.getElementById('recipe-container');
    if (!container) return;

    Object.keys(allData).forEach(id => {
      const data = allData[id];

      const item = `
        <div class="container">
            <a href="recipe.html?id=${id}" class="album-item">
                <div class="box"><img src="${data.thumbnail}"></div>
                <div class="overlay">
                    <div class="title">${data.title}</div>
                </div>
            </a>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', item);
    });
  });
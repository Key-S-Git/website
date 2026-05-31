// URLの ?id=◯◯ の部分を取得
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get('id');

fetch('json/recipe.json')
  .then(res => res.json())
  .then(allData => {
    const data = allData[recipeId]; // recipe.jsonより、指定されたIDのデータだけ取り出す

    if (!data) {
      document.body.innerHTML = "データが見つかりませんでした。";
      return;
    }

    // レシピタイトル
    const recipeTitle = document.getElementById('recipe-title');
    recipeTitle.textContent = data.title;

    // 材料リスト
    const ingredientsList = document.getElementById('ingredients-list');
    data.ingredients.forEach(item => {
      const li = document.createElement('li');
      li.className = 'ingredient';
      li.textContent = item.name;

      // amountが設定されている場合
      if (item.amount) {
        const amountDiv = document.createElement('div');
        amountDiv.className = 'amount';
        amountDiv.textContent = item.amount;
        li.appendChild(amountDiv);
      }
      ingredientsList.appendChild(li);
    });

    // 調理手順
    const instructionsList = document.getElementById('instructions-list');
    data.instructions.forEach(step => {
      const wrapper = document.createElement('div');
      wrapper.className = 'instruct-wrapper';

      const li = document.createElement('li');
      li.className = 'instruct';
      li.textContent = step.text;
      wrapper.appendChild(li);

      // explainがある場合
      if (step.explain) {
        const explainDiv = document.createElement('div');
        explainDiv.className = 'explain';
        explainDiv.textContent = step.explain;
        wrapper.appendChild(explainDiv);
      }
      instructionsList.appendChild(wrapper);
    });

    // アルバム（Fancybox対応）の生成
    const albumContainer = document.getElementById('album-container');
    
    data.album.forEach(imgPath => {
      const box = document.createElement('div');
      box.className = 'box';
      box.innerHTML = `
          <a data-fancybox="gallery" href="${imgPath}" class="album-item">
              <img src="${imgPath}">
          </a>
      `;
      albumContainer.appendChild(box);
    });
});

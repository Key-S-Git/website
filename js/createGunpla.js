// URLの ?id=◯◯ の部分を取得
const urlParams = new URLSearchParams(window.location.search);
const gunplaId = urlParams.get('id');

fetch('json/gunpla.json')
  .then(res => res.json())
  .then(allData => {
    const data = allData[gunplaId]; // travelogue.jsonより、指定されたIDのデータだけ取り出す

    if (!data) {
      document.body.innerHTML = "データが見つかりませんでした。";
      return;
    }

    // 1. テキスト情報の流し込み
    document.getElementById('name').textContent = data.name;
    document.getElementById('number').textContent = data.number;

    // 2. メイン画像の挿入
    const mainImg = document.createElement('img');
    mainImg.src = data.mainImage;
    document.getElementById('main-image-container').appendChild(mainImg);

    // 3. ハッシュタグの生成
    const tagContainer = document.getElementById('hashtag-container');
    data.hashtags.forEach(tag => {
        const div = document.createElement('div');
        div.className = "hashtag-wrapper"
        const a = document.createElement('a');
        a.href = tag.link;
        a.className = 'hashtag';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = tag.text;
        div.appendChild(a);
        tagContainer.appendChild(div);
    });

    // 4. 武装リストの生成
    const weaponList = document.getElementById('weapon-list');
    data.weapons.forEach(weapon => {
        const li = document.createElement('li');
        li.textContent = weapon;
        weaponList.appendChild(li);
    });

    // 5. アルバム（Fancybox対応）の生成
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
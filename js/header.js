/**
 * ロードされたら以下のHTMLをheaderタグ内に挿入
 */
window.addEventListener('DOMContentLoaded', () => {
    // ヘッダーのHTML
    const headerContent = `
        <a href="#" class="header-icon-wrapper">
          <img src="media/Key-S.png">
          <div class="header-title">Key-S</div>
        </a>
        <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <nav class="nav">
          <ul>
              <li><a href="index.html"><h2>Top</h2></a></li>
              <li><a href="#gunpla"><h2>Gunpla</h2></a></li>
              <li><a href="#travelogues"><h2>Travelogues</h2></a></li>
              <li><a href="#recipes"><h2>Recipes</h2></a></li>
              <li><a href="#account"><h2>Account</h2></a></li>
          </ul>
        </nav>
    `;

    // 挿入先となるヘッダータグを取得
    const header = document.querySelector('header');

    // ヘッダーのHTMLを挿入
    header.insertAdjacentHTML('beforeend', headerContent);

    $(function () {
      // ハンバーガーメニューのボタンがクリックされたときの処理
      $('.hamburger').click(function () {
          $(this).toggleClass('active');
          $('#header .nav').toggleClass('active');
      });

      //メニュー内のリンクがクリックされた時
      $('.nav a').click(function () {
        $('.hamburger').removeClass('active');
        $('#header .nav').removeClass('active');
      });
    });
});
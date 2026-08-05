// 手順2でコピーしたGASのウェブアプリURLをここに貼り付けます
const GAS_URL = "https://script.google.com/macros/s/AKfycbwh-FYQMce-e73IucS4l4Vs8LtCdUJHv-8JuWCGWpOVODMTx6EzvuGy2j-_75KYNNkkuA/exec";


const contactForm = document.getElementById('contact-form')
const submitButton = document.getElementById('submit-button');
const buttonText = document.querySelector('.button-text');

// メールアドレスの正規表現
// (1文字以上の英数字、ドット、アンダースコア、プラス、マイナス) @ (1文字以上の英数字、ドット、ハイフン) . (2文字以上の英字)
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

let animation;

contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // ページのデフォルトの送信を停止

    // 既存のエラーを全て削除
    clearError();

    // ボタンを無効化
    submitButton.disabled = true;

    submitButton.classList.add('sending');

    let count = 0; // 「.」の数を変化させるための変数
    animation = setInterval(() => {
        const dots = '.'.repeat(count % 4); // dotsに0~3個の「.」が格納される
        buttonText.textContent = '送信中' + dots;
        count++;
    }, 200);

    const elements = {
      name: document.getElementById('name'),
      email: document.getElementById('email'),
      message: document.getElementById('message')
    }

    // フォームの入力データを取得
    const formData = {
        name: elements.name.value.trim(),
        email: elements.email.value.trim(),
        message: elements.message.value.trim()
    };

    // エラーの有無を判定するフラグ
    let hasError = false

    // 「氏名」欄が空の場合
    if (!formData.name) {
      showError(elements.name, "氏名を入力してください");
      hasError = true;
    }

    // 「メールアドレス」欄が空の場合
    if (!formData.email) {
      showError(elements.email, "メールアドレスを入力してください");
      hasError = true;
    }
    // 「メールアドレス」欄の入力値の形式が間違っている場合
    else if (!EMAIL_PATTERN.test(formData.email)) {
      showError(elements.email, "メールアドレスの形式が間違っています");
      hasError = true;
    }

    // 問い合わせ内容が空の場合
    if (!formData.message) {
      showError(elements.message, "お問い合わせ内容を入力してください") 
      hasError = true;
    }

    // 1つでもエラーがあった場合
    if (hasError === true) {
      // ボタンの状態を元に戻す
      setDefault();
      return;
    }

    // Fetch APIを使ってGASにデータ送信
    fetch(GAS_URL, {
        method: 'POST',
        // CORS制限を回避するため mode: 'no-cors' を使うか、標準のJSON送信を行う
        // GASへのPOSTでは 'no-cors' を使うとレスポンスの中身が読めないため、リダイレクトを伴う通常送信かCORS対策をします
        // 最も手軽なのは mode: 'no-cors' ですが、成否判定が必要な場合は下記のように対応します
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(() => {
        alert('お問い合わせが送信されました。ありがとうございました！');
        contactForm.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('送信に失敗しました。時間をおいて再度お試しください。');
    })
    .finally(() => {
        setDefault();
    });
});

/**
 * エラーメッセージを表示させる関数
 * @param {*} target エラーメッセージを出す場所の要素
 * @param {*} message エラーメッセージの文面
 */
function showError(target, message) {
  // ベースとなるspanタグを作成
  const errorSpan = document.createElement('span');
  // エラーメッセージの文字列を受け取る
  errorSpan.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
  // 書式はstyle.cssを参照
  errorSpan.className = "error-message";
  // 作成したspanタグをtargetの要素の前に挿入
  target.parentNode.insertBefore(errorSpan, target);
}

/**
 * 既存のエラーメッセージを全て消去する関数
 */
function clearError() {
  // 「error-message」クラスを全て取得
  const errors = document.querySelectorAll('.error-message');

  // 各エラー要素に対して
  errors.forEach(error => {
    // 削除を実行
    error.remove();
  });
}

/**
 * ボタンの状態を元に戻す関数
 */
function setDefault() {
  // ボタンのテキストアニメーションを停止
  clearInterval(animation);
  // ボタンのテキストを戻す
  submitButton.classList.remove('sending');
  buttonText.textContent = "送信";
  // ボタンを有効化
  submitButton.disabled = false;
}
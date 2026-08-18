const GAS_URL = "https://script.google.com/macros/s/AKfycbwh-FYQMce-e73IucS4l4Vs8LtCdUJHv-8JuWCGWpOVODMTx6EzvuGy2j-_75KYNNkkuA/exec";


const contactForm = document.getElementById('contact-form')
const submitButton = document.getElementById('submit-button');
const buttonText = document.querySelector('.button-text');

// メールアドレスの正規表現
// (1文字以上の英数字、ドット、アンダースコア、プラス、マイナス) @ (1文字以上の英数字、ドット、ハイフン) . (2文字以上の英字)
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// フォームの中身
const elements = {
  name: document.getElementById('name'),
  email: document.getElementById('email'),
  message: document.getElementById('message')
}

let animation;

// ---- blur時のバリデーション登録 ----
elements.name.addEventListener('blur', validateName);
elements.email.addEventListener('blur', validateEmail);
elements.message.addEventListener('blur', validateMessage);

contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // ページのデフォルトの送信を停止

    // ボタンを無効化
    submitButton.disabled = true;

    submitButton.classList.add('sending');

    let count = 0; // 「.」の数を変化させるための変数
    animation = setInterval(() => {
        const dots = '.'.repeat(count % 4); // dotsに0~3個の「.」が格納される
        buttonText.textContent = '送信中' + dots;
        count++;
    }, 200);

    // 各項目のバリデーションを実行（全項目を必ず評価させる）
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    // 1つでもエラーがあった場合
    if (!isNameValid || !isEmailValid || !isMessageValid) {
      // ボタンの状態を元に戻す
      setDefault();
      return;
    }

    // フォームの入力データを取得
    // ※直前のvalidate関数実行時に各valueは既にtrim済み
    const formData = {
        name: elements.name.value,
        email: elements.email.value,
        message: elements.message.value
    };

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
  // 同じ項目に二重表示しないよう先に消す
  clearFieldError(target);
  // ベースとなるspanタグを作成
  const errorSpan = document.createElement('span');
  // エラーメッセージの文字列を受け取る
  errorSpan.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
  // 書式はstyle.cssを参照
  errorSpan.className = "error-message";
  // 作成したspanタグをtargetの要素の前に挿入
  target.parentNode.insertBefore(errorSpan, target);
  // エラー時にinput要素の枠線を赤くする
  target.classList.add('error-input');
}

/**
 * 特定の1項目のエラーメッセージだけを消去する関数
 * @param {*} target エラーメッセージを消したい入力欄の要素
 */
function clearFieldError(target) {
  // input要素の枠線を元に戻す
  target.classList.remove('error-input');

  // inputの直前にある要素を取得
  const prev = target.previousElementSibling;
  if (prev && prev.classList.contains('error-message')) {
    prev.remove();
  }
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

  // 「error-input」クラスを全て取得
  const errorInputs = document.querySelectorAll('.error-input');
  // 各input要素から、「error-input」クラスを削除
  errorInputs.forEach(errorInput => {
    errorInput.classList.remove('error-input');
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

/**
 * 「氏名」欄のバリデーション関数
 * 入力値をtrimしてelementに書き戻してから判定する
 * @returns {boolean} 有効な場合true、無効な場合false
 */
function validateName() {
  // trim結果をvalueに書き戻すことで、以降は毎回trim()を呼ばなくてよくなる
  elements.name.value = elements.name.value.trim();

  if (!elements.name.value) {
    showError(elements.name, "氏名を入力してください");
    return false;
  }

  clearFieldError(elements.name);
  return true;
}

/**
 * 「メールアドレス」欄のバリデーション関数
 * 入力値をtrimしてelementに書き戻してから判定する
 * @returns {boolean} 有効な場合true、無効な場合false
 */
function validateEmail() {
  elements.email.value = elements.email.value.trim();

  if (!elements.email.value) {
    showError(elements.email, "メールアドレスを入力してください");
    return false;
  }

  if (!EMAIL_PATTERN.test(elements.email.value)) {
    showError(elements.email, "メールアドレスの形式が間違っています");
    return false;
  }

  clearFieldError(elements.email);
  return true;
}

/**
 * 「お問い合わせ内容」欄のバリデーション関数
 * 入力値をtrimしてelementに書き戻してから判定する
 * @returns {boolean} 有効な場合true、無効な場合false
 */
function validateMessage() {
  elements.message.value = elements.message.value.trim();

  if (!elements.message.value) {
    showError(elements.message, "お問い合わせ内容を入力してください");
    return false;
  }

  clearFieldError(elements.message);
  return true;
}

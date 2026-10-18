// toast.js
let toastTimer;
let toast, icon, text;

/**
 * トースト要素を作ってbodyに追加する(1回だけ)
 */
function createToast() {
  if (toast) return;

  toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  icon = document.createElement('i');
  icon.className = 'fa-solid toast-icon';

  text = document.createElement('span');
  text.className = 'toast-message';

  toast.append(icon, text);
  document.body.appendChild(toast);
}

// モジュールはdeferで実行されるので、この時点でbodyは存在する
createToast();

/**
 * トーストを表示する関数
 * @param {string} message 表示する文言
 * @param {'success'|'error'} type 種類(デフォルトはsuccess)
 */
export function displayToast(message, type = 'success') {
  text.textContent = message;

  icon.className = 'fa-solid toast-icon ' +
    (type === 'error' ? 'fa-circle-exclamation error' : 'fa-circle-check checked');

  clearTimeout(toastTimer);
  toast.classList.add('displaying');
  toastTimer = setTimeout(() => {
    toast.classList.remove('displaying');
  }, 3000);
}
document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = window.location.origin + window.location.pathname;

    // スタイルの挿入
    const style = document.createElement('style');
    style.textContent = `
        #cmd-console { 
            display: none; 
            position: fixed; 
            top: 20px; 
            left: 20px; 
            width: 350px; 
            background: #1a1a1a; 
            color: #0f0; 
            padding: 10px 15px 15px 15px; 
            border: 1px solid #444; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.5); 
            z-index: 99999; 
            font-family: 'Courier New', monospace; 
            font-size: 14px; 
            border-radius: 4px; 
            user-select: none; /* ドラッグ中のテキスト選択を防止 */
        }
        #cmd-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 6px;
            margin-bottom: 10px;
            border-bottom: 1px solid #333;
            color: #888;
            font-size: 12px;
        }
        #cmd-close-btn {
            background: transparent;
            border: none;
            color: #888;
            font-size: 14px;
            cursor: pointer;
            padding: 0 4px;
            line-height: 1;
            font-family: inherit;
        }
        #cmd-close-btn:hover {
            color: #fff;
        }
        #cmd-body {
            user-select: text; /* メイン領域はテキスト選択可能にする */
        }
        #cmd-path {
            word-break: break-all;
            margin-bottom: 5px;
            color: #0f0;
        }
        #cmd-input { 
            width: 100%; 
            background: transparent; 
            border: none; 
            color: #0f0; 
            outline: none; 
            font-family: inherit; 
        }
        #cmd-message { font-size: 11px; margin-top: 10px; color: #888; }
    `;
    document.head.appendChild(style);

    // UI要素の作成
    const consoleEl = document.createElement('div');
    consoleEl.id = 'cmd-console';
    consoleEl.innerHTML = `
        <div id="cmd-header">
            <span>CONSOLE</span>
            <button id="cmd-close-btn" title="Close (exit)">✕</button>
        </div>
        <div id="cmd-body">
            <div id="cmd-path">${baseUrl} > </div>
            <input type="text" id="cmd-input" placeholder="Enter commands" autocomplete="off">
            <div id="cmd-message">Ctrl+K to toggle</div>
        </div>
    `;
    document.body.appendChild(consoleEl);

    const inputEl = document.getElementById('cmd-input');
    const msgEl = document.getElementById('cmd-message');
    const headerEl = document.getElementById('cmd-header');
    const closeBtnEl = document.getElementById('cmd-close-btn');

    // 閉じるボタンのイベント
    closeBtnEl.addEventListener('click', () => {
        inputEl.value = '';
        consoleEl.style.display = 'none';
        msgEl.textContent = 'Ctrl+K to toggle';
    });

    // --- ドラッグ＆ドロップ機能の実装 ---
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    headerEl.addEventListener('mousedown', (e) => {
        // 閉じるボタンを押した時はドラッグを開始しない
        if (e.target === closeBtnEl) return;

        isDragging = true;
        offsetX = e.clientX - consoleEl.offsetLeft;
        offsetY = e.clientY - consoleEl.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) {
            return;
        }

        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        const maxLeft = window.innerWidth - consoleEl.offsetWidth;
        const maxTop = window.innerHeight - consoleEl.offsetHeight;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        consoleEl.style.left = `${newLeft}px`;
        consoleEl.style.top = `${newTop}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    // -------------------------------------

    // 操作可能にしたいCSS変数を定義（単一対象として設定）
    const managedVars = ['--key-accent'];
    const TARGET_VAR = '--key-accent';

    // 初期化：ローカルストレージの値の適用
    managedVars.forEach(varName => {
        const savedValue = localStorage.getItem(varName);
        if (savedValue) {
            document.documentElement.style.setProperty(varName, savedValue);
            document.documentElement.style.setProperty('--hamburger-text-hover', getContrastTextColor(savedValue));
        }
    });

    // キー操作（Ctrl+K でコンソール開閉）
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            inputEl.value = '';
            const isHidden = window.getComputedStyle(consoleEl).display === 'none';
            consoleEl.style.display = isHidden ? 'block' : 'none';
            if (isHidden) inputEl.focus();
        }
    });

    // コマンド履歴管理
    const history = [];
    let historyIdx = -1;
    const MAX_HISTORY = 5;

    /**
     * 履歴にコマンドを保存する関数
     * @param {*} command 
     */
    function saveHistory(command) {
        const existingIndex = history.indexOf(command);
        if (existingIndex !== -1) {
            history.splice(existingIndex, 1);
        }
        history.unshift(command);
        if (history.length > MAX_HISTORY) {
            history.pop();
        }
        historyIdx = -1;
    }

    // 色を変更する共通処理関数
    function applyColor(value) {
        if (!value) {
            msgEl.textContent = "Error: Missing color value. Usage: 'color red' or 'color #ff0000'";
            return false;
        }
        if (!CSS.supports('color', value)) {
            msgEl.textContent = `Error: '${value}' is an invalid CSS color value.`;
            return false;
        }

        document.documentElement.style.setProperty(TARGET_VAR, value);
        document.documentElement.style.setProperty('--hamburger-text-hover', getContrastTextColor(value));
        localStorage.setItem(TARGET_VAR, value);
        msgEl.textContent = `Applied & Saved: ${value}`;
        return true;
    }

    // コマンド定義（実行後に true を返すと成功扱い）
    const commands = {
        'exit': {
            description: 'Close console',
            action: () => handleExit()
        },
        'quit': {
            description: 'Close console',
            action: () => handleExit()
        },
        '\\q': {
            description: 'Close console',
            action: () => handleExit()
        },
        'reset': {
            description: 'Reset managed CSS variables',
            action: () => {
                managedVars.forEach(varName => {
                    localStorage.removeItem(varName);
                    document.documentElement.style.removeProperty(varName);
                    document.documentElement.style.setProperty('--hamburger-text-hover', getContrastTextColor('#00face'));
                });
                msgEl.textContent = "All variables have been reset.";
                return true;
            }
        },
        'list': {
            description: 'Show current managed CSS variable values',
            action: () => {
                const currentVars = managedVars
                    .map(v => `${v}: ${getComputedStyle(document.documentElement).getPropertyValue(v).trim()}`)
                    .join(', ');
                msgEl.textContent = currentVars || 'No variables defined.';
                return true;
            }
        },
        'help': {
            description: 'Show available commands',
            action: () => {
                const list = Object.keys(commands).concat(['color <value>']).join(', ');
                msgEl.textContent = `Available: ${list}`;
                return true;
            }
        }
    };

    // 共通の終了処理関数
    function handleExit() {
        inputEl.value = '';
        msgEl.textContent = 'Bye!';
        setTimeout(() => {
            consoleEl.style.display = 'none';
            msgEl.textContent = 'Ctrl+K to toggle';
        }, 1000);
        return true;
    }

    // 入力欄のキー監視
    inputEl.addEventListener('keydown', (e) => {
        // ↑矢印キー
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length > 0 && historyIdx < history.length - 1) {
                historyIdx++;
                inputEl.value = history[historyIdx];
            }
        }
        // ↓矢印キー
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx > 0) {
                historyIdx--;
                inputEl.value = history[historyIdx];
            } else if (historyIdx === 0) {
                historyIdx = -1;
                inputEl.value = '';
            }
        }
        // Enterキー（コマンド実行）
        else if (e.key === 'Enter') {
            // 入力値を取得
            const commandText = inputEl.value.trim();

            // 入力値がなかった場合
            if (!commandText) {
                return;
            }

            // 実行が成功したかを判定するフラグ
            let isSuccess = false;

            // 入力値を空白で区切って配列化
            const parts = commandText.split(/\s+/);
            // コマンド名を取得
            const cmd = parts[0];
            // パラメータを取得
            const arg = parts.slice(1).join(' ');

            // 完全一致する基本コマンド（exit, reset, help など）
            if (commands[commandText]) {
                isSuccess = commands[commandText].action();
            } 
            // 'color <色>' 形式のみ受け付ける
            else if (cmd === 'color') {
                isSuccess = applyColor(arg);
            } 
            // エラー処理
            else {
                msgEl.textContent = `Error: Unknown command. Use 'color <value>' or type 'help'`;
            }

            inputEl.value = '';

            // 成功時はコマンドを記録する
            if (isSuccess) {
                saveHistory(commandText);
            } else {
                historyIdx = -1;
            }
        }
    });
});


/**
 * どんなCSSカラー表現からでもRGB値 [r, g, b] を取得する関数
 * @param {string} color - "#fff", "rgb(255, 0, 0)", "red", "hsl(0, 100%, 50%)" など
 * @return {number[]} [r, g, b] (0〜255の配列)
 */
function parseCssColor(color) {
  // ブラウザの描画コンテキストを利用して色を解析
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = color;
  
  // ctx.fillStyleにセットすると自動的に "#rrggbb" 形式に正規化される
  const normalizedHex = ctx.fillStyle; 

  // #rrggbb から [r, g, b] に変換
  const r = parseInt(normalizedHex.substring(1, 3), 16);
  const g = parseInt(normalizedHex.substring(3, 5), 16);
  const b = parseInt(normalizedHex.substring(5, 7), 16);

  return [r, g, b];
}

/**
 * 背景色から最適なテキスト色（#000000 または #FFFFFF）を自動判別する関数
 * @param {string} color - HEX, RGB, RGBA, Color Name, HSL など任意のカラー表現
 * @return {string} "#000000" (黒) または "#FFFFFF" (白)
 */
function getContrastTextColor(color) {
  // どんな形式でも [r, g, b] に変換
  const [r, g, b] = parseCssColor(color);

  // 各チャンネルの相対輝度補正（WCAG 2.0 規格）
  const sRGB = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  // 相対輝度の計算
  const luminance = 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];

  // 閾値（0.179）で判定
  return luminance > 0.179 ? '#000000' : '#FFFFFF';
}

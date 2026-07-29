document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = window.location.origin + window.location.pathname;

    // スタイルの挿入
    const style = document.createElement('style');
    style.textContent = `
        #cmd-console { display: none; position: fixed; top: 20px; left: 20px; width: 350px; background: #1a1a1a; color: #0f0; padding: 15px; border: 1px solid #444; box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 99999; font-family: 'Courier New', monospace; font-size: 14px; border-radius: 4px; }
        #cmd-input { width: 100%; background: transparent; border: none; color: #0f0; outline: none; margin-top: 10px; font-family: inherit; }
        #cmd-message { font-size: 11px; margin-top: 10px; color: #888; }
    `;
    document.head.appendChild(style);

    // UI要素の作成
    const consoleEl = document.createElement('div');
    consoleEl.id = 'cmd-console';
    consoleEl.innerHTML = `
        <div>${baseUrl} > </div>
        <input type="text" id="cmd-input" placeholder="--var value" autocomplete="off">
        <div id="cmd-message">Ctrl+K to toggle</div>
    `;
    document.body.appendChild(consoleEl);

    const inputEl = document.getElementById('cmd-input');
    const msgEl = document.getElementById('cmd-message');

    // 操作可能にしたいCSS変数を定義
    const managedVars = ['--key-accent'];

    // 初期化：ローカルストレージの値の適用
    managedVars.forEach(varName => {
        const savedValue = localStorage.getItem(varName);
        if (savedValue) {
            document.documentElement.style.setProperty(varName, savedValue);
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

    // 履歴管理
    const history = [];
    let historyIdx = -1;
    const MAX_HISTORY = 5;

    // 履歴にコマンドを保存する関数
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
                const list = Object.keys(commands).join(', ');
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
        // 実行成功として「true」を返し、履歴に保存させる
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
            const command = inputEl.value.trim();
            if (!command) return;

            let isSuccess = false; // 成功フラグ

            // 1. 完全一致する登録コマンド（help, list, exitなど）の判定
            if (commands[command]) {
                isSuccess = commands[command].action();
                inputEl.value = '';
            } else {
                // 2. 引数付きコマンド（CSS変数変更 "--var-name value"）の処理
                const [prop, value] = command.split(' ');

                if (!value) {
                    msgEl.textContent = `Error: Unknown command or missing value. Type 'help' for commands.`;
                } else if (!CSS.supports('color', value)) {
                    msgEl.textContent = `Error: '${value}' is an invalid CSS color value.`;
                } else if (prop && managedVars.includes(prop)) {
                    document.documentElement.style.setProperty(prop, value);
                    localStorage.setItem(prop, value);
                    msgEl.textContent = `Applied & Saved: ${prop}`;
                    isSuccess = true; // 適用・保存に成功した場合のみ true
                } else if (prop && !managedVars.includes(prop)) {
                    msgEl.textContent = `Error: '${prop}' is not a managed variable.`;
                } else {
                    msgEl.textContent = "Error: Use format '--var-name value' or type 'help'";
                }

                inputEl.value = '';
            }

            // 実行に成功した場合のみ履歴を保存
            if (isSuccess) {
                saveHistory(command);
            } else {
                historyIdx = -1; // 失敗時はインデックスのみリセット
            }
        }
    });
});

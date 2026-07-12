document.addEventListener('DOMContentLoaded', () => {
    // 現在開いているURLを取得
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
        <div>Access to > ${baseUrl}</div>
        <input type="text" id="cmd-input" placeholder="--var value" autocomplete="off">
        <div id="cmd-message">Ctrl+K to toggle</div>
    `;
    document.body.appendChild(consoleEl);

    const inputEl = document.getElementById('cmd-input');
    const msgEl = document.getElementById('cmd-message');

    // 操作可能にしたいCSS変数を定義
    const managedVars = ['--key-accent'];

    // 操作可能な各CSS変数に対して、ローカルストレージ内に前回の入力値の情報がないか確認。前回の情報があれば、それを適用
    managedVars.forEach(varName => {
        // 保存されている入力値を確認
        const savedValue = localStorage.getItem(varName);
        // 前回の値が存在する場合
        if (savedValue) {
            // 前回の値を適用する
            document.documentElement.style.setProperty(varName, savedValue);
        }
    });

    // キー操作を監視
    document.addEventListener('keydown', (e) => {
        // Ctrl と K が同時押しされた場合
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            // 現在コンソールのUIに適用されているスタイルを取得
            const style = window.getComputedStyle(consoleEl);
            // 取得したスタイルから、コンソールが非表示かどうかを識別
            const isHidden = style.display === 'none';
            // 非表示だった場合は表示、表示中だった場合は非表示
            consoleEl.style.display = isHidden ? 'block' : 'none';
            // 元々非表示だった (=キー操作で表示された) 場合
            if (isHidden) {
                // コンソール内の入力欄にフォーカス
                inputEl.focus();
            }
        }
    });

    // 入力欄のキー操作を監視
    inputEl.addEventListener('keydown', (e) => {
        // Enterキーが押された場合
        if (e.key === 'Enter') {
            // 入力値から前後の空白を除去
            const command = inputEl.value.trim();

            // コマンドに「reset」と入力された場合
            if (command === 'reset') {
                managedVars.forEach(varName => {
                    localStorage.removeItem(varName);
                    document.documentElement.style.removeProperty(varName);
                });
                msgEl.textContent = "All variables have been reset.";
                inputEl.value = '';
                return; // 以降の処理をスキップ
            }

            // コマンドに「list」と入力された場合
            if (command === 'list') {
                const currentVars = managedVars.map(v => `${v}: ${getComputedStyle(document.documentElement).getPropertyValue(v).trim()}`).join(', ');
                msgEl.textContent = currentVars;
                inputEl.value = '';
                return;
            }

            // 入力値を変数名と値に分けて保存
            const [prop, value] = command.split(' ');

            // 変数名と値が存在し、変数名が操作可能な変数リストに含まれている場合
            if (prop && managedVars.includes(prop) && value) {
                // 入力値を適用
                document.documentElement.style.setProperty(prop, value);
                // ローカルストレージに保存
                localStorage.setItem(prop, value);
                // コンソール下のメッセージ欄にログを出す
                msgEl.textContent = `Applied & Saved: ${prop}`;
                // 入力欄を空にする
                inputEl.value = '';
            }
            // 変数名は存在するものだが、管理可能な変数リストに含まれていない場合
            else if (prop && !managedVars.includes(prop)) {
                // メッセージ欄にエラーメッセージを表示
                msgEl.textContent = `Error: '${prop}' is not a managed variable.`;
            }
            else {
                // メッセージ欄にエラーメッセージを表示
                msgEl.textContent = "Error: Use format '--var-name value'";
            }
        }
    });
});

import { WebContainer } from '@webcontainer/api';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

let webcontainerInstance;
let editor;

// 1. ターミナルの初期化
const term = new Terminal({
  cursorBlink: true,
  theme: { background: '#000000' }
});
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

// 2. CodeMirrorエディタの初期化
function initEditor() {
  editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    lineNumbers: true,
    mode: 'javascript',
    theme: 'monokai',
    value: `// ここにJavaScriptコードを書きます\nconsole.log("Hello from WebContainer!");\n`
  });
}

// 3. WebContainerの初期化
async function initWebContainer() {
  try {
    const container = document.getElementById('terminal-container');
    if (!container) return;
    
    term.open(container);
    fitAddon.fit();
    
    term.write('=== 自作 Web IDE 初期化プロセス ===\r\n');
    term.write('WebContainer を起動しています...\r\n');

    webcontainerInstance = await WebContainer.boot();
    term.write('WebContainer が正常に起動しました。\r\n\r\n');

    // 初期状態の仮想ファイルをマウント
    await webcontainerInstance.mount({
      'index.js': {
        file: {
          contents: 'console.log("Hello from WebContainer!");',
        },
      },
    });

    // シェル（jsh）の起動
    const shellProcess = await webcontainerInstance.spawn('jsh', {
      terminal: { cols: term.cols, rows: term.rows },
    });

    // 入出力の同期
    shellProcess.output.pipeTo(
      new WritableStream({
        write(data) { term.write(data); },
      })
    );

    const input = shellProcess.input.getWriter();
    term.onData((data) => { input.write(data); });

    // 保存ボタンのイベント登録
    document.getElementById('save-btn').addEventListener('click', async () => {
      const code = editor.getValue();
      // エディタの内容をWebContainer内の「index.js」に書き込み
      await webcontainerInstance.fs.writeFile('/index.js', code);
      term.write('\r\n[IDE] index.js を保存しました。\r\n❯ ');
    });

    window.addEventListener('resize', () => {
      fitAddon.fit();
      shellProcess.resize({ cols: term.cols, rows: term.rows });
    });
  } catch (error) {
    term.write(`\r\n【起動エラー】: ${error.message}\r\n`);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  initEditor();
  await initWebContainer();
});

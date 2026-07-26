// 冒頭の import 文はすべて削除（HTML側で読み込み済みのため）

// グローバル変数からオブジェクトを取得
const Terminal = window.Terminal;
const FitAddon = window.FitAddon.FitAddon;

// ターミナルの初期化
const term = new Terminal({
  cursorBlink: true,
  theme: { background: '#000000' }
});
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

async function initWebContainer() {
  try {
    const container = document.getElementById('terminal-container');
    if (!container) return;
    
    term.open(container);
    fitAddon.fit();
    
    term.write('=== 自作 Web IDE 初期化プロセス ===\r\n');
    term.write('WebContainer をブート中...\r\n');

    // HTML側でロードした WebContainer の起動
    if (!window.WebContainer) {
      throw new Error('WebContainer API の読み込みに失敗しています。');
    }
    const webcontainerInstance = await window.WebContainer.boot();
    term.write('WebContainer が正常に起動しました。\r\n');

    // シェル（jsh）の起動
    const shellProcess = await webcontainerInstance.spawn('jsh', {
      terminal: { cols: term.cols, rows: term.rows },
    });

    // ストリームの結合
    shellProcess.output.pipeTo(
      new WritableStream({
        write(data) { term.write(data); },
      })
    );

    const input = shellProcess.input.getWriter();
    term.onData((data) => { input.write(data); });

    window.addEventListener('resize', () => {
      fitAddon.fit();
      shellProcess.resize({ cols: term.cols, rows: term.rows });
    });
  } catch (error) {
    term.write(`\r\n【致命的エラー】: ${error.message}\r\n`);
    console.error('WebIDE Error:', error);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('terminal-container');
  if (container) {
    term.open(container);
    fitAddon.fit();
  }
  await initWebContainer();
});

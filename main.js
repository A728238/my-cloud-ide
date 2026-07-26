import { WebContainer } from '@webcontainer/api';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

// ターミナルの初期化
const term = new Terminal({
  cursorBlink: true,
  theme: { background: '#000000' }
});
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

term.write('=== 自作 Web IDE 初期化プロセス ===\r\n');

async function initWebContainer() {
  try {
    const container = document.getElementById('terminal-container');
    if (!container) {
      throw new Error('ターミナルを表示するコンテナが見つかりません。');
    }
    
    term.open(container);
    fitAddon.fit();
    term.write('ターミナルUIの描画に成功しました。\r\n');
    term.write('WebContainer をブート中...\r\n');

    // WebContainerの起動
    const webcontainerInstance = await WebContainer.boot();
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
  // 画面に強制的にターミナルを一度マウントして文字を見せる
  const container = document.getElementById('terminal-container');
  if (container) {
    term.open(container);
    fitAddon.fit();
  }
  await initWebContainer();
});

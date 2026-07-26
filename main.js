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

async function initWebContainer() {
  try {
    const container = document.getElementById('terminal-container');
    if (!container) return;
    
    term.open(container);
    fitAddon.fit();
    
    term.write('=== 自作 Web IDE 初期化プロセス ===\r\n');
    term.write('WebContainer を起動しています...\r\n');

    // WebContainer の起動
    const webcontainerInstance = await WebContainer.boot();
    term.write('WebContainer が正常に起動しました。\r\n');

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

    window.addEventListener('resize', () => {
      fitAddon.fit();
      shellProcess.resize({ cols: term.cols, rows: term.rows });
    });
  } catch (error) {
    term.write(`\r\n【エラー発生】: ${error.message}\r\n`);
    console.error('WebIDE Error:', error);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  await initWebContainer();
});

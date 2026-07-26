import { WebContainer } from '@webcontainer/api';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

let webcontainerInstance;

// 1. xterm.js の初期化
const term = new Terminal({
  cursorBlink: true,
  theme: { background: '#000000' }
});
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);
term.open(document.getElementById('terminal-container'));
fitAddon.fit();

term.write('WebContainer を初期化中...\r\n');

// 2. WebContainer の起動とシェル接続
async function initWebContainer() {
  // WebContainer インスタンスの生成
  webcontainerInstance = await WebContainer.boot();
  term.write('WebContainer が起動しました。\r\n');

  // インタラクティブなシェル（jsh）を開始
  const shellProcess = await webcontainerInstance.spawn('jsh', {
    terminal: {
      cols: term.cols,
      rows: term.rows,
    },
  });

  // WebContainer の出力をターミナルに書き込む
  shellProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        term.write(data);
      },
    })
  );

  // ターミナルの入力を WebContainer のシェルに送り出す
  const input = shellProcess.input.getWriter();
  term.onData((data) => {
    input.write(data);
  });

  // ウィンドウサイズ変更への追従設定
  window.addEventListener('resize', () => {
    fitAddon.fit();
    shellProcess.resize({
      cols: term.cols,
      rows: term.rows,
    });
  });
}

// 3. サンプルファイルの書き込み（必要に応じて）
async function setupFiles() {
  await webcontainerInstance.mount({
    'package.json': {
      file: {
        contents: JSON.stringify({
          name: 'my-app',
          type: 'module',
          dependencies: {
            'express': '^4.18.2'
          },
          scripts: {
            start: 'node index.js'
          }
        }, null, 2),
      },
    },
    'index.js': {
      file: {
        contents: `
import express from 'express';
const app = express();
app.get('/', (req, res) => res.send('Hello from WebContainer!'));
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
        `,
      },
    },
  });
}

// 初期化実行
window.addEventListener('DOMContentLoaded', async () => {
  await initWebContainer();
  await setupFiles();
});

import { WebContainer } from '@webcontainer/api';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const term = new Terminal({
  cursorBlink: true,
  theme: { background: '#000000' }
});
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);
term.open(document.getElementById('terminal-container'));
fitAddon.fit();

term.write('WebContainer を初期化中...\r\n');

async function initWebContainer() {
  try {
    const webcontainerInstance = await WebContainer.boot();
    term.write('WebContainer が起動しました。\r\n');

    const shellProcess = await webcontainerInstance.spawn('jsh', {
      terminal: { cols: term.cols, rows: term.rows },
    });

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
    term.write(`\r\nエラーが発生しました: ${error.message}\r\n`);
    console.error(error);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  await initWebContainer();
});

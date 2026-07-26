// 正しいモジュールからWebContainerをインポート
import { WebContainer } from '@webcontainer/api';

// ターミナル、FitAddonの初期化（略）
const term = new Terminal({ /* ... */ });
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

async function initWebContainer() {
  try {
    // コンテナ起動とターミナルへの接続処理
    const webcontainerInstance = await WebContainer.boot();
    term.write('WebContainer が正常に起動しました。\r\n');
    
    // シェル（jsh）の起動とイベント処理（略）
  } catch (error) {
    console.error('WebIDE Error:', error);
  }
}
// 実行（略）

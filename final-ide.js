// すべてグローバル変数（window）から安全に取得
const Terminal = window.Terminal;
const FitAddon = window.FitAddon ? window.FitAddon.FitAddon : null;
const CodeMirror = window.CodeMirror;
const WebContainer = window.WebContainer;

let term, fitAddon, editor;

function init() {
  // 1. エディタ初期化
  editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    lineNumbers: true,
    mode: 'javascript',
    theme: 'monokai',
  });
  editor.setValue(`console.log("Hello WebContainer");`);

  // 2. ターミナル初期化
  term = new Terminal({ cursorBlink: true, theme: { background: '#000000' } });
  const container = document.getElementById('terminal-container');
  if (container) {
    term.open(container);
    term.write('=== 自作 Web IDE 初期化 ===\r\n');
    
    // WebContainerのテスト起動
    if (WebContainer) {
      term.write('WebContainer ライブラリ検出成功。\r\n');
      term.write('起動テストを開始します...\r\n');
      
      WebContainer.boot().then(instance => {
        term.write('【成功】WebContainer が正常に起動しました！\r\n');
      }).catch(err => {
        term.write(`\r\n【起動失敗】環境制限によるエラー: ${err.message}\r\n`);
        term.write('※GitHub Pages上のセキュリティヘッダー（COOP/COEP）が一時的にオフになっているため、このエラーが出るのは正常です。\r\n');
      });
    } else {
      term.write('WebContainer の読み込みに失敗しています。\r\n');
    }
  }
}

window.addEventListener('DOMContentLoaded', init);

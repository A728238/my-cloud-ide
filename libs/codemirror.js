/**
 * Bundled by jsDelivr using Rollup v4.62.2 and esbuild v0.28.1.
 * Original file: /npm/codemirror@6.0.2/dist/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
import{lineNumbers as p,highlightActiveLineGutter as c,highlightSpecialChars as t,drawSelection as e,dropCursor as h,rectangularSelection as n,crosshairCursor as s,highlightActiveLine as f,keymap as i}from"/npm/@codemirror/view@6.37.2/+esm";import{EditorView as j}from"/npm/@codemirror/view@6.37.2/+esm";import{EditorState as u}from"/npm/@codemirror/state@6.5.2/+esm";import{foldGutter as g,indentOnInput as y,syntaxHighlighting as o,defaultHighlightStyle as r,bracketMatching as d,foldKeymap as S}from"/npm/@codemirror/language@6.11.1/+esm";import{history as a,defaultKeymap as l,historyKeymap as m}from"/npm/@codemirror/commands@6.8.1/+esm";import{highlightSelectionMatches as K,searchKeymap as k}from"/npm/@codemirror/search@6.5.11/+esm";import{closeBrackets as b,autocompletion as w,closeBracketsKeymap as x,completionKeymap as C}from"/npm/@codemirror/autocomplete@6.18.6/+esm";import{lintKeymap as M}from"/npm/@codemirror/lint@6.8.5/+esm";const v=[p(),c(),t(),a(),g(),e(),h(),u.allowMultipleSelections.of(!0),y(),o(r,{fallback:!0}),d(),b(),w(),n(),s(),f(),K(),i.of([...x,...l,...k,...m,...S,...C,...M])],A=[t(),a(),e(),o(r,{fallback:!0}),i.of([...l,...m])];export{j as EditorView,v as basicSetup,A as minimalSetup};
//# sourceMappingURL=/sm/7c124203fca0197318b541915531fd2a39f3cf4ae991d58ffaf0d63745bc8fc2.map

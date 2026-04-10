# canvasLoading

カスタマイズ可能なキャンバス製ローディングアニメーション。2026 年向けに ES Modules＋Vite を前提とした構成へ再構築しました。

## 主なポイント
- **ES Modules / UMD のデュアル出力**  
  `npm run build:lib` で `dist/canvasLoading.es.js`（ESM）と `dist/canvasLoading.umd.js`（script タグで読み込める UMD）を生成。
- **Vite Dev Server で即時プレビュー**  
  `npm run dev` で `index.html` + `demo/main.js` をホットリロードしながら調整できます。
- **スタンドアロンのデモサイト**  
  `npm run build:demo` で `demo-dist/` に静的サイトを出力。GitHub Pages や社内ポータルにそのまま配置可能。
- 追加依存は Vite のみ。TypeScript なしでも最新ブラウザでそのまま import / tree-shake できます（今後 TS 化する場合も容易）。

## ディレクトリ構成
```
.
├── demo/                # Vite が読み込むデモ用エントリ (main.js, style.css)
├── dist/                # ライブラリのビルド成果物 (ES/UMD)
├── demo-dist/           # `npm run build:demo` の出力（git ignore 推奨）
├── src/canvasLoading.js # ライブラリ本体 (ESM)
├── index.html           # Vite デモのエントリ HTML
├── vite.config.js       # lib/demo の両モードを切り替える設定
└── package.json
```

## 必要環境
- Node.js 20 以上（npm 10 以上推奨）
- npm レジストリへアクセスできるネットワーク（初回セットアップ時のみ）

## npm スクリプト
```
npm run dev        # Vite デモサーバー (http://localhost:5173)
npm run build:lib  # ライブラリを ES/UMD 形式で dist/ 配下に出力
npm run build:demo # デモサイトを demo-dist/ にビルド
npm run build      # 上記 build:lib ⇒ build:demo を順番に実行
npm run preview    # build:demo 済みの成果物をローカル表示
```

> **注意**: 企業ネットワークやサンドボックスではポート開放が制限される場合があります。その場合は `npm run build:demo` のあとに `demo-dist/index.html` をダブルクリックして単体確認してください。

## 使い方（ライブラリ）

### npm / ESM
```js
import canvasLoading, { createCanvasLoading, defaultSettings } from './dist/canvasLoading.es.js';

// シングルトンをそのまま初期化
canvasLoading.init({ el: 'loading_canvas', text: 'Loading…' });

const loader = createCanvasLoading({ textColor: '#ff6b6b' });
loader.init({ canvas: document.querySelector('#another_canvas') });
```

### UMD（script タグ）
```html
<script src="./dist/canvasLoading.umd.js"></script>
<script>
  CanvasLoading.default.init({ el: 'canvas_loading' });
</script>
```
UMD 版は `CanvasLoading` というグローバルを公開し、その `default` が ESM と同じシングルトンです。`CanvasLoading.createCanvasLoading()` で複数インスタンスも扱えます。

### 設定項目
`defaultSettings` に全フィールドが定義されています。
- `el`: キャンバスの DOM ID（`canvas` を直接渡す場合は任意）
- `canvasSize`: キャンバスの一辺ピクセル
- `circleNumber`: 衛星数
- `speed`: 回転速度（-255〜255）
- `orbitRadiusRate`, `radius`, `length`: 幾何パラメータ (%)
- `color1` / `color2`: グラデーション始点・終点
- `hasStroke`, `strokeColor`: 枠線描画
- `text`, `textColor`, `fontsize`, `bold`: 中央テキスト

`new CanvasLoadingController()` を直接使えばカスタムコントローラを複数生成できます。`stop()`／`start()`／`newCanvas()`／`getCircles()` などの API も公開しています。

## デモ UI
`index.html` ＋ `demo/main.js` は Vite からロードされ、フォーム操作で `canvasLoading.init()` に設定値を渡すシンプルなパネルです。Vue などの追加依存は不要で、ES Modules + DOM API だけで完結します。

## 今後の拡張候補
1. **TypeScript 化 & 型配布** – `src/canvasLoading.js` を TS 化し、`.d.ts` を導出すれば IDE 補完がさらに強力に。
2. **UI コンポーネント化** – Vue 3 / React ラッパーや Storybook を追加し、組み込みパターンを共有。
3. **単体テスト** – `vitest` で `colorChannel`、`move` など数値ロジックの回帰テストを整備。
4. **アクセシビリティ強化** – Canvas 状態を DOM の `aria-live` に同期し、スクリーンリーダーにもフィードバックを提供。

## ライセンス
MIT License に基づきます。`LICENSE` ファイルを参照のうえ、商用・非商用問わず自由にご利用ください。

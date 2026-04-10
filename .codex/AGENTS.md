# canvasLoading JS 実装概要

## ディレクトリ構成
- `js/src/canvasLoading.js`: ウィジェット本体の ES2015 ソース。テキスト描画、衛星クラス、アニメーション制御、デフォルト値を定義している。
- `js/dist/canvasLoading.js` / `.min.js`: 上記ソースを Babel 6 でトランスパイル/圧縮した ES5 バンドル。デモや利用者側が読み込む成果物。
- `js/canvasLoadingDemo.js`: Vue 2 ベースのデモパネル。ランタイム設定を双方向バインドし、変更時に描画オブジェクトを再生成する。
- `js/index.js`: DOMContentLoaded 後に `canvasLoading.init()` を呼ぶだけのブートストラップ。
- `js/package-lock.json`: Babel CLI や chokidar など、ビルドに使う依存ツール群を記録したロックファイル。

## ランタイム構成要素 (js/src/canvasLoading.js)
- `canvasLoading.text`: 中央テキスト描画を担当。`draw()` で設定を取り込み、`setRGB()` で 16 進のカラーコードを RGB へ分解し、中央揃え・middle ベースラインでテキストを塗る。`bold` 指定にも対応。
- `canvasLoading.satellite`: 各回転体(衛星)を表すクラス。生成時に位相 (`radian`) を決め、共通の外観設定を保持する。主な役割:
  - `colorCode()`: インデックスごとに `color1` → `color2` を線形補間し、リング状のグラデーションを形成。
  - `move()`: `speed` を使ってラジアンを進め、±2π でラップしながら外側 (`x`,`y`) と内側 (`innerX`,`innerY`) の座標を `orbitRadiusRate` と `length` から算出。
  - `draw()`: 2 つの半円を背合わせに描いてカプセル形状を作り、グラデ色で塗りつぶし、必要に応じて `strokeColor` で縁取り。
  - ゲッター/セッターで `radiusCalc`・`orbitRadiusCalc`・`lengthCalc` などの派生値を公開し、外部からの参照/更新を簡潔にしている。
- `core` シングルトンはライフサイクルを調整:
  - `_init(args)`: 受け取った設定をデフォルトへマージし、canvas と ctx を確保してサイズを設定、衛星/テキストを生成し、描画ループを開始。デモフックがあれば通知。
  - `_newCanvas()`: `circleNumber` が変わったときに衛星配列を再生成し、UI との不整合を防ぐ。
  - `_drive()`: 60FPS (`1000/60` ms) の `setInterval` でキャンバスをクリアし、各衛星の `move().draw()` とテキスト描画を呼び出す。`_stop()` はタイマーだけを止め、状態は保持。
  - `_circles()`・`_open()`・`_close()` はデバッグ/デモ用フック。公開 API は `{ init, newCanvas, open, close, stop, getCircles }` として `canvasLoading` 名前空間へ束ねられる。

## デモ操作パネル (js/canvasLoadingDemo.js, index.html)
- `canvasLoading.demo.init()` は `#demo` 上に Vue インスタンスを立ち上げ、ランタイムと共有するリアクティブな `settings` を保持。HTML のスライダー/テキスト/チェックボックス全てが `v-model` で連携。
- `onChange` はキャンバスの `width`/`height` を更新してから `canvasLoading.newCanvas(settings)` を呼び、再生中のループを止めずに衛星配列を差し替える。
- 計算プロパティ `source` は現在の設定値を埋め込んだ HTML/JS スニペットを生成し、利用者がそのままコピーできるようにする。
- `index.html` は Vue CDN、デモスクリプト、ビルド済みライブラリ、`js/index.js` を読み込み、キャンバス本体と調整 UI を同じページ上に並べている。

## 初期化エントリーポイント (js/index.js)
- `DOMContentLoaded` で `canvasLoading.init()` を 1 回呼ぶだけの最小実装。利用側はここを書き換えるか、`canvasLoading.init({...})` へパラメータを渡して任意の要素へ組み込める。

## ビルド / 拡張メモ
- ロックファイルの内容から、`js/src` → `js/dist` のトランスパイルには Babel 6 + chokidar + glob などの旧世代スタックを想定していると分かる。再ビルドするなら `js/package.json` (未コミット) を補完するか、同等の Babel 設定を再構築する必要がある。
- ランタイム設定オブジェクト (`canvasLoading.js` 内の `settings`) が拡張ポイント一式。テキスト、サイズ、軌道、速度 (負値で逆回転)、カラーグラデーション、ストローク有無等を動的に更新可能。衛星は毎フレーム設定値を参照するため、衛星数を変えない限りデモ UI の変更はループを再作成せず即時反映される。

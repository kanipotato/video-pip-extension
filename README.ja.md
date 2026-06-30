# Video PiP Launcher

[English README](README.md)

Chrome拡張（Manifest V3）。ツールバーのアイコンをクリックするだけで、現在のページの動画をPicture-in-Picture（別ウィンドウ）で表示する。

## 主な機能

- ツールバーアイコンをクリックすると、ページ内で再生中の動画のうち最大のものをPiP表示
- 再生中の動画がない場合は、ページ内で最大の動画にフォールバック
- 既にPiP表示中の場合は、新しい対象に切り替え
- 成功・失敗（動画が見つからない、ブラウザAPIエラー等）をポップアップにステータス表示

## 仕組み

- `popup.js` がアクティブタブを取得し、`chrome.scripting.executeScript` で `content.js` を注入したうえで `startPiP` メッセージを送信
- `content.js` がメッセージを受け取り、対象の `<video>` 要素を選んで `requestPictureInPicture()` を呼び出す

## 権限

- `activeTab`, `scripting` — アイコンをクリックしたタブにのみコンテンツスクリプトを注入するために使用

## インストール（パッケージ化なし）

1. `chrome://extensions` を開く
2. 「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」→ このディレクトリを選択

## ファイル構成

```
manifest.json   # MV3マニフェスト
popup.html/js   # ツールバーのポップアップUI
content.js      # 動画を探してPiPをリクエスト
icon*.png       # ツールバーアイコン
```

// popup.js — ツールバーアイコンのポップアップ。ボタン押下でcontent.jsを注入しPiPを起動する。
const statusEl = document.getElementById("status");

// PiP起動ボタン: アクティブタブへcontent.jsを注入 → メッセージで開始指示 → 結果を表示。
document.getElementById("pipBtn").addEventListener("click", async () => {
  statusEl.textContent = "起動中...";
  statusEl.className = "";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // chrome:// や拡張機能ページはスクリプト注入が禁止されているため弾く。
  if (!tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://")) {
    statusEl.textContent = "このページでは使用できません。";
    statusEl.className = "error";
    return;
  }

  // content.jsを注入。既に注入済みでも二重登録はガードされる（content.js側）。
  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
  } catch (e) {
    statusEl.textContent = "スクリプト注入失敗: " + e.message;
    statusEl.className = "error";
    return;
  }

  chrome.tabs.sendMessage(tab.id, { action: "startPiP" }, (response) => {
    if (chrome.runtime.lastError) {
      statusEl.textContent = "通信エラー: " + chrome.runtime.lastError.message;
      statusEl.className = "error";
      return;
    }
    if (response?.ok) {
      statusEl.textContent = "✅ PiP を起動しました";
    } else {
      statusEl.textContent = "❌ " + (response?.reason ?? "不明なエラー");
      statusEl.className = "error";
    }
  });
});

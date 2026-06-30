// popup.js
const statusEl = document.getElementById("status");

document.getElementById("pipBtn").addEventListener("click", async () => {
  statusEl.textContent = "起動中...";
  statusEl.className = "";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://")) {
    statusEl.textContent = "このページでは使用できません。";
    statusEl.className = "error";
    return;
  }

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

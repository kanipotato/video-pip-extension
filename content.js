// content.js — ページに注入され、動画をピクチャーインピクチャー(PiP)で切り出すコンテンツスクリプト。
// popupから "startPiP" メッセージを受けてPiPを開始し、結果を返す。

// 同じタブへ複数回注入されてもリスナーを二重登録しないためのガード。
if (!window.__pipLauncherLoaded) {
  window.__pipLauncherLoaded = true;

  // popupからの開始指示を受け取り、PiP結果({ok, reason?})を非同期で返す。
  // return true は「sendResponseを非同期で呼ぶ」ことをChromeに伝える必須の合図。
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === "startPiP") {
      startPiP().then(sendResponse);
      return true;
    }
  });
}

/// ページ内の動画からPiP対象を選んで開始する。
/// 対象の選び方: 再生中の動画を優先し、その中で表示面積が最大のものを選ぶ（主動画とみなす）。
/// 既にPiP中なら一度解除してから開始する。成否は {ok, reason?} で返す。
async function startPiP() {
  const videos = Array.from(document.querySelectorAll("video"));
  if (videos.length === 0) {
    return { ok: false, reason: "このページに動画が見つかりません。" };
  }

  // 再生中(一時停止・終了しておらず、再生可能な状態)の動画を優先。無ければ全動画から選ぶ。
  const playing = videos.filter(v => !v.paused && !v.ended && v.readyState > 2);
  const target  = (playing.length > 0 ? playing : videos)
    .reduce((a, b) => (a.videoWidth * a.videoHeight) >= (b.videoWidth * b.videoHeight) ? a : b);

  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    }
    await target.requestPictureInPicture();
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

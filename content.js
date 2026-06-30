// content.js
if (!window.__pipLauncherLoaded) {
  window.__pipLauncherLoaded = true;

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === "startPiP") {
      startPiP().then(sendResponse);
      return true;
    }
  });
}

async function startPiP() {
  const videos = Array.from(document.querySelectorAll("video"));
  if (videos.length === 0) {
    return { ok: false, reason: "このページに動画が見つかりません。" };
  }

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

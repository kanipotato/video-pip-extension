# Video PiP Launcher

[日本語版 README](README.ja.md)

A Chrome extension (Manifest V3) that pops the current page's video into Picture-in-Picture with one click from the toolbar.

## Features

- Click the toolbar icon to launch the largest playing `<video>` on the page into PiP
- If nothing is currently playing, falls back to the largest video on the page
- Switches to the new PiP target if one is already active
- Shows a status message in the popup on success or failure (e.g. no video found, browser API error)

## How it works

- `popup.js` finds the active tab, injects `content.js` via `chrome.scripting.executeScript`, then sends a `startPiP` message
- `content.js` listens for that message, picks a target `<video>` element, and calls `requestPictureInPicture()`

## Permissions

- `activeTab`, `scripting` — only used to inject the content script into the tab you click the icon on

## Install (unpacked)

1. Open `chrome://extensions`
2. Enable "Developer mode"
3. "Load unpacked" → select this directory

## Files

```
manifest.json   # MV3 manifest
popup.html/js   # toolbar popup UI
content.js      # finds the video and requests PiP
icon*.png       # toolbar icons
```

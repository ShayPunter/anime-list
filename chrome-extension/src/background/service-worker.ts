// Minimal Manifest V3 service worker. The popup handles all state directly
// via chrome.storage, so for the MVP the worker just logs install/update
// events. Future work (badge counts for next airing episodes, notifications,
// context menu actions on AniList pages) would live here.

chrome.runtime.onInstalled.addListener((details) => {
    console.info('[AniTrack] installed/updated:', details.reason);
});

export {};

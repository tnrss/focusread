// Background service worker for Focus Leading Reader (Chrome MV3)
(() => {
  'use strict';

  // Handle keyboard shortcut (Cmd+Shift+Y / Ctrl+Shift+Y)
  chrome.commands.onCommand.addListener(async (command) => {
    if (command !== 'toggle-reader') return;

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'BRW_TOGGLE' });
    } catch (error) {
      // Content script may not be loaded yet, retry after brief delay
      setTimeout(async () => {
        try {
          await chrome.tabs.sendMessage(tab.id, { type: 'BRW_TOGGLE' });
        } catch (retryError) {
          console.error('Failed to toggle via keyboard shortcut:', retryError);
        }
      }, 200);
    }
  });
})();
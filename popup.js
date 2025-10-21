(() => {
  'use strict';

  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  async function toggleFocusReader() {
    const tab = await getActiveTab();
    if (!tab?.id) return;

    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'BRW_TOGGLE' });
    } catch (error) {
      console.error('Failed to toggle:', error);
      
      // Content script may not be loaded yet, try injecting it
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
        
        // Retry after injection
        setTimeout(async () => {
          try {
            await chrome.tabs.sendMessage(tab.id, { type: 'BRW_TOGGLE' });
          } catch (retryError) {
            console.error('Failed to toggle after injection:', retryError);
          }
        }, 100);
      } catch (injectError) {
        console.error('Failed to inject content script:', injectError);
      }
    }
  }

  // Initialize popup
  document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleFocusReader);
    }
  });
})();
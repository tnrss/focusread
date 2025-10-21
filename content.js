(() => {
  'use strict';
  
  const ATTR = 'data-focus-reader';
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'KBD', 'SAMP', 'TEXTAREA', 'INPUT', 'SELECT', 'MATH']);
  
  // Optimized settings for readability
  const CONFIG = {
    proportion: 0.4,      // Bold 40% of letters in each word
    minBold: 1,           // Minimum 1 letter bolded
    maxBold: 4,           // Maximum 4 letters bolded
    minWordLen: 3         // Only process words with 3+ letters
  };

  const LETTER_RX = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
  const WORD_LETTERS_RX = /[A-Za-zÀ-ÖØ-öø-ÿ]+/;

  // Inject styles once
  function ensureStyle() {
    if (document.getElementById('focus-reader-style')) return;
    const style = document.createElement('style');
    style.id = 'focus-reader-style';
    style.textContent = `
      .focus-word { white-space: pre-wrap; }
      .focus-lead { font-weight: 700; }
    `;
    document.head.appendChild(style);
  }

  // Calculate which letters to bold in a word
  function boldPart(word) {
    const letters = word.match(WORD_LETTERS_RX);
    if (!letters) return null;
    
    const len = letters[0].length;
    if (len < CONFIG.minWordLen) return null;
    
    const numBold = Math.min(CONFIG.maxBold, Math.max(CONFIG.minBold, Math.round(len * CONFIG.proportion)));
    let boldCount = 0;
    let result = '';
    
    for (const ch of word) {
      if (LETTER_RX.test(ch) && boldCount < numBold) {
        result += '\u0001' + ch; // Mark for bolding
        boldCount++;
      } else {
        result += '\u0002' + ch; // Mark as normal
      }
    }
    return result;
  }

  // Transform a text node into formatted spans
  function transformTextNode(node) {
    const text = node.nodeValue;
    if (!text || !text.trim()) return null;
    
    const tokens = text.split(/(\s+)/);
    let hasChanges = false;
    
    for (let i = 0; i < tokens.length; i++) {
      if (/\s+/.test(tokens[i])) continue;
      const bolded = boldPart(tokens[i]);
      if (bolded) {
        tokens[i] = bolded;
        hasChanges = true;
      }
    }
    
    if (!hasChanges) return null;
    
    const container = document.createElement('span');
    container.innerHTML = tokens.map(token => {
      if (!token.includes('\u0001') && !token.includes('\u0002')) {
        return token.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      
      let lead = '', rest = '';
      for (let i = 0; i < token.length; i += 2) {
        const marker = token[i];
        const ch = token[i + 1] || '';
        if (marker === '\u0001') lead += ch;
        else if (marker === '\u0002') rest += ch;
      }
      return `<span class="focus-word"><strong class="focus-lead">${lead}</strong>${rest}</span>`;
    }).join('');
    
    return container;
  }

  // Process all text nodes in the root element
  function processRoot(root) {
    ensureStyle();
    
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest('.focus-word')) return NodeFilter.FILTER_REJECT;
        if (parent.closest(`[${ATTR}="off"]`)) return NodeFilter.FILTER_REJECT;
        if (SKIP.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (window.getComputedStyle(parent).display === 'none') return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    
    const targets = [];
    while (walker.nextNode()) {
      targets.push(walker.currentNode);
    }
    
    for (const textNode of targets) {
      const replacement = transformTextNode(textNode);
      if (replacement) textNode.replaceWith(replacement);
    }
  }

  // Apply the focus reader effect
  function apply() {
    processRoot(document.body);
    document.body.setAttribute(ATTR, 'on');
  }

  // Remove the focus reader effect
  function remove() {
    document.querySelectorAll('.focus-word').forEach(word => {
      const fragment = document.createDocumentFragment();
      for (const child of [...word.childNodes]) {
        fragment.appendChild(child);
      }
      word.replaceWith(fragment);
    });
    
    const currentState = document.body.getAttribute(ATTR);
    if (currentState === 'on') {
      document.body.setAttribute(ATTR, 'off');
    } else {
      document.body.removeAttribute(ATTR);
    }
  }

  // Toggle between on and off states
  function toggle() {
    if (document.body.getAttribute(ATTR) === 'on') {
      remove();
    } else {
      apply();
    }
  }

  // Listen for toggle messages from popup or keyboard shortcut
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (!msg || msg.type !== 'BRW_TOGGLE') return;
    
    try {
      toggle();
      sendResponse({ ok: true });
    } catch (error) {
      sendResponse({ ok: false, error: String(error) });
    }
    return true;
  });

  // Watch for dynamic content changes (SPA support)
  let updateTimer = null;
  const observer = new MutationObserver(() => {
    if (document.body.getAttribute(ATTR) !== 'on') return;
    
    if (updateTimer) cancelAnimationFrame(updateTimer);
    updateTimer = requestAnimationFrame(() => processRoot(document.body));
  });
  
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
# Focus Leading Reader# Focus Leading Reader (Chrome MV3)



A simple, lightweight browser extension that **bolds the leading letters of words** to enhance reading speed and comprehension. Based on the bionic reading concept, this extension makes text easier to scan by emphasizing the beginning of each word.Bold the leading characters of words to aid faster, easier reading. Unaffiliated with any brand.



## ✨ Features## Dev setup (VS Code)



- **One-click toggle**: Enable/disable with a single click from the popup1. **Open folder**: File → Open Folder… → choose this project.

- **Keyboard shortcut**: Quick toggle with `Cmd+Shift+Y` (Mac) or `Ctrl+Shift+Y` (Windows/Linux)2. **Install dev tools** (optional):

- **Smart processing**:    ```bash

  - Bolds ~40% of letters in each word (1-4 letters max)   npm install

  - Only processes words with 3+ letters   ```

  - Skips code blocks, inputs, and other technical elements3. **Run & debug**:

- **Dynamic content support**: Works with single-page apps and dynamically loaded content   - Press `F5` and choose **Chrome: load extension & open test page** (or Edge).

- **No configuration needed**: Optimized settings work great out of the box   - This launches a fresh browser instance with only this extension loaded.

- **Zero tracking**: No data collection, no analytics, completely private   - Use the popup to **Toggle on this page**, or press **Ctrl/⌘+Shift+Y**.

4. **Iterate**:

## 🚀 Installation   - For content script changes (`content.js`), reload the test tab.

   - For background changes (`bg.js`), open `chrome://extensions`, click **Reload**, and **Inspect service worker** for logs.

### For Development5. **Build zip**:

1. Clone or download this repository   - VS Code: `Terminal` → `Run Task…` → **Zip extension** (creates `focus-leading-reader.zip`).

2. Open Chrome/Edge and navigate to `chrome://extensions/`   - Or: `npm run zip`.

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked" and select the extension folder## Files

5. The extension icon will appear in your toolbar- `manifest.json` — MV3 manifest

- `bg.js` — service worker (listens for keyboard command)

### For Production- `content.js` — formatting logic and mutation handling

1. Download the latest `focus-leading-reader.zip` from releases- `popup.html` / `popup.js` — quick controls & settings

2. Unzip the file- `options.html` — full settings

3. Follow steps 2-5 above- `.vscode/launch.json` — Debug configs for Chrome/Edge

- `.vscode/tasks.json` — Build zip / ESLint fix

## 📖 Usage- `.eslintrc.json` / `.prettierrc.json` / `.editorconfig` — code quality

- `package.json` — dev scripts and dependencies

1. **Click the extension icon** in your toolbar

2. **Click "Toggle on this page"** or press `Cmd+Shift+Y` (Mac) / `Ctrl+Shift+Y` (Windows/Linux)## Tips

3. The text on the page will transform with bolded leading letters- MV3 service workers sleep when idle; open **chrome://extensions → Inspect views (service worker)** to see console logs.

4. Click again or press the shortcut to turn it off- If you need TypeScript later, add a `tsconfig.json`, rename files to `.ts`, and bundle with esbuild or Vite before loading.


## 🛠️ Development

### Prerequisites
- Node.js (optional, for linting)
- Chrome or Edge browser

### Setup
```bash
# Install dev dependencies (optional)
npm install

# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix

# Create distribution zip
npm run zip
```

### VS Code Debugging
This project includes VS Code debug configurations:
1. Press `F5` to launch Chrome with the extension loaded
2. Set breakpoints in your code
3. Reload the extension to trigger breakpoints

### Project Structure
```
├── manifest.json      # Extension manifest (Chrome MV3)
├── bg.js             # Background service worker (keyboard shortcuts)
├── content.js        # Content script (text transformation logic)
├── popup.html        # Extension popup UI
├── popup.js          # Popup functionality
├── icons/            # Extension icons
└── .vscode/          # VS Code debug configs
```

## 🔧 How It Works

1. **Content Script Injection**: When you visit a webpage, `content.js` is automatically injected
2. **Text Analysis**: The script walks through all text nodes on the page
3. **Word Processing**: For each word:
   - Calculates how many letters to bold (40% of word length, min 1, max 4)
   - Wraps the bold portion in a `<strong>` tag
4. **Dynamic Updates**: A MutationObserver watches for new content and processes it automatically
5. **Clean Removal**: Toggle off to restore original text without page reload

## 🎯 Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: `activeTab`, `scripting`, `storage`
- **Performance**: Uses `requestAnimationFrame` for efficient DOM updates
- **Compatibility**: Works with dynamic SPAs (React, Vue, etc.)

## 📝 Tips

- Works best on article pages, blog posts, and reading-heavy content
- May not work on sites with heavy JavaScript-based rendering (PDFs, certain web apps)
- Toggle off if you notice any visual issues on specific sites
- The keyboard shortcut can be customized in `chrome://extensions/shortcuts`

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Inspired by the bionic reading concept and similar reading enhancement tools.

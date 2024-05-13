# Telegram Send

[![Mozilla Add-on](https://img.shields.io/amo/users/telegram-send?color=orange&logo=mozilla-firefox)](https://addons.mozilla.org/en-US/firefox/addon/telegram-send/)

[![Firefox Download](./src/images/firefox-badge.png)](https://addons.mozilla.org/en-US/firefox/addon/telegram-send/)

## Building

Requirements:

- **node.js** v20

First, run `npm install` to install the dependencies and build the extension.
The built extension will be output to `dist/`.

Then you can use `npm run prepare` to rebuild the extension again once,
or `npm run watch` to automatically rebuild on change.

## Running

To load the built extension in the browser:

- **Firefox**: Go to [`about:debugging`](about:debugging#/runtime/this-firefox), click "Load temporary Add-on" and select `dist/manifest.json` file.
- **Chrome**: Go to [`chrome://extensions`](chrome://extensions/), click "Load unpacked" and select the `dist/` folder

## Contributing

Before commit, run `npm test` to check the code for errors.
You can use `npm run format` to automatically fix format and linter errors.

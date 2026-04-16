# Azure Translator

Azure Translator is a browser-based translation app that uses the Microsoft Azure Translator service. It provides a clean interface for translating text between languages, swapping source and target languages, copying results, and saving Azure credentials locally in the browser.

## Features

- Translate text with the Azure Translator REST API
- Auto-detect the source language
- Swap source and target languages
- Copy translated text to the clipboard
- Clear input and output text quickly
- Save your Azure Translator key and region in local storage
- Responsive layout for desktop and mobile

## Files

- [index.html](index.html) - App markup and layout
- [style.css](style.css) - Visual styling and responsive design
- [script.js](script.js) - Translation logic, UI behavior, and Azure API calls

## Requirements

- An Azure Translator resource
- A Translator resource key
- The Azure resource region, or `global` if you are using the global endpoint
- A modern browser with JavaScript enabled

## Setup

1. Open the app in a browser or host the folder with any static web server.
2. Enter your Azure Translator key and region in the settings panel.
3. Click **Save & Connect**.
4. Type text in the source box, choose the target language, and click **Translate**.

## Usage

1. Paste or type the text you want to translate.
2. Choose a source language, or leave it on **Detect Language (Auto)**.
3. Select the target language.
4. Click **Translate** to get the translated text.
5. Use the swap button to switch languages, or the copy button to copy the result.

## Notes

- Credentials are stored locally in the browser using `localStorage`.
- The app is built as a static frontend and does not require a build step.
- If translation fails, verify the API key, region, and Azure Translator resource configuration.

## License

No license has been specified yet.
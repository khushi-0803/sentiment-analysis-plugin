# Sentiment Analysis Plugin

## Description
The Sentiment Analysis Plugin is a Chrome extension that analyzes the sentiment of headlines on a webpage. It classifies the sentiment as either positive or negative using a pre-trained BERT model.

## Installation

### Prerequisites
- Ensure you have Google Chrome and a source code editor like Visual Studio Code installed on your system.
- Install Node.js and npm.

### Steps to Install the Extension
1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/khushi-0803/sentiment-analysis-plugin.git
    ```
2. Navigate to the project directory:
    ```bash
    cd sentiment-analysis-plugin
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" using the toggle at the top-right corner.
   - Click "Load unpacked" and select the `sentiment-analysis-plugin` directory.

## Usage
After installation, you can use the plugin to analyze the sentiment of headlines on any webpage.

1. Navigate to a webpage containing headlines.
2. Click on the Sentiment Analysis Plugin icon in the Chrome toolbar.
3. The plugin will extract the headlines and classify their sentiment as either positive or negative, displaying the results in a popup.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Project Link
[https://github.com/khushi-0803/sentiment-analysis-plugin](https://github.com/khushi-0803/sentiment-analysis-plugin)

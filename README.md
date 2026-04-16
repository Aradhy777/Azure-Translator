# Azure Translator

A text translation application powered by the [Microsoft Azure Cognitive Services Translator API](https://azure.microsoft.com/en-us/products/ai-services/translator).

## Features

- Translate text between 100+ languages
- Simple interface — enter your text, choose a target language, and get an instant translation
- Powered by Azure Cognitive Services for high-quality, neural machine translation

## Prerequisites

- A Microsoft Azure account ([create one for free](https://azure.microsoft.com/free/))
- An **Azure Translator** resource created in the Azure portal

## Getting Your Azure Translator Keys

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. In the search bar, type **Translator** and select **Translator** under *Marketplace*.
3. Fill in the required details (subscription, resource group, region, pricing tier) and click **Review + Create**, then **Create**.
4. Once deployed, open the resource and navigate to **Keys and Endpoint** in the left menu.
5. Copy **Key 1** (or **Key 2**) and the **Endpoint** URL — you will need these in the next step.

## Configuration

Open the project's configuration file (or the relevant source file where the API credentials are set) and replace the placeholder values with your own keys:

```python
AZURE_TRANSLATOR_KEY      = "YOUR_AZURE_TRANSLATOR_KEY"
AZURE_TRANSLATOR_ENDPOINT = "https://api.cognitive.microsofttranslator.com/"
AZURE_TRANSLATOR_REGION   = "YOUR_AZURE_REGION"   # e.g. "eastus"
```

> **Security tip:** Never commit real API keys to source control. Consider using environment variables or a `.env` file (and adding it to `.gitignore`) to store sensitive credentials.

## Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/Aradhy777/Azure-Translator.git
   cd Azure-Translator
   ```
2. Install dependencies (if any):
   ```bash
   pip install -r requirements.txt
   ```
3. Add your Azure Translator credentials as described in the [Configuration](#configuration) section.
4. Run the application:
   ```bash
   python app.py
   ```
5. Enter the text you want to translate and select the target language when prompted.

## License

This project is open-source. Feel free to use and modify it for your own purposes.
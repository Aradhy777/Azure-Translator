// Language Mapping - ISO 639-1 codes to display names
const languageMap = {
    'af': 'Afrikaans',
    'ar': 'Arabic',
    'az': 'Azerbaijani',
    'bg': 'Bulgarian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'ca': 'Catalan',
    'cs': 'Czech',
    'cy': 'Welsh',
    'da': 'Danish',
    'de': 'German',
    'el': 'Greek',
    'en': 'English',
    'es': 'Spanish',
    'et': 'Estonian',
    'fa': 'Persian',
    'fi': 'Finnish',
    'fr': 'French',
    'ga': 'Irish',
    'he': 'Hebrew',
    'hi': 'Hindi',
    'hr': 'Croatian',
    'hu': 'Hungarian',
    'hy': 'Armenian',
    'id': 'Indonesian',
    'is': 'Icelandic',
    'it': 'Italian',
    'ja': 'Japanese',
    'ka': 'Georgian',
    'kk': 'Kazakh',
    'ko': 'Korean',
    'lt': 'Lithuanian',
    'lv': 'Latvian',
    'mk': 'Macedonian',
    'mn': 'Mongolian',
    'ms': 'Malay',
    'mt': 'Maltese',
    'nl': 'Dutch',
    'no': 'Norwegian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'sq': 'Albanian',
    'sr': 'Serbian',
    'sv': 'Swedish',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'zh-Hans': 'Chinese Simplified',
    'zh-Hant': 'Chinese Traditional'
};

// DOM Elements
const apiKeyInput = document.getElementById('apiKey');
const regionInput = document.getElementById('region');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const settingsStatus = document.getElementById('settingsStatus');
const sourceText = document.getElementById('sourceText');
const targetDiv = document.getElementById('targetText');
const sourceLangSelect = document.getElementById('sourceLanguage');
const targetLangSelect = document.getElementById('targetLanguage');
const translateBtn = document.getElementById('translateBtn');
const swapLanguagesBtn = document.getElementById('swapLanguagesBtn');
const clearSourceBtn = document.getElementById('clearSourceBtn');
const clearTargetBtn = document.getElementById('clearTargetBtn');
const copyTargetBtn = document.getElementById('copyTargetBtn');
const charCountSpan = document.getElementById('charCount');
const loadingIndicator = document.getElementById('loadingIndicator');
const detectedLangBadge = document.getElementById('detectedLangBadge');
const bgInteractiveGlow = document.getElementById('bgInteractiveGlow');

// Settings Panel Collapse
const settingsPanel = document.getElementById('settingsPanel');
const toggleSettingsBtn = document.getElementById('toggleSettingsBtn');
const settingsContent = document.getElementById('settingsContent');

let isSettingsCollapsed = false;

toggleSettingsBtn.addEventListener('click', () => {
    isSettingsCollapsed = !isSettingsCollapsed;
    if (isSettingsCollapsed) {
        settingsContent.classList.add('collapsed');
        toggleSettingsBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
    } else {
        settingsContent.classList.remove('collapsed');
        toggleSettingsBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    }
});

// Interactive background glow that follows pointer movement.
function setupInteractiveBackground() {
    if (!bgInteractiveGlow) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        bgInteractiveGlow.style.display = 'none';
        return;
    }

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
        document.documentElement.style.setProperty('--mouse-x', '50%');
        document.documentElement.style.setProperty('--mouse-y', '28%');
        return;
    }

    window.addEventListener('pointermove', (event) => {
        const x = (event.clientX / window.innerWidth) * 100;
        const y = (event.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    });
}

// Initialize language dropdowns
function populateLanguageDropdowns() {
    const options = Object.entries(languageMap)
        .sort(([, a], [, b]) => a.localeCompare(b))
        .map(([code, name]) => `<option value="${code}">${name}</option>`)
        .join('');
    
    sourceLangSelect.innerHTML = `<option value="auto">🔍 Detect Language (Auto)</option>${options}`;
    targetLangSelect.innerHTML = options;
    
    // Set default values
    sourceLangSelect.value = 'auto';
    targetLangSelect.value = 'en';
}

// Load saved settings from localStorage
function loadSettings() {
    const savedKey = localStorage.getItem('azure_translator_key');
    const savedRegion = localStorage.getItem('azure_translator_region');
    
    if (savedKey) apiKeyInput.value = savedKey;
    if (savedRegion) regionInput.value = savedRegion;
    
    if (savedKey && savedRegion) {
        settingsStatus.innerHTML = '<span style="color: var(--success);"><i class="fas fa-check-circle"></i> Settings loaded from storage</span>';
    }
}

// Save settings to localStorage
function saveSettings() {
    const key = apiKeyInput.value.trim();
    const region = regionInput.value.trim();
    
    if (!key || !region) {
        settingsStatus.innerHTML = '<span style="color: var(--error);"><i class="fas fa-exclamation-triangle"></i> Please enter both API Key and Region</span>';
        setTimeout(() => settingsStatus.innerHTML = '', 3000);
        return false;
    }
    
    localStorage.setItem('azure_translator_key', key);
    localStorage.setItem('azure_translator_region', region);
    
    settingsStatus.innerHTML = '<span style="color: var(--success);"><i class="fas fa-check-circle"></i> Settings saved successfully!</span>';
    setTimeout(() => settingsStatus.innerHTML = '', 3000);
    return true;
}

// Update character count
function updateCharCount() {
    const count = sourceText.value.length;
    charCountSpan.textContent = count;
}

// Show/hide loading state
function setLoading(isLoading) {
    if (isLoading) {
        loadingIndicator.classList.add('active');
        translateBtn.disabled = true;
        translateBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Translating...';
    } else {
        loadingIndicator.classList.remove('active');
        translateBtn.disabled = false;
        translateBtn.innerHTML = '<i class="fas fa-robot"></i> Translate';
    }
}

// Display error message
function showError(message) {
    targetDiv.innerHTML = `<span style="color: var(--error);">⚠️ ${message}</span>`;
}

// Core translation function
async function translateText() {
    const apiKey = localStorage.getItem('azure_translator_key');
    const region = localStorage.getItem('azure_translator_region');
    
    if (!apiKey || !region) {
        showError('Please configure your Azure Translator credentials in the settings panel above.');
        settingsPanel.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    const textToTranslate = sourceText.value.trim();
    if (!textToTranslate) {
        showError('Please enter some text to translate.');
        return;
    }
    
    const fromLang = sourceLangSelect.value;
    const toLang = targetLangSelect.value;
    
    if (!toLang) {
        showError('Please select a target language.');
        return;
    }
    
    setLoading(true);
    
    try {
        // Determine endpoint - use global endpoint if region is "global", otherwise regional endpoint
        const endpoint = region.toLowerCase() === 'global' 
            ? 'https://api.cognitive.microsofttranslator.com/translate'
            : 'https://api.cognitive.microsofttranslator.com/translate';
        
        // Build URL with query parameters
        let url = `${endpoint}?api-version=3.0&to=${toLang}`;
        if (fromLang && fromLang !== 'auto') {
            url += `&from=${fromLang}`;
        }
        
        // Prepare request body
        const body = [{ Text: textToTranslate }];
        
        // Set up headers - IMPORTANT: Both key and region are required
        const headers = {
            'Ocp-Apim-Subscription-Key': apiKey,
            'Ocp-Apim-Subscription-Region': region,
            'Content-Type': 'application/json'
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            let errorMsg = `Translation failed (${response.status})`;
            if (errorData.error && errorData.error.message) {
                errorMsg = errorData.error.message;
            } else if (response.status === 401) {
                errorMsg = 'Invalid API key. Please check your credentials.';
            } else if (response.status === 403) {
                errorMsg = 'Access forbidden. Please verify your region and permissions.';
            }
            throw new Error(errorMsg);
        }
        
        const data = await response.json();
        
        if (data && data[0] && data[0].translations && data[0].translations[0]) {
            const translation = data[0].translations[0].text;
            targetDiv.textContent = translation;
            
            // Display detected language if auto-detect was used
            if (fromLang === 'auto' && data[0].detectedLanguage) {
                const detectedCode = data[0].detectedLanguage.language;
                const detectedName = languageMap[detectedCode] || detectedCode.toUpperCase();
                detectedLangBadge.style.display = 'inline-block';
                detectedLangBadge.textContent = `🔍 Detected: ${detectedName}`;
                setTimeout(() => {
                    detectedLangBadge.style.opacity = '0';
                    setTimeout(() => detectedLangBadge.style.display = 'none', 300);
                }, 3000);
            }
        } else {
            throw new Error('Unexpected API response format');
        }
        
    } catch (error) {
        console.error('Translation error:', error);
        showError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
        setLoading(false);
    }
}

// Swap source and target languages
function swapLanguages() {
    const sourceLang = sourceLangSelect.value;
    const targetLang = targetLangSelect.value;
    
    if (sourceLang === 'auto') {
        showError('Cannot swap when source language is set to "Auto Detect". Please select a specific source language.');
        return;
    }
    
    // Swap the selected languages
    sourceLangSelect.value = targetLang;
    targetLangSelect.value = sourceLang;
    
    // Also swap the text content if there's translated text available
    const translatedText = targetDiv.textContent;
    const sourceTextContent = sourceText.value;
    
    if (translatedText && translatedText !== 'Click "Translate" to start...' && !translatedText.includes('⚠️')) {
        sourceText.value = translatedText;
        targetDiv.textContent = sourceTextContent;
        updateCharCount();
    }
}

// Copy translation to clipboard
async function copyTranslation() {
    const translation = targetDiv.textContent;
    if (!translation || translation === 'Click "Translate" to start...' || translation.includes('⚠️')) {
        showError('Nothing to copy. Please translate some text first.');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(translation);
        const originalText = copyTargetBtn.innerHTML;
        copyTargetBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            copyTargetBtn.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        showError('Failed to copy text to clipboard.');
    }
}

// Clear source text
function clearSource() {
    sourceText.value = '';
    targetDiv.innerHTML = 'Click "Translate" to start...';
    updateCharCount();
    detectedLangBadge.style.display = 'none';
}

// Clear target text
function clearTarget() {
    targetDiv.innerHTML = 'Click "Translate" to start...';
}

// Event Listeners
saveSettingsBtn.addEventListener('click', saveSettings);
translateBtn.addEventListener('click', translateText);
swapLanguagesBtn.addEventListener('click', swapLanguages);
clearSourceBtn.addEventListener('click', clearSource);
clearTargetBtn.addEventListener('click', clearTarget);
copyTargetBtn.addEventListener('click', copyTranslation);
sourceText.addEventListener('input', updateCharCount);

// Keyboard shortcut: Ctrl/Cmd + Enter to translate
sourceText.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        translateText();
    }
});

// Initialize the application
function init() {
    populateLanguageDropdowns();
    loadSettings();
    updateCharCount();
    targetDiv.innerHTML = 'Click "Translate" to start...';
    setupInteractiveBackground();
}

init();
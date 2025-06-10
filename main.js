// main.js (Definitive, Corrected Version)

// Import all page modules
import * as page1 from './pages/page1-company-info.js';
import * as page2 from './pages/page2-choose-product.js';
import * as page3 from './pages/page3-verification.js';
import * as page4 from './pages/page4-success.js';

// --- App State ---
const appState = {
    // START the flow at Step 1
    currentStep: 1,
    maxCompletedStep: 1,
    // ... rest of your appState
    userData: {
        name: "Shon Levin",
        email: "levinshon@gmail.com"
    },
    companyData: { name: '', id: '', timezone: '', logoFile: null, logoUrl: null },
    products: []
};

// Map steps to their page modules. Now a direct 1-to-1 mapping.
const pages = {
    1: page1,
    2: page2,
    3: page3,
    4: page4, // Placeholder for the success page
};

// --- DOM Elements ---
const contentContainer = document.getElementById('app-content');
const pageContainer = document.querySelector('.page-container');
const progressBarSteps = document.querySelectorAll('.progress-bar .step');

// --- Core Navigation Logic ---
async function navigateToStep(stepNumber) {
    if (stepNumber > appState.maxCompletedStep || !pages[stepNumber]) {
        console.warn(`Navigation to step ${stepNumber} is not allowed or page module does not exist.`);
        return;
    }

    appState.currentStep = stepNumber;

    contentContainer.classList.add('fade-out');
    await new Promise(resolve => setTimeout(resolve, 300));

    const page = pages[stepNumber];
    
    // =========================================================
    // CRITICAL FIX IS HERE:
    // We pass the global `appState` object to the getHtml function.
    // =========================================================
    contentContainer.innerHTML = page.getHtml(appState);

    page.init(appState, {
        next: goToNextStep,
        back: goToPreviousStep,
        disableBackButton: disableBackButton,
    });

    updateProgressBar();
    updateHeader();
    await setLanguage(localStorage.getItem('language') || 'en', false);

    contentContainer.classList.remove('fade-out');
}

function goToNextStep() {
    const nextStep = appState.currentStep + 1;
    if (pages[nextStep]) {
        appState.maxCompletedStep = Math.max(appState.maxCompletedStep, nextStep);
        navigateToStep(nextStep);
    } else {
        console.log("On the last step, preparing to finalize.");
    }
}

function goToPreviousStep() {
    // Let's create a real step 1 page later. For now, this is safe.
    const prevStep = appState.currentStep - 1;
    if (pages[prevStep]) {
        navigateToStep(prevStep);
    }
}

function disableBackButton() {
    progressBarSteps.forEach(stepEl => {
        stepEl.style.pointerEvents = 'none';
    });
    console.log("Backward navigation has been disabled.");
}

// --- UI Update Functions ---

function updateProgressBar() {
    progressBarSteps.forEach(stepEl => {
        const step = parseInt(stepEl.dataset.step, 10);
        stepEl.classList.remove('active', 'completed');
        
        // If we are on the success page (step 4), complete all steps
        if (appState.currentStep === 4) {
            stepEl.classList.add('completed');
        } 
        // Otherwise, use the standard logic
        else {
            if (step < appState.currentStep) {
                stepEl.classList.add('completed');
            } else if (step === appState.currentStep) {
                stepEl.classList.add('active');
            }
        }
    });
}

function updateHeader() {
    const userNameElement = document.getElementById('user-name-header');
    const companyNameEl = document.getElementById('company-name-header');
    const logoContainer = document.getElementById('dynamic-logo-container');

    if (userNameElement) userNameElement.textContent = appState.userData.name;
    
    if (companyNameEl) {
        const currentLang = localStorage.getItem('language') || 'en';
        companyNameEl.textContent = appState.companyData.name || translations[currentLang]?.header_company_title || "Your Company";
    }

    logoContainer.innerHTML = '';
    if (appState.companyData.logoUrl) {
        const logoImg = document.createElement('img');
        logoImg.src = appState.companyData.logoUrl;
        logoImg.alt = appState.company_name + " Logo";
        logoContainer.appendChild(logoImg);
    } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'logo-placeholder';
        logoContainer.appendChild(placeholder);
    }
}

// --- Language Switcher (No changes needed) ---
async function setLanguage(langCode, withAnimation = true) {
    if (!translations[langCode]) return;
    if (withAnimation) {
        pageContainer.classList.add('lang-change-fade');
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    const langData = translations[langCode];
    localStorage.setItem('language', langCode);
    document.documentElement.lang = langCode;
    document.documentElement.dir = langData.direction || 'ltr';
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.dataset.langKey;
        if (langData[key]) el.innerHTML = langData[key];
    });
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
        const key = el.dataset.langPlaceholder;
        if (langData[key]) el.placeholder = langData[key];
    });
    document.title = langData[document.body.dataset.titleKey] || langData.title;
    updateHeader();
    if (withAnimation) {
        pageContainer.classList.remove('lang-change-fade');
    }
}

function initializeLanguageSwitcher() {
    const container = document.getElementById('lang-switcher-container');
    if (!container) return;
    container.innerHTML = '';
    const selector = document.createElement('select');
    selector.className = 'lang-select';
    for (const langCode in translations) {
        const option = document.createElement('option');
        option.value = langCode;
        option.textContent = langCode.toUpperCase();
        selector.appendChild(option);
    }
    container.appendChild(selector);
    selector.addEventListener('change', (e) => setLanguage(e.target.value, true));
    const savedLang = localStorage.getItem('language') || 'en';
    selector.value = savedLang;
    setLanguage(savedLang, false);
}

// --- Initializer ---
function init() {
    console.log("App Initializing...");
    initializeLanguageSwitcher();
    
    progressBarSteps.forEach(stepEl => {
        stepEl.addEventListener('click', () => {
            // This logic needs to map visual step back to app step
            const visualStepToNavigate = parseInt(stepEl.dataset.step, 10);
            const appStepToNavigate = visualStepToNavigate - 1;
            navigateToStep(appStepToNavigate);
        });
    });

    navigateToStep(1); // Start the flow on app step 1
}

document.addEventListener('DOMContentLoaded', init);
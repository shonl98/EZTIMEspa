document.addEventListener('DOMContentLoaded', () => {

  

    const langSwitcherContainer = document.getElementById('lang-switcher-container');
    let langSelect; // This will hold the <select> element

    // --- Core function to apply language changes to the page ---
    const changeLanguage = (lang) => {
        if (!translations[lang]) return; // Exit if language doesn't exist

        // Set document direction and lang attributes for accessibility and CSS
        document.documentElement.lang = lang;
        document.documentElement.dir = translations[lang].direction;

        // Translate all elements with data-lang-key attribute
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            element.innerText = translations[lang][key] || `[${key}]`; // Fallback to key
        });

        // Translate all placeholders with data-lang-placeholder attribute
        document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
            const key = element.getAttribute('data-lang-placeholder');
            element.placeholder = translations[lang][key] || `[${key}]`; // Fallback to key
        });
        
        // Update the dropdown to show the currently selected language
        if (langSelect) {
            langSelect.value = lang;
        }

        // Save user's preference in local storage for next visit
        localStorage.setItem('language', lang);
    };
    
    // --- Function to dynamically create the language dropdown ---
    const createLanguageSelector = () => {
        const selector = document.createElement('select');
        selector.className = 'lang-select';
        
        // Create an <option> for each language in the languages object
        Object.keys(translations).forEach(langCode => {
            const option = document.createElement('option');
            option.value = langCode;
            option.textContent = translations[langCode].nativeName;
            selector.appendChild(option);
        });

        // Add event listener to change language when a new option is selected
        selector.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
        
        // Add the created dropdown to its container in the HTML
        langSwitcherContainer.appendChild(selector);
        return selector;
    };

    // --- Initialization on page load ---
    langSelect = createLanguageSelector();
    const savedLang = localStorage.getItem('language') || 'he'; // Default to Hebrew if no preference is saved
    changeLanguage(savedLang);

    const nextButton = document.getElementById('submit-btn');

    nextButton.addEventListener('click', (event) => {
        // LOGIC
        event.preventDefault();
        console.log("Navigating to the next page...");
        window.location.href = 'spa.html'; 
    });
    

});

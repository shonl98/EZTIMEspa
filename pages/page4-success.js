// pages/page4-success.js (Final Enhanced Version)

function getHtml(appState) {
  // THIS IS THE FIX:
  // Point to the Lottie file you just downloaded and placed in your project.
  const lottieAnimationUrl = "img/Animation - 1749597614594.json";

  return `
        <div class="success-container">
            
            <lottie-player 
                src="${lottieAnimationUrl}" 
                background="transparent" 
                speed="1" 
                style="width: 250px; height: 250px; margin: 0 auto -20px;" 
                autoplay>
            </lottie-player>
            <h1 class="page-title success-title" data-lang-key="success_title">All Set!</h1>
            <p class="success-subtitle" data-lang-key="success_subtitle">Your company has been configured successfully.</p>
            
            <div id="redirect-notice" class="redirect-notice" data-lang-key="success_redirect_notice"></div>

           <button id="go-to-dashboard-btn" class="submit-btn">
        <span data-lang-key="button_go_to_dashboard">Go to Dashboard</span>
        
        <!-- LTR (Right) Arrow -->
        <svg class="btn-arrow ltr-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        
        <!-- RTL (Left) Arrow -->
        <svg class="btn-arrow rtl-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>

    </button>

        </div>
    `;
}

function init(appState, navigation) {
    document.body.dataset.titleKey = 'title_success';
    
    navigation.disableBackButton();

    // --- Element Selectors ---
    const dashboardBtn = document.getElementById('go-to-dashboard-btn');
    const redirectNotice = document.getElementById('redirect-notice');
    
    let countdown = 5;

    // THIS IS THE KEY FIX
    const updateNotice = () => {
        // 1. Get the current language from the <html> tag.
        const currentLang = document.documentElement.lang || 'en';
        
        // 2. Get the correct template directly from the translations object.
        // Provide a safe fallback in case the key doesn't exist.
        const noticeTemplate = translations[currentLang]?.success_redirect_notice || "You will be redirected in {seconds} seconds...";
        
        // 3. Replace the placeholder and update the text.
        redirectNotice.textContent = noticeTemplate.replace('{seconds}', countdown);
    };

    // Run it once immediately to set the initial text correctly.
    updateNotice(); 

    const interval = setInterval(() => {
        countdown--;
        if (countdown >= 0) {
            updateNotice(); // Update the notice with the new countdown value.
        }

        if (countdown < 0) {
            clearInterval(interval);
            redirectToDashboard();
        }
    }, 1000);

    const redirectToDashboard = () => {
        clearInterval(interval);
        
        const currentLang = document.documentElement.lang || 'en';
        redirectNotice.textContent = translations[currentLang]?.success_redirecting || "Redirecting...";
        
        dashboardBtn.style.opacity = '0.7';
        dashboardBtn.style.pointerEvents = 'none';

        alert("Redirecting to the main application dashboard...");
        // In a real app: window.location.href = '/dashboard'; 
    };

    dashboardBtn.addEventListener('click', redirectToDashboard);
}

export { getHtml, init };

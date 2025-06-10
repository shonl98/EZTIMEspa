// pages/page3-verification.js (Full and Corrected)

function getHtml(appState) {
    const userEmail = appState?.userData?.email || "loading...";

    return `
        <div class="verification-container">
            <h1 class="page-title" data-lang-key="verify_title"></h1>
            <p class="verification-subtitle">
                <span data-lang-key="verify_subtitle"></span>
                <br>
                <strong>${userEmail}</strong>
            </p>

            <div class="code-inputs" id="code-inputs">
                <input type="text" inputmode="numeric" pattern="[0-9]*" class="code-input" maxlength="1" required>
                <input type="text" inputmode="numeric" pattern="[0-9]*" class="code-input" maxlength="1" required>
                <input type="text" inputmode="numeric" pattern="[0-9]*" class="code-input" maxlength="1" required>
                <input type="text" inputmode="numeric" pattern="[0-9]*" class="code-input" maxlength="1" required>
                <input type="text" inputmode="numeric" pattern="[0-9]*" class="code-input" maxlength="1" required>
                <input type="text" inputmode="numeric" pattern="[0-9]*" class="code-input" maxlength="1" required>
            </div>

            <div id="error-message" class="error-message" style="display: none; text-align: center;"></div>
            
            <div class="verification-footer">
                <span data-lang-key="verify_didnt_get"></span>
                <a href="#" id="resend-link" class="action-link" data-lang-key="verify_resend"></a>,
                <span data-lang-key="verify_or"></span>
                <a href="#" id="change-mail-link" class="action-link" data-lang-key="verify_change_mail"></a>
            </div>
        </div>

        <!-- HTML for the Change Email Modal -->
        <div class="modal-overlay" id="change-email-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title" data-lang-key="modal_change_email_title"></h2>
                    <button class="modal-close-btn" id="modal-close-btn">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="new-email-input" data-lang-key="label_new_email"></label>
                        <input type="email" id="new-email-input" placeholder="example@company.com">
                        <div id="modal-error-message" class="error-message" style="display: none; margin-top: 0.5rem;"></div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="submit-btn" id="update-email-btn" data-lang-key="button_update_email"></button>
                </div>
            </div>
        </div>
    `;
}

function init(appState, navigation) {
    document.body.dataset.titleKey = 'title_verification';
    
    // --- Element Selectors ---
    const inputs = [...document.querySelectorAll('.code-input')];
    const errorMessageDiv = document.getElementById('error-message');
    const resendLink = document.getElementById('resend-link');
    const changeMailLink = document.getElementById('change-mail-link');
    const emailDisplay = document.querySelector('.verification-subtitle strong');

    // --- Modal Element Selectors ---
    const modal = document.getElementById('change-email-modal');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const newEmailInput = document.getElementById('new-email-input');
    const updateEmailBtn = document.getElementById('update-email-btn');
    const modalErrorDiv = document.getElementById('modal-error-message');

    // --- Verification Code Logic ---
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', (e) => {
            if (!['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'].includes(e.key) && !/^\d$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
            }
            if (e.key === 'Backspace' && !input.value && index > 0) {
                inputs[index - 1].focus();
            }
            if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            if (e.key === 'ArrowLeft' && index > 0) {
                inputs[index - 1].focus();
            }
        });
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, '');
            if (input.value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            if (inputs.every(i => i.value)) {
                verifyCode();
            }
        });
    });

    inputs[0]?.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
        if (pastedText) {
            let currentDigit = 0;
            for(let i = 0; i < inputs.length && currentDigit < pastedText.length; i++) {
                inputs[i].value = pastedText[currentDigit++];
            }
            const focusIndex = Math.min(inputs.length - 1, pastedText.length - 1);
            inputs[focusIndex].focus();
            if (pastedText.length >= inputs.length) {
                verifyCode();
            }
        }
    });

    function verifyCode() {
        const code = inputs.map(input => input.value).join('');
        if (code.length !== 6) return;

        if (code === '000000') {
            navigation.next();
        } else {
            const currentLang = document.documentElement.lang;
            const errorText = translations[currentLang]?.verify_error || "Something Wrong, please check the code again";
            showError(errorText);
        }
    }

    function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
        setTimeout(() => { errorMessageDiv.style.opacity = 1; }, 10);
        inputs.forEach(input => input.classList.add('input-error'));
        
        setTimeout(() => {
            inputs.forEach(i => i.value = '');
            inputs[0].focus();
        }, 100);

        setTimeout(() => {
            errorMessageDiv.style.opacity = 0;
            inputs.forEach(input => input.classList.remove('input-error'));
            setTimeout(() => { errorMessageDiv.style.display = 'none'; }, 500);
        }, 4000);
    }

    // --- "Resend Code" Mock Logic ---
    resendLink.addEventListener('click', (e) => {
        e.preventDefault();
        const originalText = resendLink.innerHTML;
        const currentLang = document.documentElement.lang;
        
        resendLink.innerHTML = translations[currentLang]?.resend_sending || "Sending...";
        resendLink.style.pointerEvents = 'none';
        resendLink.style.opacity = '0.6';

        setTimeout(() => {
            resendLink.innerHTML = translations[currentLang]?.resend_sent || "Sent! Check your inbox.";
            setTimeout(() => {
                resendLink.innerHTML = originalText;
                resendLink.style.pointerEvents = 'auto';
                resendLink.style.opacity = '1';
            }, 3000);
        }, 1500);
    });

    // --- "Change Email" Modal Logic ---
    const openModal = () => modal.classList.add('visible');
    const closeModal = () => {
        modal.classList.remove('visible');
        modalErrorDiv.style.display = 'none';
        newEmailInput.value = '';
    };

    changeMailLink.addEventListener('click', (e) => {
        e.preventDefault();
        newEmailInput.value = appState.userData.email;
        openModal();
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });


updateEmailBtn.addEventListener('click', () => {
    const newEmail = newEmailInput.value.trim();
    
    // Simple email validation
    if (!/^\S+@\S+\.\S+$/.test(newEmail)) {
        // --- THIS IS THE FIX ---
        const currentLang = document.documentElement.lang;
        const errorText = translations[currentLang]?.error_invalid_email || "Please enter a valid email address.";
        
        modalErrorDiv.textContent = errorText;
        modalErrorDiv.style.display = 'block';
        setTimeout(() => { modalErrorDiv.style.opacity = '1'; }, 10); // Fade in
        
        // Hide the error after 4 seconds
        setTimeout(() => {
            modalErrorDiv.style.opacity = '0';
            setTimeout(() => { modalErrorDiv.style.display = 'none'; }, 500); // Hide completely after fade
        }, 4000);
        // --- END OF FIX ---
        
        return; // Stop the function here
    }

    // --- This part runs only if the email is valid ---
    
    // ======================================================================
    // DEVELOPER NOTE:
    // Here, you would make a server call to update the user's email.
    // For now, we'll just update the state locally.
    // ======================================================================
    
    appState.userData.email = newEmail; // Update the global state
    emailDisplay.textContent = newEmail; // Update the UI immediately
    
    closeModal();
    
    // Optional: Trigger the "Resend Code" flow automatically
    resendLink.click();
});

    // --- Final Setup ---
    navigation.disableBackButton();
    inputs[0]?.focus();
}

export { getHtml, init };
// pages/page1-company-info.js

function getHtml() {
    return `
        <h1 class="page-title" data-lang-key="page_title">Set Your Company</h1>
        <form class="setup-form" id="company-info-form">
            <!-- Company Details Card -->
            <div class="form-card">
                <h2 class="card-title"><img src="img/company_icon.svg" alt=""> <span data-lang-key="card_company_details">Company Details</span></h2>
                <div class="form-row">
                    <div class="form-group">
                        <label for="company-name"><span data-lang-key="label_company_name">Company Name</span> <span class="required">*</span></label>
                        <input type="text" id="company-name" data-lang-placeholder="placeholder_company_name" required>
                    </div>
                    <div class="form-group">
                        <label for="company-id"><span data-lang-key="label_company_id">Company ID</span> <span class="required">*</span></label>
                        <input type="text" id="company-id" data-lang-placeholder="placeholder_company_id" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="timezone-select" data-lang-key="label_time_zone">Time Zone</label>
                    <select id="timezone-select" style="width: 100%;"></select>
                </div>
                <div class="form-group">
                    <label><span data-lang-key="label_logo">Logo</span> <span class="label-note" data-lang-key="hint_logo"></span></label>
                    <div class="logo-upload-area">
                        <img src="#" alt="Upload Preview" class="logo-preview" id="logo-preview" hidden>
                        <input type="file" id="logo-upload-input" accept="image/*" hidden>
                        <button type="button" class="upload-btn" id="upload-btn">
                            <img src="img/upload_icon.svg" alt=""> <span data-lang-key="button_upload">Upload</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Admin Details Card -->
            <div class="form-card">
                <h2 class="card-title"><img src="img/user_icon.svg" alt=""> <span data-lang-key="card_admin_details">Admin Details</span></h2>
                <div class="form-group">
                    <label for="user-name"><span data-lang-key="label_user_name">User Name</span> <span class="required">*</span></label>
                    <input type="text" id="user-name" data-lang-placeholder="placeholder_user_name" required>
                </div>
                <div class="form-group">
                    <label for="password"><span data-lang-key="label_password">Password</span> <span class="required">*</span></label>
                    <input type="password" id="password" data-lang-placeholder="placeholder_password" required>
                </div>
                <button id="submit-btn" type="submit" class="submit-btn" data-lang-key="button_next">Next</button>
            </div>
        </form>
    `;
}

// Function to initialize the JS for this page
function init(appState, navigation) {
    document.body.dataset.titleKey = 'title';

    // *** NEW: Populate form with existing data from appState ***
    populateForm(appState);
    
    initializeTimezoneSelector(appState.companyData.timezone);
    initializeFileUpload(appState);

    const form = document.getElementById('company-info-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const companyNameInput = document.getElementById('company-name');
        const companyIdInput = document.getElementById('company-id');
        if (!companyNameInput.value || !companyIdInput.value) {
            alert('Please fill in all required fields.');
            return;
        }

        // Save data to the global state
        appState.companyData.name = companyNameInput.value;
        appState.companyData.id = companyIdInput.value;
        appState.companyData.timezone = $('#timezone-select').val();
        
        // Move to the next step
        navigation.next();
    });
}

/**
 * NEW: Pre-fills the form fields from the global state.
 * @param {object} appState The global application state.
 */
function populateForm(appState) {
    document.getElementById('company-name').value = appState.companyData.name || '';
    document.getElementById('company-id').value = appState.companyData.id || '';

    if (appState.companyData.logoUrl) {
        const previewImage = document.getElementById("logo-preview");
        previewImage.src = appState.companyData.logoUrl;
        previewImage.hidden = false;
    }
}

function initializeTimezoneSelector(defaultTimezone) {
    const timezones = [
      { id: "Etc/GMT+12", text: "(GMT-12:00) International Date Line West" },
      { id: "Pacific/Honolulu", text: "(GMT-10:00) Hawaii" },
      { id: "America/Los_Angeles", text: "(GMT-08:00) Pacific Time (US & Canada)" },
      { id: "America/Chicago", text: "(GMT-06:00) Central Time (US & Canada)" },
      { id: "America/New_York", text: "(GMT-05:00) Eastern Time (US & Canada)" },
      { id: "Asia/Jerusalem", text: "(GMT+03:00) Israel" },
      { id: "Europe/London", text: "(GMT+01:00) London" },
    ];
    
    const selectedTimezone = defaultTimezone || "Asia/Jerusalem";

    $("#timezone-select")
      .select2({ data: timezones, placeholder: "Select a timezone" })
      .val(selectedTimezone)
      .trigger("change");
}

function initializeFileUpload(appState) {
    const uploadInput = document.getElementById("logo-upload-input");
    const uploadButton = document.getElementById("upload-btn");
    const previewImage = document.getElementById("logo-preview");

    uploadButton.addEventListener("click", () => uploadInput.click());

    uploadInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            appState.companyData.logoFile = file; // Store file object
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target.result;
                previewImage.src = dataUrl;
                appState.companyData.logoUrl = dataUrl; // Store data URL for preview
                previewImage.hidden = false;
            };
            reader.readAsDataURL(file);
        }
    });
}

export { getHtml, init };
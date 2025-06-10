// pages/page2-choose-product.js



function getHtml() {
    return `
        <h1 class="page-title" data-lang-key="page_title_how_to_start"></h1>
        <div class="product-selection-form">
            <!-- Product Card: Attendance -->
            <div class="product-card">
                <div class="product-header">
                    <img src="img/attandance.svg" alt="">
                    <div>
                        <h3 data-lang-key="product_attendance"></h3>
                        <p><span data-lang-key="product_attendance_desc"></span> <a  class="try-link" data-lang-key="try_for_free"></a></p>
                    </div>
                    
                    <div class="product-selector">
                        
                        <input type="checkbox" id="attendance-select" name="attendance" value="Attendance" class="product-radio-input">
                        <label for="attendance-select" class="product-radio-label"></label>
                    </div>

                </div>
                <div class="features-grid" id="attendance-features"></div>
            </div>

            <!-- Product Card: Shift Organize -->
            <div class="product-card">
                <div class="product-header">
                    <img src="img/shift.svg" alt="">
                    <div>
                        <h3 data-lang-key="product_shift_organize"></h3>
                        <p><span data-lang-key="product_shift_organize_desc"></span>  <a  class="try-link" data-lang-key="try_for_free"></a></p>
                    </div>

                    <div class="product-selector">
                     
                        <input type="checkbox" id="shift-select" name="shift_organize" value="Shift Organize" class="product-radio-input">
                        <label for="shift-select" class="product-radio-label"></label>
                    </div>

                </div>
                <div class="features-grid" id="shift-features"></div>
            </div>
        </div>
        <div class="form-actions">
            <button type="button" class="submit-btn" id="next-button" data-lang-key="button_next"></button>
            <div id="selection-error" class="error-message" style="opacity: 0; display: none;"></div>
        </div>
    `;
}
function init(appState, navigation) {
    document.body.dataset.titleKey = 'title_choose_product';

    renderFeatures('attendance', document.getElementById('attendance-features'));
    renderFeatures('shift_organize', document.getElementById('shift-features'));
 const nextButton = document.getElementById('next-button');
    nextButton.addEventListener('click', () => {
        const selectedProducts = [];
        // Find ALL checked inputs
        document.querySelectorAll('.product-radio-input:checked').forEach(checkbox => {
            selectedProducts.push(checkbox.value);
        });

        const errorDiv = document.getElementById('selection-error');
        const currentLang = document.documentElement.lang;

        if (selectedProducts.length === 0) { // If the array is empty
            errorDiv.textContent = translations[currentLang]?.selectAtLeastOne || "Please select at least one product to continue.";
            errorDiv.style.display = 'block';
            setTimeout(() => { errorDiv.style.opacity = '1'; }, 10);
            setTimeout(() => { 
                errorDiv.style.opacity = '0'; 
                setTimeout(() => { errorDiv.style.display = 'none'; }, 500);
            }, 4000);
        } else {
            // At least one product is selected
            appState.products = selectedProducts; // Store the array (e.g., ["Attendance", "Shift Organize"])
            console.log("Selected products:", appState.products);
            navigation.next();
        }
    });

}

function renderFeatures(productKey, container) {
    if (!featuresData[productKey] || !container) return;
    container.innerHTML = '';
    const features = featuresData[productKey];
    features.forEach(feature => {
        const chip = document.createElement('div');
        chip.className = 'feature-chip';
        chip.innerHTML = `
            <img src="${feature.icon}" alt="">
            <span data-lang-key="${feature.key}"></span>
        `;
        container.appendChild(chip);
    });
}

export { getHtml, init };
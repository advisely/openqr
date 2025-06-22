const themeToggle = document.getElementById('checkbox');
const body = document.body;
const qrTextInput = document.getElementById('qr-text');
const qrCodeContainer = document.getElementById('qr-code');
const colorDarkInput = document.getElementById('color-dark');
const colorLightInput = document.getElementById('color-light');
const correctionLevelInput = document.getElementById('correction-level');
const downloadBtn = document.getElementById('download-btn');
const logoInput = document.getElementById('logo-upload');
const clearLogoBtn = document.getElementById('clear-logo-btn');
const outlineCheckbox = document.getElementById('qr-outline');
const qrSizeInput = document.getElementById('qr-size');
const logoLabel = document.querySelector('.logo-label');

// Tabs and Content
const tabs = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');
const textInput = document.getElementById('text-input');
const wifiSsidInput = document.getElementById('wifi-ssid');
const wifiPasswordInput = document.getElementById('wifi-password');
const wifiEncryptionInput = document.getElementById('wifi-encryption');
const vcardNameInput = document.getElementById('vcard-name');
const vcardPhoneInput = document.getElementById('vcard-phone');
const vcardEmailInput = document.getElementById('vcard-email');
const levelHelpIcon = document.getElementById('level-help-icon');
const levelTooltip = document.getElementById('level-tooltip');

// Tooltip hover functionality
const helpIcons = document.querySelectorAll('.help-icon');
helpIcons.forEach(icon => {
    const tooltip = icon.nextElementSibling;
    if (tooltip && tooltip.classList.contains('tooltip')) {
        icon.addEventListener('mouseenter', () => {
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        });
        icon.addEventListener('mouseleave', () => {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        });
    }
});

let logoImage = null;

let qrcode = null;

// Tab switching logic
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const tabId = tab.dataset.tab;
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabId) {
                content.classList.add('active');
            }
        });
        generateQRCode(); // Regenerate QR on tab switch
    });
});

function getQRCodeData() {
    const activeTab = document.querySelector('.tab-link.active').dataset.tab;
    switch (activeTab) {
        case 'url':
            return qrTextInput.value;
        case 'text':
            return textInput.value;
        case 'wifi':
            const ssid = wifiSsidInput.value;
            const password = wifiPasswordInput.value;
            const encryption = wifiEncryptionInput.value;
            if (!ssid) return '';
            return `WIFI:T:${encryption};S:${ssid};P:${password};;`;
        case 'vcard':
            const name = vcardNameInput.value;
            const phone = vcardPhoneInput.value;
            const email = vcardEmailInput.value;
            if (!name && !phone && !email) return '';
            return `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
        default:
            return '';
    }
}

function generateQRCode() {
    const text = getQRCodeData().trim();
    const addOutline = outlineCheckbox.checked;
    const qrSize = parseInt(qrSizeInput.value, 10);

    qrCodeContainer.innerHTML = ''; // Clear previous QR code

    if (text === '') {
        downloadBtn.style.display = 'none';
        return;
    }

    // --- Step 1: Generate base QR code in a temporary element ---
    const tempDiv = document.createElement('div');
    new QRCode(tempDiv, {
        text: text,
        width: qrSize,
        height: qrSize,
        colorDark: colorDarkInput.value,
        colorLight: colorLightInput.value,
        correctLevel: QRCode.CorrectLevel[correctionLevelInput.value]
    });
    const baseCanvas = tempDiv.querySelector('canvas');

    // --- Step 2: Create the final canvas with a quiet zone ---
    const quietZone = 16; // 16px quiet zone around the QR code
    const finalSize = qrSize + quietZone * 2;
    
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = finalSize;
    finalCanvas.height = finalSize;
    const ctx = finalCanvas.getContext('2d');

    // --- Step 3: Draw elements onto the final canvas ---
    // Background
    ctx.fillStyle = colorLightInput.value;
    ctx.fillRect(0, 0, finalSize, finalSize);

    // Outline (if checked, draw it first)
    if (addOutline) {
        // Make outline and gap proportional to the QR code size
        const outlineWidth = Math.max(4, Math.round(qrSize / 32)); // e.g., 8px for 256, 16px for 512
        const outlineGap = Math.max(2, Math.round(qrSize / 64));   // e.g., 4px for 256, 8px for 512

        // Draw a larger rectangle for the border
        const outerRectPos = quietZone - outlineGap - outlineWidth;
        const outerRectSize = qrSize + 2 * (outlineGap + outlineWidth);
        ctx.fillStyle = colorDarkInput.value;
        ctx.fillRect(outerRectPos, outerRectPos, outerRectSize, outerRectSize);

        // Punch a hole in the middle with the background color to create the frame
        const innerRectPos = quietZone - outlineGap;
        const innerRectSize = qrSize + 2 * outlineGap;
        ctx.fillStyle = colorLightInput.value;
        ctx.fillRect(innerRectPos, innerRectPos, innerRectSize, innerRectSize);
    }

    // QR Code in the middle (drawn on top of the background/frame)
    ctx.drawImage(baseCanvas, quietZone, quietZone);

    // --- Step 4: Add logo if it exists (and size is large enough) ---
    if (logoImage && qrSizeInput.value === '256') {
        const logoSize = qrSize * 0.2; // Logo is 20% of the QR code size
        const logoX = (finalSize - logoSize) / 2;
        const logoY = (finalSize - logoSize) / 2;
        const logoPadding = Math.max(2, Math.round(qrSize / 128)); // Proportional padding

        // White background behind logo
        ctx.fillStyle = '#FFF';
        ctx.fillRect(logoX - logoPadding, logoY - logoPadding, logoSize + logoPadding * 2, logoSize + logoPadding * 2);

        // Draw logo
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
    }

    // --- Step 5: Display the final canvas ---
    qrCodeContainer.appendChild(finalCanvas);
    downloadBtn.style.display = 'inline-block';
}

function downloadQRCode() {
    const canvas = qrCodeContainer.querySelector('canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'openqr_with_logo.png';
        link.click();
    }
}

// Event Listeners for real-time generation
qrTextInput.addEventListener('input', generateQRCode);
colorDarkInput.addEventListener('input', generateQRCode);
colorLightInput.addEventListener('input', generateQRCode);
correctionLevelInput.addEventListener('change', generateQRCode);
outlineCheckbox.addEventListener('change', generateQRCode);

function handleSizeChange() {
    const isLogoAllowed = qrSizeInput.value === '256';

    logoInput.disabled = !isLogoAllowed;
    clearLogoBtn.disabled = !isLogoAllowed;
    logoLabel.classList.toggle('disabled', !isLogoAllowed);

    // If user switches to a size where logo is not allowed, remove the logo and regenerate
    if (!isLogoAllowed && logoImage) {
        logoImage = null;
        logoInput.value = '';
    }
    generateQRCode();
}

qrSizeInput.addEventListener('change', handleSizeChange);

// Run on page load to set initial state
document.addEventListener('DOMContentLoaded', handleSizeChange);

// Event listeners for new data type inputs
textInput.addEventListener('input', generateQRCode);
wifiSsidInput.addEventListener('input', generateQRCode);
wifiPasswordInput.addEventListener('input', generateQRCode);
wifiEncryptionInput.addEventListener('change', generateQRCode);
vcardNameInput.addEventListener('input', generateQRCode);
vcardPhoneInput.addEventListener('input', generateQRCode);
vcardEmailInput.addEventListener('input', generateQRCode);

// Event Listeners for logo
logoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            logoImage = new Image();
            logoImage.onload = () => {
                generateQRCode();
                clearLogoBtn.style.display = 'inline-block';
            };
            logoImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

clearLogoBtn.addEventListener('click', () => {
    logoImage = null;
    logoInput.value = '';
    clearLogoBtn.style.display = 'none';
    generateQRCode();
});

// Event Listener for download
downloadBtn.addEventListener('click', downloadQRCode);

// Initial generation if there's text already (e.g., from browser cache)
if (qrTextInput.value) {
    generateQRCode();
}

// --- Theme Switcher Logic ---
function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.checked = true;
    } else {
        body.classList.remove('dark-mode');
        themeToggle.checked = false;
    }
}

function switchTheme(e) {
    const theme = e.target.checked ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    applyTheme(theme);
}

themeToggle.addEventListener('change', switchTheme, false);

// Check for saved theme on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Or check for system preference
    applyTheme('dark');
}

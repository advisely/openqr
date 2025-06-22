const qrTextInput = document.getElementById('qr-text');
const qrCodeContainer = document.getElementById('qr-code');
const colorDarkInput = document.getElementById('color-dark');
const colorLightInput = document.getElementById('color-light');
const downloadBtn = document.getElementById('download-btn');

let qrcode = null;

function generateQRCode() {
    const text = qrTextInput.value.trim();

    if (text === '') {
        qrCodeContainer.innerHTML = '';
        downloadBtn.style.display = 'none';
        if (qrcode) {
            qrcode.clear();
        }
        return;
    }

    // Clear previous QR code before generating a new one
    qrCodeContainer.innerHTML = '';

    qrcode = new QRCode(qrCodeContainer, {
        text: text,
        width: 256,
        height: 256,
        colorDark: colorDarkInput.value,
        colorLight: colorLightInput.value,
        correctLevel: QRCode.CorrectLevel.H
    });

    // Show the download button
    downloadBtn.style.display = 'inline-block';
}

function downloadQRCode() {
    const canvas = qrCodeContainer.querySelector('canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'qrcode.png';
        link.click();
    }
}

// Event Listeners for real-time generation
qrTextInput.addEventListener('input', generateQRCode);
colorDarkInput.addEventListener('input', generateQRCode);
colorLightInput.addEventListener('input', generateQRCode);

// Event Listener for download
downloadBtn.addEventListener('click', downloadQRCode);

// Initial generation if there's text already (e.g., from browser cache)
if (qrTextInput.value) {
    generateQRCode();
}

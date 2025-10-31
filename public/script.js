// Configuration - will use relative URLs for Vercel
const API_URL = '/api';
const FETCH_TIMEOUT = 30000; // 30 seconds for database wake-up

// Fetch with timeout and retry for database wake-up
async function fetchWithTimeout(url, options = {}, timeout = FETCH_TIMEOUT) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - database may be waking up. Please try again.');
        }
        throw error;
    }
}

// DOM Elements
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const uploadStatus = document.getElementById('upload-status');
const startScanBtn = document.getElementById('start-scan-btn');
const stopScanBtn = document.getElementById('stop-scan-btn');
const scannerContainer = document.getElementById('scanner-container');
const scannerVideo = document.getElementById('scanner-video');
const scannerCanvas = document.getElementById('scanner-canvas');
const manualBarcode = document.getElementById('manual-barcode');
const manualLocation = document.getElementById('manual-location');
const manualSubmit = document.getElementById('manual-submit');
const scanResult = document.getElementById('scan-result');
const resultContent = document.getElementById('result-content');
const exportBtn = document.getElementById('export-btn');
const resetBtn = document.getElementById('reset-btn');

// Stats elements
const statTotal = document.getElementById('stat-total');
const statScanned = document.getElementById('stat-scanned');
const statShortages = document.getElementById('stat-shortages');
const statOverages = document.getElementById('stat-overages');
const statWrong = document.getElementById('stat-wrong');

// Scanner state
let scanning = false;
let videoStream = null;
let lastScannedCode = null;
let lastScanTime = 0;
const SCAN_COOLDOWN = 2000; // 2 seconds between same barcode scans

// Upload spreadsheet
uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) {
        showStatus('Please select a file', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';
        showStatus('Uploading spreadsheet (database may take a moment to wake up)...', 'info');

        const response = await fetchWithTimeout(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            showStatus(data.message, 'success');
            updateStats();
        } else {
            showStatus(`Error: ${data.error}`, 'error');
        }
    } catch (error) {
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload Spreadsheet';
    }
});

// Start camera scanning
startScanBtn.addEventListener('click', async () => {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });

        scannerVideo.srcObject = videoStream;
        scannerContainer.classList.add('active');
        startScanBtn.style.display = 'none';
        stopScanBtn.style.display = 'block';
        scanning = true;

        scannerVideo.play();
        requestAnimationFrame(scanFrame);
    } catch (error) {
        alert('Camera access denied or not available: ' + error.message);
    }
});

// Stop camera scanning
stopScanBtn.addEventListener('click', () => {
    stopScanning();
});

function stopScanning() {
    scanning = false;
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    scannerContainer.classList.remove('active');
    startScanBtn.style.display = 'block';
    stopScanBtn.style.display = 'none';
}

// Scan frame for barcode
function scanFrame() {
    if (!scanning) return;

    const canvas = scannerCanvas;
    const video = scannerVideo;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            const currentTime = Date.now();

            // Prevent duplicate scans
            if (code.data !== lastScannedCode || currentTime - lastScanTime > SCAN_COOLDOWN) {
                lastScannedCode = code.data;
                lastScanTime = currentTime;
                processBarcode(code.data);
            }
        }
    }

    requestAnimationFrame(scanFrame);
}

// Manual barcode entry
manualSubmit.addEventListener('click', () => {
    const barcode = manualBarcode.value.trim();
    if (barcode) {
        const location = manualLocation.value.trim();
        processBarcode(barcode, location);
        manualBarcode.value = '';
        manualLocation.value = '';
    }
});

// Process scanned/entered barcode
async function processBarcode(barcode, location = '') {
    try {
        const response = await fetch(`${API_URL}/scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ barcode, location })
        });

        const data = await response.json();

        if (response.ok) {
            displayScanResult(data);
            updateStats();

            // Play feedback sound/vibration
            if (navigator.vibrate) {
                navigator.vibrate(data.matched ? 200 : 400);
            }
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Display scan result
function displayScanResult(data) {
    scanResult.style.display = 'block';

    if (data.matched) {
        if (data.status === 'CORRECT_LOCATION') {
            scanResult.className = 'scan-result match';
            resultContent.innerHTML = `
                <strong>MATCH - Correct Location</strong>
                <p><strong>Instrument:</strong> ${data.instrument_number || 'N/A'}</p>
                <p><strong>Serial:</strong> ${data.manufacturer_serial || 'N/A'}</p>
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>Location:</strong> ${data.expected_location}</p>
            `;
        } else if (data.status === 'WRONG_LOCATION') {
            scanResult.className = 'scan-result wrong-location';
            resultContent.innerHTML = `
                <strong>MATCH - Wrong Location</strong>
                <p><strong>Instrument:</strong> ${data.instrument_number || 'N/A'}</p>
                <p><strong>Serial:</strong> ${data.manufacturer_serial || 'N/A'}</p>
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>Expected Location:</strong> ${data.expected_location}</p>
                <p><strong>Actual Location:</strong> ${data.actual_location || 'Not specified'}</p>
            `;
        } else if (data.status === 'NO_LOCATION_IN_SYSTEM') {
            scanResult.className = 'scan-result wrong-location';
            resultContent.innerHTML = `
                <strong>MATCH - No Location in System</strong>
                <p><strong>Instrument:</strong> ${data.instrument_number || 'N/A'}</p>
                <p><strong>Serial:</strong> ${data.manufacturer_serial || 'N/A'}</p>
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>Note:</strong> This item has no location recorded in the system</p>
            `;
        } else {
            scanResult.className = 'scan-result match';
            resultContent.innerHTML = `
                <strong>MATCH - Found</strong>
                <p><strong>Instrument:</strong> ${data.instrument_number || 'N/A'}</p>
                <p><strong>Serial:</strong> ${data.manufacturer_serial || 'N/A'}</p>
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>Expected Location:</strong> ${data.expected_location}</p>
            `;
        }
    } else {
        scanResult.className = 'scan-result no-match';
        resultContent.innerHTML = `
            <strong>NOT FOUND - Overage</strong>
            <p><strong>Barcode:</strong> ${data.barcode}</p>
            <p><strong>Status:</strong> This item is not in the inventory system</p>
            <p><strong>Location:</strong> ${data.actual_location || 'Not specified'}</p>
        `;
    }

    // Auto-hide after 5 seconds
    setTimeout(() => {
        scanResult.style.display = 'none';
    }, 5000);
}

// Update statistics
async function updateStats() {
    try {
        const response = await fetchWithTimeout(`${API_URL}/stats`);
        const data = await response.json();

        if (response.ok) {
            statTotal.textContent = data.total_items;
            statScanned.textContent = data.matched_scans;
            statShortages.textContent = data.shortages;
            statOverages.textContent = data.overages;
            statWrong.textContent = data.wrong_locations;
        }
    } catch (error) {
        console.error('Error updating stats:', error);
        // Set to 0 if database is sleeping
        statTotal.textContent = '...';
        statScanned.textContent = '...';
        statShortages.textContent = '...';
        statOverages.textContent = '...';
        statWrong.textContent = '...';
    }
}

// Export report
exportBtn.addEventListener('click', async () => {
    try {
        window.location.href = `${API_URL}/export`;
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Reset scan data
resetBtn.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to reset all scan data? This will keep your inventory but clear all scans.')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/reset`, {
            method: 'POST'
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            updateStats();
            scanResult.style.display = 'none';
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Helper function to show status messages
function showStatus(message, type) {
    uploadStatus.textContent = message;
    uploadStatus.className = `status-message ${type}`;
    uploadStatus.style.display = 'block';

    setTimeout(() => {
        uploadStatus.style.display = 'none';
    }, 5000);
}

// Initialize stats on page load
updateStats();

// Handle page visibility to stop camera when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden && scanning) {
        stopScanning();
    }
});

// Allow Enter key for manual submission
manualBarcode.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        manualSubmit.click();
    }
});

manualLocation.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        manualSubmit.click();
    }
});

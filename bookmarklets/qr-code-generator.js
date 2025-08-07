// QR Code Generator Bookmarklet
// Generates QR codes for the current URL or custom text

javascript:(function(){
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        border: 2px solid #333;
        border-radius: 10px;
        padding: 25px;
        z-index: 999999;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        min-width: 400px;
        max-width: 90vw;
    `;
    
    modal.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid #eee;padding-bottom:15px">
            <h3 style="margin:0">📱 QR Code Generator</h3>
            <button onclick="this.closest('div').remove()" style="background:#dc3545;color:#fff;border:none;padding:5px 10px;border-radius:3px;cursor:pointer">✕</button>
        </div>
        
        <div style="margin-bottom:15px">
            <label style="display:block;margin-bottom:5px;font-weight:bold">Text or URL:</label>
            <textarea id="qrText" rows="3" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:3px;resize:vertical;font-family:inherit">${location.href}</textarea>
        </div>
        
        <div style="margin-bottom:15px;display:grid;grid-template-columns:1fr 1fr;gap:15px">
            <div>
                <label style="display:block;margin-bottom:5px;font-weight:bold">Size:</label>
                <select id="qrSize" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:3px">
                    <option value="150">Small (150px)</option>
                    <option value="250" selected>Medium (250px)</option>
                    <option value="350">Large (350px)</option>
                    <option value="500">Extra Large (500px)</option>
                </select>
            </div>
            <div>
                <label style="display:block;margin-bottom:5px;font-weight:bold">Error Correction:</label>
                <select id="errorCorrection" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:3px">
                    <option value="L">Low (7%)</option>
                    <option value="M" selected>Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                </select>
            </div>
        </div>
        
        <div style="margin-bottom:15px">
            <button onclick="generateQR()" style="background:#007bff;color:#fff;border:none;padding:12px 20px;border-radius:5px;cursor:pointer;width:100%;font-size:16px">
                🔲 Generate QR Code
            </button>
        </div>
        
        <div id="qrResult" style="display:none;text-align:center">
            <div style="margin-bottom:15px;padding:20px;background:#f8f9fa;border-radius:8px">
                <img id="qrImage" style="max-width:100%;height:auto;border:1px solid #ddd">
            </div>
            <div style="display:flex;gap:10px;justify-content:center">
                <button onclick="downloadQR()" style="background:#28a745;color:#fff;border:none;padding:8px 15px;border-radius:3px;cursor:pointer">💾 Download</button>
                <button onclick="copyQRImage()" style="background:#6c757d;color:#fff;border:none;padding:8px 15px;border-radius:3px;cursor:pointer">📋 Copy Image</button>
            </div>
        </div>
        
        <div style="background:#e3f2fd;padding:15px;border-radius:5px;font-size:12px;color:#1976d2;margin-top:15px">
            <strong>ℹ️ Info:</strong> QR codes are generated using the QR Server API. No data is stored on their servers.
        </div>
    `;
    
    window.generateQR = function() {
        const text = modal.querySelector('#qrText').value.trim();
        const size = modal.querySelector('#qrSize').value;
        const errorCorrection = modal.querySelector('#errorCorrection').value;
        
        if (!text) {
            alert('Please enter text or URL to generate QR code');
            return;
        }
        
        // Use QR Server API (free, no API key required)
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&ecc=${errorCorrection}&data=${encodeURIComponent(text)}`;
        
        const qrImage = modal.querySelector('#qrImage');
        const resultDiv = modal.querySelector('#qrResult');
        
        qrImage.src = qrUrl;
        qrImage.onload = () => {
            resultDiv.style.display = 'block';
        };
        
        qrImage.onerror = () => {
            alert('Failed to generate QR code. Please try again.');
        };
    };
    
    window.downloadQR = function() {
        const qrImage = modal.querySelector('#qrImage');
        const text = modal.querySelector('#qrText').value.trim();
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = qrImage.naturalWidth;
        canvas.height = qrImage.naturalHeight;
        ctx.drawImage(qrImage, 0, 0);
        
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `qr-code-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    };
    
    window.copyQRImage = function() {
        const qrImage = modal.querySelector('#qrImage');
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = qrImage.naturalWidth;
        canvas.height = qrImage.naturalHeight;
        ctx.drawImage(qrImage, 0, 0);
        
        canvas.toBlob(blob => {
            if (navigator.clipboard && window.ClipboardItem) {
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]).then(() => {
                    const btn = modal.querySelector('button[onclick="copyQRImage()"]');
                    const originalText = btn.textContent;
                    btn.textContent = '✅ Copied!';
                    setTimeout(() => btn.textContent = originalText, 2000);
                }).catch(() => {
                    alert('Copy not supported in this browser');
                });
            } else {
                alert('Image copy not supported in this browser. Use Download instead.');
            }
        });
    };
    
    document.body.appendChild(modal);
})();
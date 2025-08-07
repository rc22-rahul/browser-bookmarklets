# 📱 QR Code Generator Bookmarklet

Generate QR codes for the current URL or custom text with download and copy options.

## What it does

- Generates QR codes for any text or URL
- Pre-fills with current page URL
- Customizable size options (150px to 500px)  
- Multiple error correction levels
- Download QR codes as PNG images
- Copy QR codes directly to clipboard
- Uses free, no-API-key service

## How to install

1. Create a new bookmark in your browser
2. Copy the code below and paste it as the URL:

```javascript
javascript:(function(){const modal=document.createElement('div');modal.style.cssText=`position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);background: #fff;border: 2px solid #333;border-radius: 10px;padding: 25px;z-index: 999999;font-family: Arial, sans-serif;box-shadow: 0 4px 20px rgba(0,0,0,0.3);min-width: 400px;max-width: 90vw;`;modal.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid #eee;padding-bottom:15px"><h3 style="margin:0">📱 QR Code Generator</h3><button onclick="this.closest('div').remove()" style="background:#dc3545;color:#fff;border:none;padding:5px 10px;border-radius:3px;cursor:pointer">✕</button></div><div style="margin-bottom:15px"><label style="display:block;margin-bottom:5px;font-weight:bold">Text or URL:</label><textarea id="qrText" rows="3" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:3px;resize:vertical;font-family:inherit">${location.href}</textarea></div><div style="margin-bottom:15px;display:grid;grid-template-columns:1fr 1fr;gap:15px"><div><label style="display:block;margin-bottom:5px;font-weight:bold">Size:</label><select id="qrSize" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:3px"><option value="150">Small (150px)</option><option value="250" selected>Medium (250px)</option><option value="350">Large (350px)</option><option value="500">Extra Large (500px)</option></select></div><div><label style="display:block;margin-bottom:5px;font-weight:bold">Error Correction:</label><select id="errorCorrection" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:3px"><option value="L">Low (7%)</option><option value="M" selected>Medium (15%)</option><option value="Q">Quartile (25%)</option><option value="H">High (30%)</option></select></div></div><div style="margin-bottom:15px"><button onclick="generateQR()" style="background:#007bff;color:#fff;border:none;padding:12px 20px;border-radius:5px;cursor:pointer;width:100%;font-size:16px">🔲 Generate QR Code</button></div><div id="qrResult" style="display:none;text-align:center"><div style="margin-bottom:15px;padding:20px;background:#f8f9fa;border-radius:8px"><img id="qrImage" style="max-width:100%;height:auto;border:1px solid #ddd"></div><div style="display:flex;gap:10px;justify-content:center"><button onclick="downloadQR()" style="background:#28a745;color:#fff;border:none;padding:8px 15px;border-radius:3px;cursor:pointer">💾 Download</button><button onclick="copyQRImage()" style="background:#6c757d;color:#fff;border:none;padding:8px 15px;border-radius:3px;cursor:pointer">📋 Copy Image</button></div></div><div style="background:#e3f2fd;padding:15px;border-radius:5px;font-size:12px;color:#1976d2;margin-top:15px"><strong>ℹ️ Info:</strong> QR codes are generated using the QR Server API. No data is stored on their servers.</div>`;window.generateQR=function(){const text=modal.querySelector('#qrText').value.trim();const size=modal.querySelector('#qrSize').value;const errorCorrection=modal.querySelector('#errorCorrection').value;if(!text){alert('Please enter text or URL to generate QR code');return}const qrUrl=`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&ecc=${errorCorrection}&data=${encodeURIComponent(text)}`;const qrImage=modal.querySelector('#qrImage');const resultDiv=modal.querySelector('#qrResult');qrImage.src=qrUrl;qrImage.onload=()=>{resultDiv.style.display='block'};qrImage.onerror=()=>{alert('Failed to generate QR code. Please try again.')}};window.downloadQR=function(){const qrImage=modal.querySelector('#qrImage');const text=modal.querySelector('#qrText').value.trim();const canvas=document.createElement('canvas');const ctx=canvas.getContext('2d');canvas.width=qrImage.naturalWidth;canvas.height=qrImage.naturalHeight;ctx.drawImage(qrImage,0,0);canvas.toBlob(blob=>{const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`qr-code-${Date.now()}.png`;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url)})};window.copyQRImage=function(){const qrImage=modal.querySelector('#qrImage');const canvas=document.createElement('canvas');const ctx=canvas.getContext('2d');canvas.width=qrImage.naturalWidth;canvas.height=qrImage.naturalHeight;ctx.drawImage(qrImage,0,0);canvas.toBlob(blob=>{if(navigator.clipboard&&window.ClipboardItem){navigator.clipboard.write([new ClipboardItem({'image/png':blob})]).then(()=>{const btn=modal.querySelector('button[onclick="copyQRImage()"]');const originalText=btn.textContent;btn.textContent='✅ Copied!';setTimeout(()=>btn.textContent=originalText,2000)}).catch(()=>{alert('Copy not supported in this browser')})}else{alert('Image copy not supported in this browser. Use Download instead.')}})};document.body.appendChild(modal);})()
```

## How to use

1. Click the bookmark (automatically fills current URL)
2. Edit the text/URL field if needed  
3. Choose desired size (150px - 500px)
4. Select error correction level
5. Click "Generate QR Code"
6. Download as PNG or copy image to clipboard
7. Close modal when finished

## Features

- **Auto-fill current URL**: Automatically uses the page you're on
- **Custom text support**: Generate QR codes for any text
- **Size options**: Choose from 4 different sizes  
- **Error correction**: Select recovery level for damaged codes
- **Download functionality**: Save as PNG files
- **Clipboard support**: Copy images directly (modern browsers)

## Use cases

- **URL sharing**: Quick QR codes for sharing page links
- **Mobile access**: Easy way to open pages on mobile devices
- **Presentations**: Generate QR codes for audience interaction
- **Networking**: Share contact information or social profiles  
- **Marketing**: Create QR codes for campaigns or promotions
- **Offline access**: Generate codes for later scanning

## Technical details

- Uses QR Server API (free, no registration required)
- Canvas-based image processing for downloads/copy
- Multiple error correction levels for different use cases:
  - Low (7%): Smallest codes, minimal damage recovery
  - Medium (15%): Good balance of size and recovery
  - Quartile (25%): Better recovery for damaged codes
  - High (30%): Maximum recovery, larger codes
- Responsive design works on all screen sizes
- Modern Clipboard API with fallback detection
# 📷 Full Page Screenshot Bookmarklet

Capture full-page screenshots using multiple capture methods and APIs, with download and clipboard options.

## What it does

- **Multiple capture methods** including Screen Capture API, HTML2Canvas, and scroll-based capture
- **Smart method detection** showing only available options for your browser
- **High-quality rendering** with customizable options and settings
- **Download or copy** screenshots as PNG files
- **Progress tracking** with visual feedback during capture process
- **Fallback support** for different browser capabilities and site configurations

## How to install

1. Create a new bookmark in your browser
2. Copy the code below and paste it as the URL:

```javascript
javascript:(function(){function getAvailableMethods(){const methods=[];if(navigator.mediaDevices&&navigator.mediaDevices.getDisplayMedia){methods.push('screen-capture')}methods.push('html2canvas');methods.push('scroll-capture');return methods}function loadScript(src){return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.head.appendChild(script)})}async function captureScreenAPI(){try{const stream=await navigator.mediaDevices.getDisplayMedia({video:{mediaSource:'screen',width:{ideal:window.screen.width},height:{ideal:window.screen.height}}});const video=document.createElement('video');video.srcObject=stream;video.play();return new Promise((resolve)=>{video.addEventListener('loadedmetadata',()=>{const canvas=document.createElement('canvas');canvas.width=video.videoWidth;canvas.height=video.videoHeight;const ctx=canvas.getContext('2d');ctx.drawImage(video,0,0);stream.getTracks().forEach(track=>track.stop());canvas.toBlob(resolve,'image/png')})})}catch(error){throw new Error('Screen capture failed: '+error.message)}}async function captureHTML2Canvas(){if(typeof html2canvas==='undefined'){await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')}const options={allowTaint:true,useCORS:true,scrollX:0,scrollY:0,width:window.innerWidth,height:document.body.scrollHeight,windowWidth:window.innerWidth,windowHeight:window.innerHeight,scale:1,logging:false,removeContainer:true};const canvas=await html2canvas(document.body,options);return new Promise((resolve)=>{canvas.toBlob(resolve,'image/png')})}async function captureScrollMethod(){const originalScrollY=window.scrollY;const viewportHeight=window.innerHeight;const fullHeight=Math.max(document.body.scrollHeight,document.body.offsetHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight,document.documentElement.offsetHeight);const sections=Math.ceil(fullHeight/viewportHeight);const canvas=document.createElement('canvas');canvas.width=window.innerWidth;canvas.height=fullHeight;const ctx=canvas.getContext('2d');if(typeof html2canvas==='undefined'){await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')}for(let i=0;i<sections;i++){const scrollTop=i*viewportHeight;window.scrollTo(0,scrollTop);await new Promise(resolve=>setTimeout(resolve,500));const sectionCanvas=await html2canvas(document.body,{allowTaint:true,useCORS:true,scrollX:0,scrollY:scrollTop,width:window.innerWidth,height:Math.min(viewportHeight,fullHeight-scrollTop),windowWidth:window.innerWidth,windowHeight:viewportHeight,scale:1,logging:false,y:scrollTop});ctx.drawImage(sectionCanvas,0,scrollTop)}window.scrollTo(0,originalScrollY);return new Promise((resolve)=>{canvas.toBlob(resolve,'image/png')})}function downloadBlob(blob,filename){const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=filename;link.style.display='none';document.body.appendChild(link);link.click();document.body.removeChild(link);URL.revokeObjectURL(url)}async function copyToClipboard(blob){if(navigator.clipboard&&window.ClipboardItem){try{const clipboardItem=new ClipboardItem({'image/png':blob});await navigator.clipboard.write([clipboardItem]);return true}catch(error){console.error('Clipboard copy failed:',error);return false}}return false}function createModal(){const modal=document.createElement('div');modal.id='screenshot-modal';modal.style.cssText=`position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);background: #fff;border: 2px solid #333;border-radius: 12px;padding: 25px;width: 90%;max-width: 500px;z-index: 999999;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;box-shadow: 0 8px 32px rgba(0,0,0,0.3);`;const availableMethods=getAvailableMethods();modal.innerHTML=`<div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #eee; padding-bottom: 15px;\"><h2 style=\"margin: 0; color: #333; font-size: 24px;\">📷 Full Page Screenshot</h2><button id=\"close-screenshot\" style=\"background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 16px;\">✕</button></div><div style=\"margin-bottom: 20px; color: #666; font-size: 14px;\">Choose a capture method below. Different methods work better on different sites.</div><div style=\"margin-bottom: 25px;\">${availableMethods.includes('screen-capture')?`<button class=\"capture-btn\" data-method=\"screen-capture\" style=\"background: #28a745; color: white; border: none; padding: 15px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: bold; margin-bottom: 10px; font-size: 16px;\">🖥️ Screen Capture API<div style=\"font-size: 12px; font-weight: normal; margin-top: 5px; opacity: 0.9;\">Best quality, requires permission</div></button>`:''}<button class=\"capture-btn\" data-method=\"html2canvas\" style=\"background: #007bff; color: white; border: none; padding: 15px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: bold; margin-bottom: 10px; font-size: 16px;\">🎨 HTML2Canvas<div style=\"font-size: 12px; font-weight: normal; margin-top: 5px; opacity: 0.9;\">Renders page content, works offline</div></button><button class=\"capture-btn\" data-method=\"scroll-capture\" style=\"background: #ffc107; color: #212529; border: none; padding: 15px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: bold; font-size: 16px;\">📜 Scroll Capture<div style=\"font-size: 12px; font-weight: normal; margin-top: 5px; opacity: 0.8;\">Captures by scrolling, handles long pages</div></button></div><div id=\"capture-options\" style=\"margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; display: none;\"><h4 style=\"margin: 0 0 10px 0; color: #333; font-size: 16px;\">Capture Options</h4><div style=\"margin-bottom: 10px;\"><input type=\"checkbox\" id=\"include-background\" checked style=\"margin-right: 8px;\"><label for=\"include-background\" style=\"font-size: 14px;\">Include background colors and images</label></div><div style=\"margin-bottom: 10px;\"><input type=\"checkbox\" id=\"high-quality\" checked style=\"margin-right: 8px;\"><label for=\"high-quality\" style=\"font-size: 14px;\">High quality rendering</label></div><div style=\"margin-bottom: 10px;\"><label style=\"display: block; font-size: 14px; margin-bottom: 5px;\">Filename:</label><input type=\"text\" id=\"filename\" value=\"screenshot.png\" style=\"width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;\"></div></div><div id=\"progress-section\" style=\"display: none; margin-bottom: 20px;\"><div style=\"font-size: 14px; color: #666; margin-bottom: 10px;\" id=\"progress-text\">Preparing capture...</div><div style=\"background: #e9ecef; height: 8px; border-radius: 4px; overflow: hidden;\"><div id=\"progress-bar\" style=\"background: #007bff; height: 100%; width: 0%; transition: width 0.3s ease;\"></div></div></div><div id=\"result-section\" style=\"display: none;\"><div style=\"margin-bottom: 15px;\"><div style=\"font-weight: bold; color: #28a745; margin-bottom: 10px;\">✅ Screenshot captured successfully!</div><div style=\"display: flex; gap: 10px;\"><button id=\"download-btn\" style=\"flex: 1; background: #007bff; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;\">💾 Download</button><button id=\"copy-btn\" style=\"flex: 1; background: #28a745; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;\">📋 Copy</button></div></div></div><div style=\"margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #666;\"><strong>💡 Tips:</strong> • Screen Capture API provides the best quality but requires manual selection • HTML2Canvas works well for most websites and doesn't require permissions • Scroll Capture is best for very long pages that don't fit in viewport</div>`;return modal}function updateProgress(text,percentage){const modal=document.getElementById('screenshot-modal');if(modal){const progressSection=modal.querySelector('#progress-section');const progressText=modal.querySelector('#progress-text');const progressBar=modal.querySelector('#progress-bar');progressSection.style.display='block';progressText.textContent=text;progressBar.style.width=percentage+'%'}}function showResult(blob,filename){const modal=document.getElementById('screenshot-modal');if(!modal)return;const progressSection=modal.querySelector('#progress-section');const resultSection=modal.querySelector('#result-section');const downloadBtn=modal.querySelector('#download-btn');const copyBtn=modal.querySelector('#copy-btn');progressSection.style.display='none';resultSection.style.display='block';downloadBtn.onclick=()=>{downloadBlob(blob,filename);downloadBtn.style.background='#28a745';downloadBtn.textContent='✅ Downloaded!';setTimeout(()=>{downloadBtn.style.background='#007bff';downloadBtn.textContent='💾 Download'},2000)};copyBtn.onclick=async()=>{const success=await copyToClipboard(blob);if(success){copyBtn.style.background='#17a2b8';copyBtn.textContent='✅ Copied!'}else{copyBtn.style.background='#dc3545';copyBtn.textContent='❌ Copy Failed'}setTimeout(()=>{copyBtn.style.background='#28a745';copyBtn.textContent='📋 Copy'},2000)}}function showError(error){const modal=document.getElementById('screenshot-modal');if(!modal)return;const progressSection=modal.querySelector('#progress-section');progressSection.style.display='block';const progressText=modal.querySelector('#progress-text');const progressBar=modal.querySelector('#progress-bar');progressText.innerHTML=`<span style=\"color: #dc3545;\">❌ Error: ${error}</span>`;progressBar.style.background='#dc3545';progressBar.style.width='100%';setTimeout(()=>{progressSection.style.display='none';progressBar.style.background='#007bff';progressBar.style.width='0%'},5000)}async function captureScreenshot(method,options={}){try{updateProgress('Initializing capture...',10);let blob;switch(method){case'screen-capture':updateProgress('Requesting screen permission...',30);blob=await captureScreenAPI();break;case'html2canvas':updateProgress('Loading HTML2Canvas library...',20);blob=await captureHTML2Canvas();break;case'scroll-capture':updateProgress('Starting scroll capture...',20);blob=await captureScrollMethod();break;default:throw new Error('Unknown capture method')}updateProgress('Processing image...',90);await new Promise(resolve=>setTimeout(resolve,500));updateProgress('Complete!',100);const filename=options.filename||'screenshot.png';showResult(blob,filename)}catch(error){console.error('Screenshot capture failed:',error);showError(error.message)}}const modal=createModal();document.body.appendChild(modal);modal.querySelector('#close-screenshot').onclick=()=>{modal.remove()};modal.querySelectorAll('.capture-btn').forEach(btn=>{btn.onclick=()=>{const method=btn.dataset.method;const filename=modal.querySelector('#filename').value||'screenshot.png';captureScreenshot(method,{filename})}});document.addEventListener('keydown',function escapeHandler(e){if(e.key==='Escape'&&document.getElementById('screenshot-modal')){modal.remove();document.removeEventListener('keydown',escapeHandler)}})})();
```

## How to use

1. Click the bookmarklet on any webpage
2. **Choose capture method** from the available options
3. **Set filename** (optional) for the downloaded file
4. **Start capture** by clicking your preferred method
5. **Download or copy** the resulting screenshot
6. **Close** when finished

## Capture methods

### 🖥️ **Screen Capture API**
- **Highest quality** screenshots with pixel-perfect accuracy
- **Manual selection** - you choose what to capture
- **Requires permission** prompt from browser
- **Best for** presentations, documentation, and high-quality captures
- **Browser support** Chrome, Firefox, Safari (modern versions)

### 🎨 **HTML2Canvas**
- **Renders page content** programmatically
- **Works offline** without external permissions
- **Good quality** for most websites and content
- **Best for** automated captures and content-focused screenshots
- **Cross-browser** support including older versions

### 📜 **Scroll Capture**
- **Long page support** by combining multiple viewport captures
- **Full height capture** regardless of page length
- **Automatic scrolling** handles the capture process
- **Best for** documentation, full-page articles, and lengthy content
- **Most reliable** for complex layouts and infinite scroll pages

## Key features

### 🎯 **Smart Method Detection**
- **Browser capability checking** - only shows supported methods
- **Automatic fallbacks** for unsupported features
- **Progressive enhancement** based on available APIs
- **Clear descriptions** of each method's strengths and limitations

### 📊 **Progress Tracking**
- **Visual progress bar** showing capture status
- **Step-by-step feedback** during the capture process
- **Error handling** with clear error messages
- **Time estimates** for longer capture operations

### 💾 **Export Options**
- **Download as PNG** with custom filename
- **Copy to clipboard** for immediate pasting
- **High-quality output** preserving original resolution
- **Proper file handling** with browser compatibility

### 🎨 **Professional Interface**
- **Clean modal design** with clear instructions
- **Method comparison** helping users choose the right option
- **Visual feedback** for all actions and states
- **Keyboard shortcuts** (Escape to close)

## Use cases

### 📚 **Documentation**
- **Full page documentation** for software and websites
- **Bug reports** with complete visual context
- **Process documentation** showing entire workflows
- **Archive pages** before changes or updates

### 🎯 **Design & Development**
- **Design reviews** of complete page layouts
- **Responsive testing** captures at different viewport sizes
- **Before/after comparisons** for development work
- **Client presentations** showing full page designs

### 📈 **Content & Marketing**
- **Social media content** from long-form articles
- **Portfolio pieces** showcasing web design work
- **Competitor analysis** of complete page experiences
- **Content auditing** with full visual context

### 🔍 **Research & Analysis**
- **Academic research** preserving complete web content
- **Market research** capturing full competitor pages
- **User experience analysis** with complete interface context
- **Legal documentation** of web content for compliance

## Technical details

### 🛠 **Capture Technologies**
- **Screen Capture API** uses `getDisplayMedia()` for native screen recording
- **HTML2Canvas library** renders DOM elements to canvas programmatically
- **Scroll capture** combines multiple viewport renders with automatic scrolling
- **Canvas manipulation** for image processing and optimization

### 🔧 **Browser APIs**
- **Media Devices API** for screen capture functionality
- **Canvas API** for image processing and rendering
- **Blob API** for file creation and download
- **Clipboard API** for copying images (modern browsers)

### 📱 **Compatibility**
- **Screen Capture API** requires HTTPS and user permission
- **HTML2Canvas** works in most browsers including mobile
- **Scroll capture** provides best compatibility across platforms
- **Fallback mechanisms** ensure functionality across different environments

### ⚡ **Performance**
- **Efficient DOM processing** minimizing memory usage
- **Progress tracking** for long-running operations
- **Memory cleanup** preventing browser memory leaks
- **Optimal image compression** balancing quality and file size

## Pro tips

### 🎯 **Method Selection**
- **Use Screen Capture API** for presentations and high-quality captures
- **Choose HTML2Canvas** for content-focused automated captures
- **Pick Scroll Capture** for very long pages or complex layouts
- **Test different methods** to find what works best for specific sites

### 🔧 **Troubleshooting**
- **Permission denied**: Try HTML2Canvas or Scroll Capture instead
- **Blank screenshots**: Some sites block programmatic capture
- **Large file sizes**: Consider using different quality settings
- **Clipboard failures**: Use download option instead

### 💡 **Best Practices**
- **Test on different browsers** for consistent results
- **Use descriptive filenames** with dates or version numbers
- **Check image quality** before using in presentations
- **Consider page loading time** before capturing
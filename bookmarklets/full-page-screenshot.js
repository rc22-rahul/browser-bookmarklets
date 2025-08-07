// Full Page Screenshot Bookmarklet
// Capture full-page screenshots using various methods and APIs

javascript:(function(){
    // Check for available screenshot methods
    function getAvailableMethods() {
        const methods = [];
        
        // Screen Capture API (modern browsers)
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            methods.push('screen-capture');
        }
        
        // HTML2Canvas fallback
        methods.push('html2canvas');
        
        // Manual scroll capture
        methods.push('scroll-capture');
        
        return methods;
    }
    
    // Load external library
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Screen Capture API method
    async function captureScreenAPI() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    mediaSource: 'screen',
                    width: { ideal: window.screen.width },
                    height: { ideal: window.screen.height }
                }
            });
            
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            
            return new Promise((resolve) => {
                video.addEventListener('loadedmetadata', () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0);
                    
                    // Stop the stream
                    stream.getTracks().forEach(track => track.stop());
                    
                    canvas.toBlob(resolve, 'image/png');
                });
            });
        } catch (error) {
            throw new Error('Screen capture failed: ' + error.message);
        }
    }
    
    // HTML2Canvas method
    async function captureHTML2Canvas() {
        // Load html2canvas if not already loaded
        if (typeof html2canvas === 'undefined') {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
        }
        
        const options = {
            allowTaint: true,
            useCORS: true,
            scrollX: 0,
            scrollY: 0,
            width: window.innerWidth,
            height: document.body.scrollHeight,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            scale: 1,
            logging: false,
            removeContainer: true
        };
        
        const canvas = await html2canvas(document.body, options);
        
        return new Promise((resolve) => {
            canvas.toBlob(resolve, 'image/png');
        });
    }
    
    // Manual scroll capture method
    async function captureScrollMethod() {
        const originalScrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const fullHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        
        const sections = Math.ceil(fullHeight / viewportHeight);
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = fullHeight;
        const ctx = canvas.getContext('2d');
        
        // Load html2canvas for individual sections
        if (typeof html2canvas === 'undefined') {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
        }
        
        for (let i = 0; i < sections; i++) {
            const scrollTop = i * viewportHeight;
            window.scrollTo(0, scrollTop);
            
            // Wait for scroll to complete
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const sectionCanvas = await html2canvas(document.body, {
                allowTaint: true,
                useCORS: true,
                scrollX: 0,
                scrollY: scrollTop,
                width: window.innerWidth,
                height: Math.min(viewportHeight, fullHeight - scrollTop),
                windowWidth: window.innerWidth,
                windowHeight: viewportHeight,
                scale: 1,
                logging: false,
                y: scrollTop
            });
            
            ctx.drawImage(sectionCanvas, 0, scrollTop);
        }
        
        // Restore original scroll position
        window.scrollTo(0, originalScrollY);
        
        return new Promise((resolve) => {
            canvas.toBlob(resolve, 'image/png');
        });
    }
    
    // Download blob as file
    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    // Copy image to clipboard
    async function copyToClipboard(blob) {
        if (navigator.clipboard && window.ClipboardItem) {
            try {
                const clipboardItem = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([clipboardItem]);
                return true;
            } catch (error) {
                console.error('Clipboard copy failed:', error);
                return false;
            }
        }
        return false;
    }
    
    // Create modal interface
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'screenshot-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            border: 2px solid #333;
            border-radius: 12px;
            padding: 25px;
            width: 90%;
            max-width: 500px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        `;
        
        const availableMethods = getAvailableMethods();
        
        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #eee; padding-bottom: 15px;">
                <h2 style="margin: 0; color: #333; font-size: 24px;">📷 Full Page Screenshot</h2>
                <button id="close-screenshot" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 16px;">✕</button>
            </div>
            
            <div style="margin-bottom: 20px; color: #666; font-size: 14px;">
                Choose a capture method below. Different methods work better on different sites.
            </div>
            
            <div style="margin-bottom: 25px;">
                ${availableMethods.includes('screen-capture') ? `
                    <button class="capture-btn" data-method="screen-capture" style="background: #28a745; color: white; border: none; padding: 15px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: bold; margin-bottom: 10px; font-size: 16px;">
                        🖥️ Screen Capture API
                        <div style="font-size: 12px; font-weight: normal; margin-top: 5px; opacity: 0.9;">Best quality, requires permission</div>
                    </button>
                ` : ''}
                
                <button class="capture-btn" data-method="html2canvas" style="background: #007bff; color: white; border: none; padding: 15px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: bold; margin-bottom: 10px; font-size: 16px;">
                    🎨 HTML2Canvas
                    <div style="font-size: 12px; font-weight: normal; margin-top: 5px; opacity: 0.9;">Renders page content, works offline</div>
                </button>
                
                <button class="capture-btn" data-method="scroll-capture" style="background: #ffc107; color: #212529; border: none; padding: 15px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: bold; font-size: 16px;">
                    📜 Scroll Capture
                    <div style="font-size: 12px; font-weight: normal; margin-top: 5px; opacity: 0.8;">Captures by scrolling, handles long pages</div>
                </button>
            </div>
            
            <div id="capture-options" style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; display: none;">
                <h4 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">Capture Options</h4>
                <div style="margin-bottom: 10px;">
                    <input type="checkbox" id="include-background" checked style="margin-right: 8px;">
                    <label for="include-background" style="font-size: 14px;">Include background colors and images</label>
                </div>
                <div style="margin-bottom: 10px;">
                    <input type="checkbox" id="high-quality" checked style="margin-right: 8px;">
                    <label for="high-quality" style="font-size: 14px;">High quality rendering</label>
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: block; font-size: 14px; margin-bottom: 5px;">Filename:</label>
                    <input type="text" id="filename" value="screenshot.png" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                </div>
            </div>
            
            <div id="progress-section" style="display: none; margin-bottom: 20px;">
                <div style="font-size: 14px; color: #666; margin-bottom: 10px;" id="progress-text">Preparing capture...</div>
                <div style="background: #e9ecef; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div id="progress-bar" style="background: #007bff; height: 100%; width: 0%; transition: width 0.3s ease;"></div>
                </div>
            </div>
            
            <div id="result-section" style="display: none;">
                <div style="margin-bottom: 15px;">
                    <div style="font-weight: bold; color: #28a745; margin-bottom: 10px;">✅ Screenshot captured successfully!</div>
                    <div style="display: flex; gap: 10px;">
                        <button id="download-btn" style="flex: 1; background: #007bff; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                            💾 Download
                        </button>
                        <button id="copy-btn" style="flex: 1; background: #28a745; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                            📋 Copy
                        </button>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
                <strong>💡 Tips:</strong> 
                • Screen Capture API provides the best quality but requires manual selection
                • HTML2Canvas works well for most websites and doesn't require permissions
                • Scroll Capture is best for very long pages that don't fit in viewport
            </div>
        `;
        
        return modal;
    }
    
    // Show progress
    function updateProgress(text, percentage) {
        const modal = document.getElementById('screenshot-modal');
        if (modal) {
            const progressSection = modal.querySelector('#progress-section');
            const progressText = modal.querySelector('#progress-text');
            const progressBar = modal.querySelector('#progress-bar');
            
            progressSection.style.display = 'block';
            progressText.textContent = text;
            progressBar.style.width = percentage + '%';
        }
    }
    
    // Show result
    function showResult(blob, filename) {
        const modal = document.getElementById('screenshot-modal');
        if (!modal) return;
        
        const progressSection = modal.querySelector('#progress-section');
        const resultSection = modal.querySelector('#result-section');
        const downloadBtn = modal.querySelector('#download-btn');
        const copyBtn = modal.querySelector('#copy-btn');
        
        progressSection.style.display = 'none';
        resultSection.style.display = 'block';
        
        downloadBtn.onclick = () => {
            downloadBlob(blob, filename);
            downloadBtn.style.background = '#28a745';
            downloadBtn.textContent = '✅ Downloaded!';
            setTimeout(() => {
                downloadBtn.style.background = '#007bff';
                downloadBtn.textContent = '💾 Download';
            }, 2000);
        };
        
        copyBtn.onclick = async () => {
            const success = await copyToClipboard(blob);
            if (success) {
                copyBtn.style.background = '#17a2b8';
                copyBtn.textContent = '✅ Copied!';
            } else {
                copyBtn.style.background = '#dc3545';
                copyBtn.textContent = '❌ Copy Failed';
            }
            setTimeout(() => {
                copyBtn.style.background = '#28a745';
                copyBtn.textContent = '📋 Copy';
            }, 2000);
        };
    }
    
    // Show error
    function showError(error) {
        const modal = document.getElementById('screenshot-modal');
        if (!modal) return;
        
        const progressSection = modal.querySelector('#progress-section');
        progressSection.style.display = 'block';
        
        const progressText = modal.querySelector('#progress-text');
        const progressBar = modal.querySelector('#progress-bar');
        
        progressText.innerHTML = `<span style="color: #dc3545;">❌ Error: ${error}</span>`;
        progressBar.style.background = '#dc3545';
        progressBar.style.width = '100%';
        
        setTimeout(() => {
            progressSection.style.display = 'none';
            progressBar.style.background = '#007bff';
            progressBar.style.width = '0%';
        }, 5000);
    }
    
    // Capture screenshot
    async function captureScreenshot(method, options = {}) {
        try {
            updateProgress('Initializing capture...', 10);
            let blob;
            
            switch (method) {
                case 'screen-capture':
                    updateProgress('Requesting screen permission...', 30);
                    blob = await captureScreenAPI();
                    break;
                    
                case 'html2canvas':
                    updateProgress('Loading HTML2Canvas library...', 20);
                    blob = await captureHTML2Canvas();
                    break;
                    
                case 'scroll-capture':
                    updateProgress('Starting scroll capture...', 20);
                    blob = await captureScrollMethod();
                    break;
                    
                default:
                    throw new Error('Unknown capture method');
            }
            
            updateProgress('Processing image...', 90);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            updateProgress('Complete!', 100);
            const filename = options.filename || 'screenshot.png';
            showResult(blob, filename);
            
        } catch (error) {
            console.error('Screenshot capture failed:', error);
            showError(error.message);
        }
    }
    
    // Initialize
    const modal = createModal();
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('#close-screenshot').onclick = () => {
        modal.remove();
    };
    
    modal.querySelectorAll('.capture-btn').forEach(btn => {
        btn.onclick = () => {
            const method = btn.dataset.method;
            const filename = modal.querySelector('#filename').value || 'screenshot.png';
            captureScreenshot(method, { filename });
        };
    });
    
    // ESC to close
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape' && document.getElementById('screenshot-modal')) {
            modal.remove();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
})();
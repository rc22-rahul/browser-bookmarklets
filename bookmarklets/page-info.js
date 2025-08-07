// Page Info Bookmarklet
// Displays comprehensive page metadata, performance metrics, and technical details

javascript:(function(){
    const info = document.createElement('div');
    info.style.cssText = 'position:fixed;top:10px;right:10px;background:#000;color:#fff;padding:15px;border-radius:8px;font-family:monospace;font-size:12px;z-index:999999;max-width:350px;box-shadow:0 4px 20px rgba(0,0,0,0.5);line-height:1.4';
    
    const loadTime = performance.timing ? 
        (performance.timing.loadEventEnd - performance.timing.navigationStart) : 
        performance.now();
        
    info.innerHTML = `
        <div style="border-bottom:1px solid #333;margin-bottom:10px;padding-bottom:10px">
            <strong>📊 Page Information</strong>
        </div>
        <div><strong>Title:</strong> ${document.title}</div>
        <div><strong>URL:</strong> ${location.href}</div>
        <div><strong>Domain:</strong> ${location.hostname}</div>
        <div><strong>Protocol:</strong> ${location.protocol}</div>
        <div><strong>Charset:</strong> ${document.characterSet}</div>
        <div><strong>Lang:</strong> ${document.documentElement.lang || 'Not set'}</div>
        <div style="margin-top:10px">
            <strong>Elements:</strong><br>
            • Links: ${document.links.length}<br>
            • Images: ${document.images.length}<br>
            • Scripts: ${document.scripts.length}<br>
            • Stylesheets: ${document.styleSheets.length}<br>
            • Forms: ${document.forms.length}
        </div>
        <div style="margin-top:10px">
            <strong>Performance:</strong><br>
            • Load Time: ${Math.round(loadTime)}ms<br>
            • DOM Elements: ${document.querySelectorAll('*').length}
        </div>
        <button onclick="this.parentElement.remove()" 
                style="background:#fff;color:#000;border:none;padding:8px 12px;border-radius:3px;cursor:pointer;margin-top:15px;width:100%">
            Close
        </button>
    `;
    
    document.body.appendChild(info);
})();
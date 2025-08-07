# 📊 Page Info Bookmarklet

Display comprehensive page metadata, performance metrics, and technical details for any webpage.

## What it does

- Shows page title, URL, domain, and protocol
- Displays character encoding and language settings  
- Counts page elements (links, images, scripts, stylesheets, forms)
- Shows performance metrics (load time, DOM elements)
- Presents information in a clean, floating overlay

## How to install

1. Create a new bookmark in your browser
2. Copy the code below and paste it as the URL:

```javascript
javascript:(function(){const info=document.createElement('div');info.style.cssText='position:fixed;top:10px;right:10px;background:#000;color:#fff;padding:15px;border-radius:8px;font-family:monospace;font-size:12px;z-index:999999;max-width:350px;box-shadow:0 4px 20px rgba(0,0,0,0.5);line-height:1.4';const loadTime=performance.timing?(performance.timing.loadEventEnd-performance.timing.navigationStart):performance.now();info.innerHTML=`<div style="border-bottom:1px solid #333;margin-bottom:10px;padding-bottom:10px"><strong>📊 Page Information</strong></div><div><strong>Title:</strong> ${document.title}</div><div><strong>URL:</strong> ${location.href}</div><div><strong>Domain:</strong> ${location.hostname}</div><div><strong>Protocol:</strong> ${location.protocol}</div><div><strong>Charset:</strong> ${document.characterSet}</div><div><strong>Lang:</strong> ${document.documentElement.lang||'Not set'}</div><div style="margin-top:10px"><strong>Elements:</strong><br>• Links: ${document.links.length}<br>• Images: ${document.images.length}<br>• Scripts: ${document.scripts.length}<br>• Stylesheets: ${document.styleSheets.length}<br>• Forms: ${document.forms.length}</div><div style="margin-top:10px"><strong>Performance:</strong><br>• Load Time: ${Math.round(loadTime)}ms<br>• DOM Elements: ${document.querySelectorAll('*').length}</div><button onclick="this.parentElement.remove()" style="background:#fff;color:#000;border:none;padding:8px 12px;border-radius:3px;cursor:pointer;margin-top:15px;width:100%">Close</button>`;document.body.appendChild(info);})()
```

## How to use

1. Click the bookmark while on any webpage
2. A dark overlay will appear in the top-right corner showing page information
3. Click "Close" button to dismiss the overlay

## Use cases

- **Web Development**: Quick access to page metadata during development
- **SEO Analysis**: Check page language, encoding, and element counts
- **Performance Monitoring**: Get basic load time information
- **Research**: Gather technical details about websites
- **Debugging**: Quickly identify page characteristics

## Technical details

- Works on all websites
- No external dependencies
- Lightweight and fast
- Non-intrusive overlay design
- Automatically calculates performance metrics
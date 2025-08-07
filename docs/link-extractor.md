# 🔗 Link Extractor Bookmarklet

Extract and analyze all links from any webpage with filtering and export options.

## What it does

- Extracts all links from the current page
- Categorizes links as internal or external
- Provides filtering options (all, internal, external)
- Shows link text and full URLs
- Offers one-click copy functionality for all URLs
- Displays link count and domain information

## How to install

1. Create a new bookmark in your browser
2. Copy the code below and paste it as the URL:

```javascript
javascript:(function(){const links=Array.from(document.links).map(link=>({text:link.textContent.trim()||'[No text]',url:link.href,domain:new URL(link.href).hostname}));const modal=document.createElement('div');modal.style.cssText=`position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);background: #fff;border: 2px solid #333;border-radius: 10px;padding: 20px;max-height: 70vh;width: 80%;max-width: 600px;overflow: hidden;z-index: 999999;font-family: Arial, sans-serif;box-shadow: 0 4px 20px rgba(0,0,0,0.3);`;const internalLinks=links.filter(link=>link.domain===location.hostname);const externalLinks=links.filter(link=>link.domain!==location.hostname);modal.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;border-bottom:1px solid #eee;padding-bottom:10px"><h3 style="margin:0">🔗 Page Links (${links.length} total)</h3><button onclick="this.closest('div').remove()" style="background:#dc3545;color:#fff;border:none;padding:5px 10px;border-radius:3px;cursor:pointer">✕</button></div><div style="margin-bottom:15px"><button onclick="showLinks('all')" style="background:#007bff;color:#fff;border:none;padding:8px 12px;border-radius:3px;cursor:pointer;margin-right:5px">All (${links.length})</button><button onclick="showLinks('internal')" style="background:#28a745;color:#fff;border:none;padding:8px 12px;border-radius:3px;cursor:pointer;margin-right:5px">Internal (${internalLinks.length})</button><button onclick="showLinks('external')" style="background:#fd7e14;color:#fff;border:none;padding:8px 12px;border-radius:3px;cursor:pointer">External (${externalLinks.length})</button></div><div id="linksContainer" style="max-height:400px;overflow-y:auto">${links.map(link=>`<div class="link-item" data-type="${link.domain===location.hostname?'internal':'external'}" style="margin:5px 0;padding:8px;border:1px solid #eee;border-radius:3px;background:#f8f9fa"><a href="${link.url}" target="_blank" style="color:#007bff;text-decoration:none;font-weight:bold">${link.text}</a><br><small style="color:#666;word-break:break-all">${link.url}</small><div style="margin-top:3px"><span style="background:${link.domain===location.hostname?'#d4edda':'#fff3cd'};color:${link.domain===location.hostname?'#155724':'#856404'};padding:2px 6px;border-radius:10px;font-size:10px">${link.domain===location.hostname?'INTERNAL':'EXTERNAL'}</span></div></div>`).join('')}</div><div style="margin-top:15px;text-align:center"><button onclick="copyAllLinks()" style="background:#6c757d;color:#fff;border:none;padding:8px 12px;border-radius:3px;cursor:pointer;margin-right:5px">📋 Copy All URLs</button></div>`;window.showLinks=function(type){const items=modal.querySelectorAll('.link-item');items.forEach(item=>{if(type==='all'||item.dataset.type===type){item.style.display='block'}else{item.style.display='none'}})};window.copyAllLinks=function(){const visibleLinks=Array.from(modal.querySelectorAll('.link-item:not([style*="display: none"])')) .map(item=>item.querySelector('a').href);navigator.clipboard.writeText(visibleLinks.join('\\n')).then(()=>{const btn=modal.querySelector('button:last-child');const originalText=btn.textContent;btn.textContent='✅ Copied!';setTimeout(()=>btn.textContent=originalText,2000)})};document.body.appendChild(modal);})()
```

## How to use

1. Click the bookmark on any webpage
2. A modal window will appear with all page links
3. Use filter buttons to show All, Internal, or External links
4. Click "Copy All URLs" to copy visible links to clipboard
5. Click individual links to open them in new tabs
6. Click ✕ to close the modal

## Features

- **Smart categorization**: Automatically separates internal and external links
- **Visual indicators**: Color-coded badges for link types
- **Export functionality**: Copy filtered URLs to clipboard
- **Link preview**: Shows both link text and full URL
- **Responsive design**: Scrollable interface for pages with many links

## Use cases

- **SEO analysis**: Audit internal and external links
- **Content research**: Extract all links for further analysis
- **Link building**: Find external domains linked by competitors
- **Site mapping**: Understand internal link structure
- **Quality assurance**: Check for broken or suspicious links

## Technical details

- Processes all `<a>` elements with `href` attributes
- Handles empty link text with fallback display
- Domain comparison for internal/external categorization
- Responsive modal design with overflow handling
- Clipboard API integration with fallback
- Real-time filtering without page reloads
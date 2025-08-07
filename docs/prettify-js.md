# 🎨 Prettify JS Bookmarklet

Beautifies and syntax-highlights JavaScript files with line numbers in your browser.

## What it does

- Fetches raw JavaScript files from the current URL
- Beautifies/formats the code with proper indentation
- Applies syntax highlighting using Prism.js
- Adds line numbers for easy reference
- Uses a dark theme optimized for code reading

## How to install

1. Create a new bookmark in your browser
2. Copy the code below and paste it as the URL:

```javascript
javascript:(async function(){const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/js-beautify@1.14.0/js/lib/beautify.js",document.head.appendChild(s),await new Promise(r=>s.onload=r);const c=document.createElement("link");c.rel="stylesheet",c.href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css",document.head.appendChild(c);const j=document.createElement("script");j.src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js",document.head.appendChild(j),await new Promise(r=>j.onload=r);const l=document.createElement("script");l.src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js",document.head.appendChild(l);const lc=document.createElement("link");lc.rel="stylesheet",lc.href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css",document.head.appendChild(lc),await new Promise(r=>l.onload=r);const res=await fetch(window.location.href),type=(res.headers.get("Content-Type")||"").toLowerCase();if(!type.includes("javascript")){alert("This file is not a JavaScript file.");return}const raw=await res.text(),pretty=js_beautify(raw,{indent_size:2}),escaped=pretty.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");document.body.innerHTML=`<style>body{margin:0;padding:0;background:#2d2d2d;color:#ccc;font-family:monospace}pre{font-size:12px;line-height:1.4;padding:10px 20px;margin:0;white-space:pre-wrap;overflow-x:auto;height:100vh;box-sizing:border-box}code{font-size:inherit}</style><pre class="line-numbers"><code class="language-js">${escaped}</code></pre>`,Prism.highlightAll()})()
```

## How to use

1. Navigate to any raw JavaScript file URL (e.g., GitHub raw files, CDN files)
2. Click the bookmark
3. Wait for libraries to load and processing to complete
4. The page will be replaced with beautifully formatted, syntax-highlighted code

## Requirements

- Must be used on pages serving JavaScript files
- Requires internet connection (loads external libraries)
- Modern browser with async/await support

## Use cases

- **Reading minified JavaScript**: Make compressed code readable
- **Code analysis**: Study third-party JavaScript libraries  
- **Development**: Quick formatting of raw JS files
- **Learning**: Better understand code structure with syntax highlighting
- **Debugging**: Examine external scripts with proper formatting

## Libraries used

- **js-beautify**: Code formatting and indentation
- **Prism.js**: Syntax highlighting with Tomorrow Night theme
- **Prism Line Numbers**: Line number display plugin

## Technical details

- Validates content type before processing
- Uses 2-space indentation for formatting
- Full viewport code display
- Responsive design
- Dark theme optimized for readability
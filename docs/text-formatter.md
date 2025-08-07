# ✏️ Text Formatter Bookmarklet

Transform, format, and manipulate selected text or clipboard content with multiple formatting options.

## What it does

- Works with selected text or manual input
- Multiple text transformations (case changes, formatting)
- Special encodings (URL, Base64, HTML)
- Real-time character, word, line, and sentence counting
- One-click copy functionality for results
- Supports camelCase, snake_case, kebab-case conversions

## How to install

1. Create a new bookmark in your browser
2. Copy the code below and paste it as the URL:

```javascript
javascript:(function(){const selectedText=window.getSelection().toString().trim();const modal=document.createElement('div');modal.style.cssText=`position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);background: #fff;border: 2px solid #333;border-radius: 10px;padding: 25px;z-index: 999999;font-family: Arial, sans-serif;box-shadow: 0 4px 20px rgba(0,0,0,0.3);width: 90%;max-width: 600px;max-height: 80vh;overflow-y: auto;`;modal.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid #eee;padding-bottom:15px"><h3 style="margin:0">✏️ Text Formatter</h3><button onclick="this.closest('div').remove()" style="background:#dc3545;color:#fff;border:none;padding:5px 10px;border-radius:3px;cursor:pointer">✕</button></div><div style="margin-bottom:15px"><label style="display:block;margin-bottom:5px;font-weight:bold">Input Text:</label><textarea id="inputText" rows="6" placeholder="Paste or type text here..." style="width:100%;padding:8px;border:1px solid #ddd;border-radius:3px;resize:vertical;font-family:monospace;font-size:14px">${selectedText}</textarea></div><div style="margin-bottom:15px"><label style="display:block;margin-bottom:10px;font-weight:bold">Text Transformations:</label><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px"><button onclick="transform('uppercase')" style="background:#007bff;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">UPPERCASE</button><button onclick="transform('lowercase')" style="background:#007bff;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">lowercase</button><button onclick="transform('capitalize')" style="background:#007bff;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">Capitalize Words</button><button onclick="transform('sentence')" style="background:#007bff;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">Sentence case</button><button onclick="transform('camelcase')" style="background:#28a745;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">camelCase</button><button onclick="transform('pascalcase')" style="background:#28a745;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">PascalCase</button><button onclick="transform('snakecase')" style="background:#28a745;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">snake_case</button><button onclick="transform('kebabcase')" style="background:#28a745;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">kebab-case</button><button onclick="transform('reverse')" style="background:#6c757d;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">esreveR</button><button onclick="transform('removeSpaces')" style="background:#fd7e14;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">Remove Spaces</button><button onclick="transform('removeLines')" style="background:#fd7e14;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">Remove Line Breaks</button><button onclick="transform('trim')" style="background:#fd7e14;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">Trim Whitespace</button></div></div><div style="margin-bottom:15px"><label style="display:block;margin-bottom:10px;font-weight:bold">Special Formats:</label><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px"><button onclick="transform('urlEncode')" style="background:#e83e8c;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">URL Encode</button><button onclick="transform('urlDecode')" style="background:#e83e8c;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">URL Decode</button><button onclick="transform('base64Encode')" style="background:#20c997;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">Base64 Encode</button><button onclick="transform('base64Decode')" style="background:#20c997;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">Base64 Decode</button><button onclick="transform('htmlEncode')" style="background:#6f42c1;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">HTML Encode</button><button onclick="transform('htmlDecode')" style="background:#6f42c1;color:#fff;border:none;padding:8px;border-radius:3px;cursor:pointer;font-size:12px">HTML Decode</button></div></div><div style="margin-bottom:15px"><label style="display:block;margin-bottom:5px;font-weight:bold">Output:</label><textarea id="outputText" rows="6" readonly style="width:100%;padding:8px;border:1px solid #ddd;border-radius:3px;background:#f8f9fa;font-family:monospace;font-size:14px"></textarea></div><div style="display:flex;gap:10px;justify-content:center"><button onclick="copyOutput()" style="background:#28a745;color:#fff;border:none;padding:10px 20px;border-radius:5px;cursor:pointer">📋 Copy Output</button><button onclick="clearText()" style="background:#6c757d;color:#fff;border:none;padding:10px 20px;border-radius:5px;cursor:pointer">🗑️ Clear</button></div><div id="stats" style="background:#f8f9fa;padding:10px;border-radius:5px;margin-top:15px;font-size:12px;color:#666;text-align:center"></div>`;const inputText=modal.querySelector('#inputText');const outputText=modal.querySelector('#outputText');const stats=modal.querySelector('#stats');function updateStats(text){const chars=text.length;const words=text.trim()?text.trim().split(/\\s+/).length:0;const lines=text.split('\\n').length;const sentences=text.trim()?text.split(/[.!?]+/).filter(s=>s.trim()).length:0;stats.innerHTML=`📊 <strong>Stats:</strong> ${chars} characters, ${words} words, ${lines} lines, ${sentences} sentences`}window.transform=function(type){const text=inputText.value;let result=text;try{switch(type){case 'uppercase':result=text.toUpperCase();break;case 'lowercase':result=text.toLowerCase();break;case 'capitalize':result=text.replace(/\\b\\w/g,l=>l.toUpperCase());break;case 'sentence':result=text.toLowerCase().replace(/(^|[.!?]\\s*)\\w/g,l=>l.toUpperCase());break;case 'camelcase':result=text.replace(/(?:^\\w|[A-Z]|\\b\\w)/g,(word,index)=>index===0?word.toLowerCase():word.toUpperCase()).replace(/\\s+/g,'');break;case 'pascalcase':result=text.replace(/(?:^\\w|[A-Z]|\\b\\w)/g,word=>word.toUpperCase()).replace(/\\s+/g,'');break;case 'snakecase':result=text.replace(/\\W+/g,' ').split(/ |\\B(?=[A-Z])/).join('_').toLowerCase();break;case 'kebabcase':result=text.replace(/\\W+/g,' ').split(/ |\\B(?=[A-Z])/).join('-').toLowerCase();break;case 'reverse':result=text.split('').reverse().join('');break;case 'removeSpaces':result=text.replace(/\\s/g,'');break;case 'removeLines':result=text.replace(/\\n/g,' ').replace(/\\s+/g,' ');break;case 'trim':result=text.trim().replace(/\\s+/g,' ');break;case 'urlEncode':result=encodeURIComponent(text);break;case 'urlDecode':result=decodeURIComponent(text);break;case 'base64Encode':result=btoa(unescape(encodeURIComponent(text)));break;case 'base64Decode':result=decodeURIComponent(escape(atob(text)));break;case 'htmlEncode':result=text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');break;case 'htmlDecode':result=text.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");break}}catch(e){result='Error: Invalid input for this transformation'}outputText.value=result;updateStats(result)};window.copyOutput=function(){outputText.select();document.execCommand('copy')||navigator.clipboard.writeText(outputText.value);const btn=modal.querySelector('button[onclick="copyOutput()"]');const originalText=btn.textContent;btn.textContent='✅ Copied!';setTimeout(()=>btn.textContent=originalText,2000)};window.clearText=function(){inputText.value='';outputText.value='';stats.innerHTML=''};inputText.oninput=()=>updateStats(inputText.value);updateStats(selectedText);document.body.appendChild(modal);})()
```

## How to use

1. Select text on any webpage (optional) and click the bookmark
2. Edit or paste text in the input area
3. Click any transformation button to apply formatting
4. View real-time statistics below the output
5. Copy the result or clear to start over
6. Close modal when finished

## Features

- **Text case transformations**: Upper, lower, capitalize, sentence case
- **Programming formats**: camelCase, PascalCase, snake_case, kebab-case  
- **Text manipulation**: Reverse, remove spaces/lines, trim whitespace
- **Encoding/decoding**: URL, Base64, HTML entity encoding
- **Real-time statistics**: Character, word, line, and sentence counts
- **Auto-fill selected text**: Works with highlighted text from any page

## Use cases

- **Content editing**: Format text for different contexts
- **Programming**: Convert between naming conventions  
- **Data processing**: Clean and transform text data
- **URL handling**: Encode/decode URLs and parameters
- **HTML work**: Escape/unescape HTML entities
- **Social media**: Transform text for different platforms

## Technical details

- Automatically detects selected text on page load
- Real-time character counting and statistics
- Error handling for invalid transformations  
- Responsive grid layout for transformation buttons
- Monospace font for better code/data viewing
- Fallback clipboard support for older browsers
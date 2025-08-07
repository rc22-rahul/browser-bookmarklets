// Prettify JS Bookmarklet
// Fetches and beautifies JavaScript files with syntax highlighting

// Minified version (copy this for bookmark):
// javascript:(async function(){const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/js-beautify@1.14.0/js/lib/beautify.js",document.head.appendChild(s),await new Promise(r=>s.onload=r);const c=document.createElement("link");c.rel="stylesheet",c.href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css",document.head.appendChild(c);const j=document.createElement("script");j.src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js",document.head.appendChild(j),await new Promise(r=>j.onload=r);const l=document.createElement("script");l.src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js",document.head.appendChild(l);const lc=document.createElement("link");lc.rel="stylesheet",lc.href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css",document.head.appendChild(lc),await new Promise(r=>l.onload=r);const res=await fetch(window.location.href),type=(res.headers.get("Content-Type")||"").toLowerCase();if(!type.includes("javascript")){alert("This file is not a JavaScript file.");return}const raw=await res.text(),pretty=js_beautify(raw,{indent_size:2}),escaped=pretty.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");document.body.innerHTML=`<style>body{margin:0;padding:0;background:#2d2d2d;color:#ccc;font-family:monospace}pre{font-size:12px;line-height:1.4;padding:10px 20px;margin:0;white-space:pre-wrap;overflow-x:auto;height:100vh;box-sizing:border-box}code{font-size:inherit}</style><pre class="line-numbers"><code class="language-js">${escaped}</code></pre>`,Prism.highlightAll()})();

// Readable version:
javascript:(async function() {
    // Load js-beautify library
    const beautifyScript = document.createElement("script");
    beautifyScript.src = "https://cdn.jsdelivr.net/npm/js-beautify@1.14.0/js/lib/beautify.js";
    document.head.appendChild(beautifyScript);
    await new Promise(resolve => beautifyScript.onload = resolve);

    // Load Prism CSS
    const prismCSS = document.createElement("link");
    prismCSS.rel = "stylesheet";
    prismCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css";
    document.head.appendChild(prismCSS);

    // Load Prism JS
    const prismJS = document.createElement("script");
    prismJS.src = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
    document.head.appendChild(prismJS);
    await new Promise(resolve => prismJS.onload = resolve);

    // Load Prism line numbers plugin
    const lineNumbersJS = document.createElement("script");
    lineNumbersJS.src = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js";
    document.head.appendChild(lineNumbersJS);

    const lineNumbersCSS = document.createElement("link");
    lineNumbersCSS.rel = "stylesheet";
    lineNumbersCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css";
    document.head.appendChild(lineNumbersCSS);
    await new Promise(resolve => lineNumbersJS.onload = resolve);

    // Fetch current page content
    const response = await fetch(window.location.href);
    const contentType = (response.headers.get("Content-Type") || "").toLowerCase();

    // Check if it's a JavaScript file
    if (!contentType.includes("javascript")) {
        alert("This file is not a JavaScript file.");
        return;
    }

    // Get and beautify the JavaScript
    const rawJS = await response.text();
    const beautifiedJS = js_beautify(rawJS, {
        indent_size: 2
    });

    // Escape HTML entities
    const escapedJS = beautifiedJS
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Replace page content with prettified code
    document.body.innerHTML = `
        <style>
            body {
                margin: 0;
                padding: 0;
                background: #2d2d2d;
                color: #ccc;
                font-family: monospace;
            }
            pre {
                font-size: 12px;
                line-height: 1.4;
                padding: 10px 20px;
                margin: 0;
                white-space: pre-wrap;
                overflow-x: auto;
                height: 100vh;
                box-sizing: border-box;
            }
            code {
                font-size: inherit;
            }
        </style>
        <pre class="line-numbers"><code class="language-js">${escapedJS}</code></pre>
    `;

    // Apply syntax highlighting
    Prism.highlightAll();
})();
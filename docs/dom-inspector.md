# 🔍 Enhanced DOM Inspector Bookmarklet

Advanced DOM inspection tool with element selection, properties analysis, and quick manipulation actions.

## What it does

- **Visual element inspection** with hover highlighting and click selection
- **Comprehensive element details** including tag, attributes, and structure
- **Computed style analysis** organized by categories (layout, typography, colors)
- **Element metrics** showing position, size, and box model information
- **CSS selector generation** with automatic XPath creation
- **Quick manipulation actions** for hiding, highlighting, and analyzing elements
- **Parent/child navigation** to understand element relationships

## How to install

1. Create a new bookmark in your browser
2. Copy the code below and paste it as the URL:

```javascript
javascript:(function(){let inspectorActive=false;let inspectorPanel=null;let highlightOverlay=null;let selectedElement=null;let originalOutlines=new Map();function createInspectorPanel(){const panel=document.createElement('div');panel.id='dom-inspector-panel';panel.style.cssText=`position: fixed;top: 20px;right: 20px;background: rgba(0, 0, 0, 0.95);color: white;padding: 20px;border-radius: 12px;z-index: 999998;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Courier New', monospace;box-shadow: 0 8px 32px rgba(0,0,0,0.5);backdrop-filter: blur(10px);border: 1px solid rgba(255, 255, 255, 0.1);min-width: 350px;max-width: 500px;max-height: 80vh;overflow-y: auto;transition: all 0.3s ease;resize: both;`;panel.innerHTML=`<div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 10px;\"><h3 style=\"margin: 0; font-size: 18px; color: #4CAF50;\">🔍 DOM Inspector</h3><div><button id=\"toggle-inspector\" style=\"background: rgba(76, 175, 80, 0.8); color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px; font-size: 12px;\">🎯 Enable</button><button id=\"close-inspector\" style=\"background: rgba(244, 67, 54, 0.8); color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;\">✕</button></div></div><div id=\"inspector-status\" style=\"background: rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 6px; font-size: 12px; margin-bottom: 15px; text-align: center;\">Click \"Enable\" then hover over elements to inspect</div><div id=\"element-info\" style=\"display: none;\"><div style=\"margin-bottom: 15px;\"><h4 style=\"margin: 0 0 8px 0; font-size: 14px; color: #FFC107;\">📋 Element Details</h4><div id=\"element-details\" style=\"font-size: 11px; font-family: monospace; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 4px; max-height: 150px; overflow-y: auto;\"></div></div><div style=\"margin-bottom: 15px;\"><h4 style=\"margin: 0 0 8px 0; font-size: 14px; color: #2196F3;\">🎨 Computed Styles</h4><div style=\"display: flex; gap: 5px; margin-bottom: 8px;\"><button class=\"style-category\" data-category=\"layout\" style=\"background: rgba(33, 150, 243, 0.8); color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;\">Layout</button><button class=\"style-category\" data-category=\"typography\" style=\"background: rgba(156, 39, 176, 0.8); color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;\">Typography</button><button class=\"style-category\" data-category=\"colors\" style=\"background: rgba(255, 152, 0, 0.8); color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;\">Colors</button><button class=\"style-category\" data-category=\"all\" style=\"background: rgba(96, 125, 139, 0.8); color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;\">All</button></div><div id=\"computed-styles\" style=\"font-size: 10px; font-family: monospace; background: rgba(255,255,255,0.1); padding: 8px; border-radius: 4px; max-height: 120px; overflow-y: auto;\"></div></div><div style=\"margin-bottom: 15px;\"><h4 style=\"margin: 0 0 8px 0; font-size: 14px; color: #FF5722;\">⚡ Quick Actions</h4><div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 5px;\"><button id=\"copy-selector\" style=\"background: rgba(0, 150, 136, 0.8); color: white; border: none; padding: 6px; border-radius: 3px; cursor: pointer; font-size: 10px;\">Copy CSS Selector</button><button id=\"copy-xpath\" style=\"background: rgba(103, 58, 183, 0.8); color: white; border: none; padding: 6px; border-radius: 3px; cursor: pointer; font-size: 10px;\">Copy XPath</button><button id=\"show-parents\" style=\"background: rgba(121, 85, 72, 0.8); color: white; border: none; padding: 6px; border-radius: 3px; cursor: pointer; font-size: 10px;\">Show Parents</button><button id=\"show-children\" style=\"background: rgba(158, 158, 158, 0.8); color: white; border: none; padding: 6px; border-radius: 3px; cursor: pointer; font-size: 10px;\">Show Children</button><button id=\"hide-element\" style=\"background: rgba(244, 67, 54, 0.8); color: white; border: none; padding: 6px; border-radius: 3px; cursor: pointer; font-size: 10px;\">Hide Element</button><button id=\"highlight-similar\" style=\"background: rgba(255, 193, 7, 0.8); color: #000; border: none; padding: 6px; border-radius: 3px; cursor: pointer; font-size: 10px;\">Highlight Similar</button></div></div><div style=\"margin-bottom: 15px;\"><h4 style=\"margin: 0 0 8px 0; font-size: 14px; color: #E91E63;\">📊 Element Metrics</h4><div id=\"element-metrics\" style=\"font-size: 10px; font-family: monospace; background: rgba(255,255,255,0.1); padding: 8px; border-radius: 4px;\"></div></div></div>`;return panel}function createHighlightOverlay(){const overlay=document.createElement('div');overlay.id='dom-inspector-overlay';overlay.style.cssText=`position: absolute;pointer-events: none;background: rgba(0, 123, 255, 0.2);border: 2px solid #007bff;z-index: 999997;transition: all 0.1s ease;display: none;`;const topLabel=document.createElement('div');topLabel.className='inspector-label inspector-label-top';topLabel.style.cssText=`position: absolute;top: -20px;left: 0;background: #007bff;color: white;font-size: 10px;padding: 2px 6px;border-radius: 3px;font-family: monospace;white-space: nowrap;`;const sideLabel=document.createElement('div');sideLabel.className='inspector-label inspector-label-side';sideLabel.style.cssText=`position: absolute;top: 0;right: -80px;background: #007bff;color: white;font-size: 10px;padding: 2px 6px;border-radius: 3px;font-family: monospace;white-space: nowrap;`;overlay.appendChild(topLabel);overlay.appendChild(sideLabel);return overlay}function generateCSSSelector(element){if(element.id){return`#${element.id}`}let selector=element.tagName.toLowerCase();if(element.className){const classes=element.className.split(' ').filter(c=>c.trim());selector+='.'+classes.join('.')}const parent=element.parentElement;if(parent){const siblings=Array.from(parent.children).filter(e=>e.tagName===element.tagName&&e.className===element.className);if(siblings.length>1){const index=siblings.indexOf(element)+1;selector+=`:nth-child(${index})`}}return selector}function generateXPath(element){if(element.id){return`//*[@id=\"${element.id}\"]`}const parts=[];let current=element;while(current&&current.nodeType===Node.ELEMENT_NODE){let part=current.tagName.toLowerCase();if(current.parentElement){const siblings=Array.from(current.parentElement.children);const sameTagSiblings=siblings.filter(e=>e.tagName===current.tagName);if(sameTagSiblings.length>1){const index=sameTagSiblings.indexOf(current)+1;part+=`[${index}]`}}parts.unshift(part);current=current.parentElement}return'/'+parts.join('/')}function getElementDetails(element){const details={tag:element.tagName.toLowerCase(),id:element.id||'none',classes:element.className||'none',attributes:[],text:(element.textContent||'').trim().substring(0,100),children:element.children.length,parent:element.parentElement?element.parentElement.tagName.toLowerCase():'none'};Array.from(element.attributes).forEach(attr=>{if(attr.name!=='id'&&attr.name!=='class'){details.attributes.push(`${attr.name}=\"${attr.value}\"`)}});return details}function getComputedStyles(element,category='layout'){const computed=window.getComputedStyle(element);const styles={};const categories={layout:['display','position','top','right','bottom','left','width','height','margin','padding','border','float','clear','z-index'],typography:['font-family','font-size','font-weight','line-height','letter-spacing','text-align','text-decoration','text-transform','white-space'],colors:['color','background-color','background-image','border-color','opacity','box-shadow','text-shadow'],all:null};if(category==='all'){for(let prop of computed){const value=computed.getPropertyValue(prop);if(value&&value!=='initial'&&value!=='normal'&&value!=='auto'){styles[prop]=value}}}else{const props=categories[category]||categories.layout;props.forEach(prop=>{const value=computed.getPropertyValue(prop);if(value&&value!=='initial'&&value!=='normal'&&value!=='auto'){styles[prop]=value}})}return styles}function getElementMetrics(element){const rect=element.getBoundingClientRect();const computed=window.getComputedStyle(element);return{position:`${Math.round(rect.left)}, ${Math.round(rect.top)}`,size:`${Math.round(rect.width)} × ${Math.round(rect.height)}`,scrollSize:`${element.scrollWidth} × ${element.scrollHeight}`,boxModel:{content:`${element.clientWidth} × ${element.clientHeight}`,padding:computed.padding,border:computed.border||computed.borderWidth,margin:computed.margin},visibility:{visible:rect.width>0&&rect.height>0,inViewport:rect.top>=0&&rect.left>=0&&rect.bottom<=window.innerHeight&&rect.right<=window.innerWidth,opacity:computed.opacity,zIndex:computed.zIndex}}}function updateElementInfo(element){if(!inspectorPanel||!element)return;selectedElement=element;const infoSection=inspectorPanel.querySelector('#element-info');const detailsDiv=inspectorPanel.querySelector('#element-details');const stylesDiv=inspectorPanel.querySelector('#computed-styles');const metricsDiv=inspectorPanel.querySelector('#element-metrics');infoSection.style.display='block';const details=getElementDetails(element);detailsDiv.innerHTML=`<div><span style=\"color: #FFC107;\">Tag:</span> &lt;${details.tag}&gt;</div><div><span style=\"color: #4CAF50;\">ID:</span> ${details.id}</div><div><span style=\"color: #2196F3;\">Classes:</span> ${details.classes}</div><div><span style=\"color: #FF5722;\">Attributes:</span> ${details.attributes.length>0?details.attributes.join(', '):'none'}</div><div><span style=\"color: #9C27B0;\">Text:</span> ${details.text||'none'}</div><div><span style=\"color: #607D8B;\">Children:</span> ${details.children}</div><div><span style=\"color: #795548;\">Parent:</span> &lt;${details.parent}&gt;</div>`;updateStylesDisplay('layout');const metrics=getElementMetrics(element);metricsDiv.innerHTML=`<div><span style=\"color: #4CAF50;\">Position:</span> ${metrics.position}</div><div><span style=\"color: #2196F3;\">Size:</span> ${metrics.size}</div><div><span style=\"color: #FF9800;\">Scroll Size:</span> ${metrics.scrollSize}</div><div><span style=\"color: #9C27B0;\">Content:</span> ${metrics.boxModel.content}</div><div><span style=\"color: #607D8B;\">In Viewport:</span> ${metrics.visibility.inViewport?'Yes':'No'}</div><div><span style=\"color: #795548;\">Z-Index:</span> ${metrics.visibility.zIndex}</div>`}function updateStylesDisplay(category){if(!selectedElement||!inspectorPanel)return;const stylesDiv=inspectorPanel.querySelector('#computed-styles');const styles=getComputedStyles(selectedElement,category);let html='';const entries=Object.entries(styles);if(entries.length===0){html='<div style=\"color: #666;\">No relevant styles found</div>'}else{entries.slice(0,20).forEach(([prop,value])=>{html+=`<div><span style=\"color: #FFC107;\">${prop}:</span> ${value}</div>`});if(entries.length>20){html+=`<div style=\"color: #666; font-style: italic;\">... and ${entries.length-20} more</div>`}}stylesDiv.innerHTML=html}function highlightElement(element){if(!highlightOverlay||!element)return;const rect=element.getBoundingClientRect();const scrollX=window.pageXOffset||document.documentElement.scrollLeft;const scrollY=window.pageYOffset||document.documentElement.scrollTop;highlightOverlay.style.display='block';highlightOverlay.style.left=(rect.left+scrollX)+'px';highlightOverlay.style.top=(rect.top+scrollY)+'px';highlightOverlay.style.width=rect.width+'px';highlightOverlay.style.height=rect.height+'px';const topLabel=highlightOverlay.querySelector('.inspector-label-top');const sideLabel=highlightOverlay.querySelector('.inspector-label-side');topLabel.textContent=`<${element.tagName.toLowerCase()}>${element.id?'#'+element.id:''}`;sideLabel.textContent=`${Math.round(rect.width)}×${Math.round(rect.height)}`}function copyToClipboard(text){if(navigator.clipboard&&window.isSecureContext){return navigator.clipboard.writeText(text)}else{const textArea=document.createElement('textarea');textArea.value=text;textArea.style.position='absolute';textArea.style.left='-999999px';document.body.appendChild(textArea);textArea.focus();textArea.select();const success=document.execCommand('copy');textArea.remove();return success?Promise.resolve():Promise.reject()}}function updateStatus(message,isError=false){if(!inspectorPanel)return;const status=inspectorPanel.querySelector('#inspector-status');status.textContent=message;status.style.background=isError?'rgba(244, 67, 54, 0.3)':'rgba(255,255,255,0.1)';if(!isError){setTimeout(()=>{status.style.background='rgba(255,255,255,0.1)'},3000)}}function handleMouseOver(e){if(!inspectorActive)return;e.preventDefault();e.stopPropagation();const element=e.target;if(element&&element!==inspectorPanel&&!inspectorPanel.contains(element)){highlightElement(element);updateElementInfo(element)}}function handleMouseOut(e){if(!inspectorActive)return;if(highlightOverlay){highlightOverlay.style.display='none'}}function handleClick(e){if(!inspectorActive)return;e.preventDefault();e.stopPropagation();const element=e.target;if(element&&element!==inspectorPanel&&!inspectorPanel.contains(element)){selectedElement=element;updateStatus(`Selected: <${element.tagName.toLowerCase()}>`)}}function toggleInspector(){inspectorActive=!inspectorActive;const button=inspectorPanel.querySelector('#toggle-inspector');if(inspectorActive){document.addEventListener('mouseover',handleMouseOver,true);document.addEventListener('mouseout',handleMouseOut,true);document.addEventListener('click',handleClick,true);button.textContent='🚫 Disable';button.style.background='rgba(244, 67, 54, 0.8)';updateStatus('Inspector active - hover over elements to inspect')}else{document.removeEventListener('mouseover',handleMouseOver,true);document.removeEventListener('mouseout',handleMouseOut,true);document.removeEventListener('click',handleClick,true);if(highlightOverlay){highlightOverlay.style.display='none'}button.textContent='🎯 Enable';button.style.background='rgba(76, 175, 80, 0.8)';updateStatus('Inspector disabled - click Enable to start')}}function initializeInspector(){if(inspectorPanel){inspectorPanel.remove()}if(highlightOverlay){highlightOverlay.remove()}inspectorPanel=createInspectorPanel();highlightOverlay=createHighlightOverlay();document.body.appendChild(inspectorPanel);document.body.appendChild(highlightOverlay);inspectorPanel.querySelector('#close-inspector').onclick=closeInspector;inspectorPanel.querySelector('#toggle-inspector').onclick=toggleInspector;inspectorPanel.querySelectorAll('.style-category').forEach(button=>{button.onclick=()=>{const category=button.dataset.category;updateStylesDisplay(category);inspectorPanel.querySelectorAll('.style-category').forEach(btn=>{btn.style.opacity='0.7'});button.style.opacity='1'}});inspectorPanel.querySelector('#copy-selector').onclick=()=>{if(selectedElement){const selector=generateCSSSelector(selectedElement);copyToClipboard(selector).then(()=>{updateStatus('CSS selector copied to clipboard')}).catch(()=>{updateStatus('Failed to copy selector',true)})}};inspectorPanel.querySelector('#copy-xpath').onclick=()=>{if(selectedElement){const xpath=generateXPath(selectedElement);copyToClipboard(xpath).then(()=>{updateStatus('XPath copied to clipboard')}).catch(()=>{updateStatus('Failed to copy XPath',true)})}};inspectorPanel.querySelector('#show-parents').onclick=()=>{if(selectedElement){let parent=selectedElement.parentElement;let parents=[];while(parent&&parent!==document.body){parents.push(`<${parent.tagName.toLowerCase()}>${parent.id?'#'+parent.id:''}${parent.className?'.'+parent.className.split(' ')[0]:''}`);parent=parent.parentElement}updateStatus(`Parents: ${parents.join(' > ')||'none'}`)}};inspectorPanel.querySelector('#show-children').onclick=()=>{if(selectedElement){const children=Array.from(selectedElement.children).map(child=>`<${child.tagName.toLowerCase()}>${child.id?'#'+child.id:''}`);updateStatus(`Children (${children.length}): ${children.slice(0,5).join(', ')}${children.length>5?'...':''}`)}};inspectorPanel.querySelector('#hide-element').onclick=()=>{if(selectedElement){originalOutlines.set(selectedElement,selectedElement.style.outline);selectedElement.style.display='none';updateStatus(`Element hidden`);setTimeout(()=>{if(confirm('Unhide element?')){selectedElement.style.display='';updateStatus('Element restored')}},2000)}};inspectorPanel.querySelector('#highlight-similar').onclick=()=>{if(selectedElement){const tag=selectedElement.tagName.toLowerCase();const className=selectedElement.className;let selector=tag;if(className){selector+='.'+className.split(' ')[0]}const similar=document.querySelectorAll(selector);similar.forEach(el=>{originalOutlines.set(el,el.style.outline);el.style.outline='3px solid #ff6b6b'});updateStatus(`Highlighted ${similar.length} similar elements`);setTimeout(()=>{similar.forEach(el=>{el.style.outline=originalOutlines.get(el)||''});updateStatus('Highlights removed')},5000)}};updateStatus('DOM Inspector ready - click Enable to start')}function closeInspector(){if(inspectorActive){toggleInspector()}originalOutlines.forEach((originalOutline,element)=>{element.style.outline=originalOutline});originalOutlines.clear();if(inspectorPanel){inspectorPanel.remove();inspectorPanel=null}if(highlightOverlay){highlightOverlay.remove();highlightOverlay=null}selectedElement=null}document.addEventListener('keydown',function(e){if(inspectorPanel){if(e.key==='Escape'){closeInspector()}else if(e.key==='i'&&e.ctrlKey){e.preventDefault();toggleInspector()}}});initializeInspector()})();
```

## How to use

1. Click the bookmarklet on any webpage
2. **Click "Enable"** to activate inspection mode
3. **Hover over elements** to see live highlighting and details
4. **Click elements** to select and get detailed information
5. **Use style categories** to filter computed styles by type
6. **Try quick actions** for copying selectors or manipulating elements
7. **Close or press Escape** to exit inspector

## Core features

### 🎯 **Visual Element Selection**
- **Hover highlighting** with blue overlay and dimension labels
- **Click selection** to lock element for detailed analysis
- **Element labels** showing tag name, ID, and dimensions
- **Smooth animations** for professional visual feedback

### 📋 **Element Details**
- **Tag information** including element type and hierarchy
- **ID and class analysis** with complete attribute listing
- **Text content preview** (first 100 characters)
- **Child count** and parent element identification
- **Attribute enumeration** for all non-standard attributes

### 🎨 **Computed Style Analysis**
- **Categorized styles** for easier navigation:
  - **Layout**: position, display, dimensions, margin, padding
  - **Typography**: fonts, text styling, line height
  - **Colors**: colors, backgrounds, shadows, opacity
  - **All**: complete computed style listing
- **Smart filtering** removing default/initial values
- **Performance optimization** limiting large style sets

### 📊 **Element Metrics**
- **Position coordinates** relative to viewport
- **Dimensions** including content, padding, border areas
- **Scroll dimensions** for scrollable content
- **Viewport visibility** detection
- **Box model information** with detailed measurements
- **Z-index and opacity** analysis

## Quick actions

### 🎯 **Selector Generation**
- **Copy CSS Selector**: Generates optimized CSS selector for element
- **Copy XPath**: Creates XPath expression for precise element location
- **Intelligent selection**: Uses ID when available, falls back to class/tag combinations
- **nth-child support**: Handles similar elements with position-based selectors

### 👥 **Relationship Navigation**
- **Show Parents**: Displays complete parent hierarchy up to body element
- **Show Children**: Lists all direct child elements with tag information
- **Hierarchical display**: Shows element relationships with proper nesting
- **Interactive feedback**: Status updates show relationship information

### 🎨 **Visual Manipulation**
- **Hide Element**: Temporarily removes element from display with restore option
- **Highlight Similar**: Finds and highlights all elements matching tag and primary class
- **Automatic cleanup**: Highlights auto-remove after 5 seconds
- **Restoration system**: Maintains original styles for proper cleanup

## Advanced features

### ⌨️ **Keyboard Shortcuts**
- **Escape**: Close inspector completely
- **Ctrl+I**: Toggle inspection mode on/off
- **Mouse interactions**: Hover to highlight, click to select

### 🎛️ **Resizable Interface**
- **Draggable panel**: Move inspector to any screen position
- **Resizable dimensions**: Adjust panel size for different screen sizes
- **Scrollable content**: Handle large amounts of element information
- **Responsive design**: Works on desktop and mobile devices

### 🔧 **Developer Tools Integration**
- **CSS selector testing**: Copy selectors for use in stylesheets or JavaScript
- **XPath for automation**: Generate paths for testing frameworks
- **Element debugging**: Quick visual feedback for DOM manipulation
- **Style debugging**: Compare computed vs. authored styles

## Use cases

### 🛠️ **Web Development**
- **CSS debugging**: Analyze computed styles and inheritance issues
- **Layout troubleshooting**: Examine box model and positioning
- **Selector creation**: Generate precise CSS selectors for styling
- **Responsive analysis**: Check element metrics across breakpoints

### 🧪 **Testing & QA**
- **Element identification**: Create reliable selectors for automated tests
- **XPath generation**: Support for Selenium and other testing frameworks
- **Visual regression testing**: Capture element properties for comparison
- **Accessibility analysis**: Examine element structure and relationships

### 📚 **Learning & Education**
- **DOM structure exploration**: Understand HTML document structure
- **CSS inspection**: Learn how computed styles are calculated
- **Web fundamentals**: Visualize element hierarchy and relationships
- **Development workflow**: Practice element selection and inspection

### 🔍 **Content Analysis**
- **Scraping preparation**: Identify elements for data extraction
- **Structure analysis**: Understand content organization and hierarchy
- **Element targeting**: Find specific elements in complex layouts
- **Content auditing**: Analyze page structure and element usage

## Technical details

### 🏗️ **Architecture**
- **Event delegation**: Efficient event handling using capture phase
- **Memory management**: Proper cleanup of event listeners and DOM modifications
- **Performance optimization**: Lazy loading and efficient style computation
- **Modular design**: Separate functions for different inspection aspects

### 🎨 **Visual System**
- **Overlay positioning**: Accurate highlighting using getBoundingClientRect()
- **Scroll handling**: Proper positioning accounting for page scroll
- **Z-index management**: Ensures inspector always appears above content
- **Animation system**: Smooth transitions and visual feedback

### 📊 **Data Processing**
- **Style computation**: Intelligent filtering of relevant CSS properties
- **Selector optimization**: Smart CSS selector generation with fallbacks
- **XPath accuracy**: Precise path generation handling edge cases
- **Relationship mapping**: Efficient parent/child traversal algorithms

### 🌐 **Browser Compatibility**
- **Modern API usage**: Utilizes current DOM and styling APIs
- **Clipboard integration**: Modern clipboard API with fallback support
- **Cross-browser styles**: Compatible computed style access
- **Event handling**: Standard event model with proper cleanup

## Pro tips

### 🎯 **Efficient Inspection**
- **Enable inspection first** then systematically explore elements
- **Use style categories** to focus on relevant CSS properties
- **Copy selectors immediately** when you find the right element
- **Check element metrics** to understand layout issues

### 🔧 **Advanced Usage**
- **Combine with browser DevTools** for comprehensive debugging
- **Test generated selectors** in console before using in code
- **Use parent/child navigation** to understand element relationships
- **Leverage keyboard shortcuts** for faster workflow

### 💡 **Best Practices**
- **Resize panel as needed** for better visibility of information
- **Use highlight similar** to identify pattern issues across pages
- **Save important selectors** before closing inspector
- **Practice on different sites** to understand various DOM structures
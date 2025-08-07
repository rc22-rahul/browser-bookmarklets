# 📏 Screen Ruler Bookmarklet

Measure distances, element dimensions, and spacing on any webpage with precision pixel measurements.

## What it does

- **Distance measurement** by dragging between two points
- **Element dimension analysis** by clicking on any page element  
- **Real-time measurements** with visual feedback and crosshairs
- **Multiple measurement types** showing total distance, horizontal/vertical deltas
- **Visual overlays** highlighting measured elements with dimension labels
- **Persistent measurements** that stay on screen until cleared

## How to install

1. Create a new bookmark in your browser
2. Copy the code below and paste it as the URL:

```javascript
javascript:(function(){let isRulerActive=false;let isDragging=false;let startPoint=null;let endPoint=null;let rulerLine=null;let measurementTooltip=null;let selectedElement=null;const modal=document.createElement('div');modal.id='screen-ruler-modal';modal.style.cssText=`position: fixed;top: 20px;right: 20px;background: #fff;border: 2px solid #333;border-radius: 12px;padding: 20px;width: 300px;z-index: 999999;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;box-shadow: 0 8px 32px rgba(0,0,0,0.3);transition: all 0.3s ease;`;modal.innerHTML=`<div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px;\"><h3 style=\"margin: 0; color: #333; font-size: 18px;\">📏 Screen Ruler</h3><button id=\"close-ruler\" style=\"background: #dc3545; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;\">✕</button></div><div style=\"margin-bottom: 15px;\"><button id=\"measure-distance\" style=\"background: #007bff; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; width: 100%; margin-bottom: 10px; font-weight: bold;\">📏 Measure Distance</button><button id=\"measure-element\" style=\"background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; width: 100%; margin-bottom: 10px; font-weight: bold;\">📐 Measure Element</button><button id=\"clear-measurements\" style=\"background: #ffc107; color: #212529; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; width: 100%; font-weight: bold;\">🗑️ Clear All</button></div><div id=\"measurements-display\" style=\"background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e9ecef;\"><div style=\"font-size: 14px; color: #666; text-align: center;\"><div style=\"margin-bottom: 10px;\">🎯 Ready to measure!</div><div style=\"font-size: 12px;\">Click a tool above to start measuring</div></div></div><div style=\"margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee; font-size: 11px; color: #666;\"><strong>💡 Tips:</strong><br>• Drag to measure distance between points<br>• Click elements to see their dimensions<br>• All measurements show in pixels</div>`;const style=document.createElement('style');style.textContent=`.ruler-line {position: absolute;background: #007bff;z-index: 999998;pointer-events: none;}.ruler-crosshair {position: absolute;width: 20px;height: 20px;border: 2px solid #007bff;border-radius: 50%;background: rgba(0, 123, 255, 0.2);transform: translate(-50%, -50%);z-index: 999998;pointer-events: none;}.ruler-tooltip {position: absolute;background: rgba(0, 0, 0, 0.8);color: white;padding: 8px 12px;border-radius: 6px;font-size: 14px;font-weight: bold;z-index: 999999;pointer-events: none;white-space: nowrap;}.ruler-element-highlight {outline: 3px solid #28a745 !important;outline-offset: 2px !important;cursor: crosshair !important;}.ruler-element-overlay {position: absolute;background: rgba(40, 167, 69, 0.2);border: 2px solid #28a745;pointer-events: none;z-index: 999998;}.ruler-measurement-label {position: absolute;background: rgba(0, 0, 0, 0.8);color: white;padding: 4px 8px;border-radius: 4px;font-size: 12px;font-weight: bold;z-index: 999999;pointer-events: none;}.ruler-grid {position: fixed;top: 0;left: 0;width: 100vw;height: 100vh;pointer-events: none;z-index: 999997;opacity: 0.3;background-image: linear-gradient(rgba(0,123,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,123,255,0.3) 1px, transparent 1px);background-size: 20px 20px;display: none;}`;document.head.appendChild(style);function getDistance(point1,point2){const dx=point2.x-point1.x;const dy=point2.y-point1.y;return Math.round(Math.sqrt(dx*dx+dy*dy))}function getElementDimensions(element){const rect=element.getBoundingClientRect();return{width:Math.round(rect.width),height:Math.round(rect.height),top:Math.round(rect.top),left:Math.round(rect.left),right:Math.round(rect.right),bottom:Math.round(rect.bottom)}}function updateMeasurementDisplay(content){modal.querySelector('#measurements-display').innerHTML=content}function createRulerLine(start,end){const line=document.createElement('div');line.className='ruler-line';const dx=end.x-start.x;const dy=end.y-start.y;const length=Math.sqrt(dx*dx+dy*dy);const angle=Math.atan2(dy,dx)*180/Math.PI;line.style.left=start.x+'px';line.style.top=start.y+'px';line.style.width=length+'px';line.style.height='2px';line.style.transformOrigin='0 50%';line.style.transform=`rotate(${angle}deg)`;return line}function createCrosshair(point){const crosshair=document.createElement('div');crosshair.className='ruler-crosshair';crosshair.style.left=point.x+'px';crosshair.style.top=point.y+'px';return crosshair}function createTooltip(point,text){const tooltip=document.createElement('div');tooltip.className='ruler-tooltip';tooltip.textContent=text;tooltip.style.left=(point.x+10)+'px';tooltip.style.top=(point.y-30)+'px';return tooltip}function clearAllMeasurements(){document.querySelectorAll('.ruler-line, .ruler-crosshair, .ruler-tooltip, .ruler-element-overlay, .ruler-measurement-label').forEach(el=>el.remove());document.querySelectorAll('.ruler-element-highlight').forEach(el=>{el.classList.remove('ruler-element-highlight')});updateMeasurementDisplay(`<div style=\"font-size: 14px; color: #666; text-align: center;\"><div style=\"margin-bottom: 10px;\">🎯 Ready to measure!</div><div style=\"font-size: 12px;\">Click a tool above to start measuring</div></div>`)}function activateDistanceMeasurement(){isRulerActive=true;document.body.style.cursor='crosshair';const button=modal.querySelector('#measure-distance');button.style.background='#dc3545';button.textContent='❌ Cancel Distance';updateMeasurementDisplay(`<div style=\"font-size: 14px; color: #007bff; text-align: center;\"><div style=\"margin-bottom: 10px;\">📏 Distance Mode Active</div><div style=\"font-size: 12px;\">Click and drag to measure distance</div></div>`);document.addEventListener('mousedown',startDistanceMeasurement);document.addEventListener('mousemove',updateDistanceMeasurement);document.addEventListener('mouseup',endDistanceMeasurement)}function deactivateDistanceMeasurement(){isRulerActive=false;isDragging=false;document.body.style.cursor='';const button=modal.querySelector('#measure-distance');button.style.background='#007bff';button.textContent='📏 Measure Distance';document.removeEventListener('mousedown',startDistanceMeasurement);document.removeEventListener('mousemove',updateDistanceMeasurement);document.removeEventListener('mouseup',endDistanceMeasurement)}function startDistanceMeasurement(e){if(e.target===modal||modal.contains(e.target))return;isDragging=true;startPoint={x:e.clientX,y:e.clientY};const startCrosshair=createCrosshair(startPoint);document.body.appendChild(startCrosshair)}function updateDistanceMeasurement(e){if(!isDragging||!startPoint)return;if(rulerLine)rulerLine.remove();if(measurementTooltip)measurementTooltip.remove();endPoint={x:e.clientX,y:e.clientY};rulerLine=createRulerLine(startPoint,endPoint);document.body.appendChild(rulerLine);const distance=getDistance(startPoint,endPoint);const midPoint={x:(startPoint.x+endPoint.x)/2,y:(startPoint.y+endPoint.y)/2};measurementTooltip=createTooltip(midPoint,`${distance}px`);document.body.appendChild(measurementTooltip)}function endDistanceMeasurement(e){if(!isDragging||!startPoint)return;isDragging=false;endPoint={x:e.clientX,y:e.clientY};const endCrosshair=createCrosshair(endPoint);document.body.appendChild(endCrosshair);const distance=getDistance(startPoint,endPoint);const dx=Math.abs(endPoint.x-startPoint.x);const dy=Math.abs(endPoint.y-startPoint.y);updateMeasurementDisplay(`<div style=\"font-size: 14px;\"><div style=\"font-weight: bold; color: #007bff; margin-bottom: 10px;\">📏 Distance Measured</div><div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;\"><div>Total Distance:</div><div style=\"font-weight: bold;\">${distance}px</div><div>Horizontal (ΔX):</div><div style=\"font-weight: bold;\">${dx}px</div><div>Vertical (ΔY):</div><div style=\"font-weight: bold;\">${dy}px</div></div></div>`);startPoint=null;endPoint=null}function activateElementMeasurement(){const button=modal.querySelector('#measure-element');button.style.background='#dc3545';button.textContent='❌ Cancel Element';updateMeasurementDisplay(`<div style=\"font-size: 14px; color: #28a745; text-align: center;\"><div style=\"margin-bottom: 10px;\">📐 Element Mode Active</div><div style=\"font-size: 12px;\">Click any element to measure it</div></div>`);document.addEventListener('mouseover',highlightElement);document.addEventListener('click',measureElement)}function deactivateElementMeasurement(){const button=modal.querySelector('#measure-element');button.style.background='#28a745';button.textContent='📐 Measure Element';document.querySelectorAll('.ruler-element-highlight').forEach(el=>{el.classList.remove('ruler-element-highlight')});document.removeEventListener('mouseover',highlightElement);document.removeEventListener('click',measureElement)}function highlightElement(e){if(e.target===modal||modal.contains(e.target))return;if(selectedElement){selectedElement.classList.remove('ruler-element-highlight')}selectedElement=e.target;selectedElement.classList.add('ruler-element-highlight')}function measureElement(e){if(e.target===modal||modal.contains(e.target))return;e.preventDefault();e.stopPropagation();const element=e.target;const dimensions=getElementDimensions(element);const tagName=element.tagName.toLowerCase();const className=element.className?`.${element.className.split(' ')[0]}`:'';const elementLabel=`${tagName}${className}`;const overlay=document.createElement('div');overlay.className='ruler-element-overlay';overlay.style.left=dimensions.left+'px';overlay.style.top=dimensions.top+'px';overlay.style.width=dimensions.width+'px';overlay.style.height=dimensions.height+'px';document.body.appendChild(overlay);const labels=[{text:`W: ${dimensions.width}px`,x:dimensions.left+dimensions.width/2,y:dimensions.top-10},{text:`H: ${dimensions.height}px`,x:dimensions.left-10,y:dimensions.top+dimensions.height/2}];labels.forEach(label=>{const labelEl=document.createElement('div');labelEl.className='ruler-measurement-label';labelEl.textContent=label.text;labelEl.style.left=label.x+'px';labelEl.style.top=label.y+'px';labelEl.style.transform='translate(-50%, -50%)';document.body.appendChild(labelEl)});updateMeasurementDisplay(`<div style=\"font-size: 14px;\"><div style=\"font-weight: bold; color: #28a745; margin-bottom: 10px;\">📐 Element Measured</div><div style=\"margin-bottom: 10px; font-size: 12px; color: #666;\">${elementLabel}</div><div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;\"><div>Width:</div><div style=\"font-weight: bold;\">${dimensions.width}px</div><div>Height:</div><div style=\"font-weight: bold;\">${dimensions.height}px</div><div>Top:</div><div style=\"font-weight: bold;\">${dimensions.top}px</div><div>Left:</div><div style=\"font-weight: bold;\">${dimensions.left}px</div></div></div>`);deactivateElementMeasurement()}modal.querySelector('#close-ruler').onclick=function(){modal.remove();style.remove();clearAllMeasurements();deactivateDistanceMeasurement();deactivateElementMeasurement()};modal.querySelector('#measure-distance').onclick=function(){if(isRulerActive){deactivateDistanceMeasurement()}else{deactivateElementMeasurement();activateDistanceMeasurement()}};modal.querySelector('#measure-element').onclick=function(){const button=this;if(button.style.background==='rgb(220, 53, 69)'){deactivateElementMeasurement()}else{deactivateDistanceMeasurement();activateElementMeasurement()}};modal.querySelector('#clear-measurements').onclick=clearAllMeasurements;document.addEventListener('keydown',function(e){if(e.key==='Escape'){deactivateDistanceMeasurement();deactivateElementMeasurement()}});document.body.appendChild(modal)})()
```

## How to use

1. Click the bookmarklet on any website  
2. **Distance measurement**: Click "Measure Distance", then drag between two points
3. **Element measurement**: Click "Measure Element", then click any page element
4. **Clear measurements**: Click "Clear All" to remove all measurements
5. **Close**: Click ✕ to close the ruler and remove all measurements

## Measurement types

### 📏 **Distance Measurement**
- **Click and drag** between any two points on the page
- Shows **total distance** in pixels
- Displays **horizontal (ΔX)** and **vertical (ΔY)** components
- **Visual feedback** with crosshairs at start/end points
- **Live measurement** updates as you drag

### 📐 **Element Measurement**  
- **Click any element** to get its dimensions and position
- Shows **width and height** in pixels
- Displays **top and left** position coordinates
- **Visual overlay** highlighting the measured element
- **Dimension labels** showing width/height directly on the element

## Key features

### 🎯 **Precise Measurements**
- Pixel-perfect accuracy for all measurements
- Real-time updates during drag operations
- Multiple coordinate systems (absolute positioning)

### 🎨 **Visual Feedback**
- Blue crosshairs mark measurement points
- Green overlays highlight measured elements
- Colored measurement lines and labels
- Tooltips showing live measurements

### 🔧 **Easy Controls**
- Compact floating control panel
- One-click mode switching
- Clear all measurements with single button
- Escape key cancels active measurements

### 📊 **Comprehensive Data**
- Total distance calculations
- Horizontal and vertical deltas
- Element dimensions (width × height)
- Position coordinates (top, left)
- Element identification (tag + class)

## Use cases

### 🎨 **Design & UI/UX**
- Measure spacing between elements
- Check alignment and positioning
- Verify responsive breakpoints
- Analyze layout consistency

### 🔧 **Development**
- Debug CSS layout issues
- Verify element dimensions
- Check padding and margins
- Measure responsive behavior

### 🧪 **Testing**
- Validate design specifications
- Check cross-browser consistency
- Measure interactive element sizes
- Verify accessibility requirements

### 📐 **General Analysis**
- Measure image dimensions
- Check content area sizes
- Analyze page layout structure
- Compare element proportions

## Technical details

- **Coordinate system**: Uses `getBoundingClientRect()` for accurate positioning
- **Visual elements**: Dynamic DOM manipulation for measurement overlays
- **Event handling**: Mouse tracking with proper event cleanup
- **Cross-browser**: Works in all modern browsers
- **Performance**: Efficient measurement calculations using basic geometry
- **Memory management**: Automatic cleanup of event listeners and DOM elements
- **Keyboard shortcuts**: Escape key for quick cancellation
- **Floating UI**: Non-intrusive control panel positioned out of the way

## Pro tips

- **Drag slowly** for more precise distance measurements
- **Multiple measurements** can be active simultaneously until cleared
- **Element highlighting** helps identify what you're about to measure
- **Keyboard shortcuts** provide quick access to cancel operations
- **Measurements persist** until manually cleared, allowing comparison
- **Element labels** show both tag name and first CSS class for identification
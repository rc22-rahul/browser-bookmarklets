// Color Picker Bookmarklet
// Pick colors from any web page element and generate palettes

javascript:(function(){
    // Color palette generation functions
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }
    
    function hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
    
    function generatePalette(baseColor) {
        const rgb = hexToRgb(baseColor);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        return {
            monochromatic: generateMonochromatic(hsl),
            analogous: generateAnalogous(hsl),
            complementary: generateComplementary(hsl),
            triadic: generateTriadic(hsl),
            split: generateSplitComplementary(hsl)
        };
    }
    
    function generateMonochromatic(hsl) {
        const colors = [];
        const lightnesses = [20, 40, hsl.l, 70, 85];
        lightnesses.forEach(l => {
            const rgb = hslToRgb(hsl.h, hsl.s, l);
            colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
        });
        return colors;
    }
    
    function generateAnalogous(hsl) {
        const colors = [];
        const hues = [-30, -15, hsl.h, 15, 30];
        hues.forEach(h => {
            const adjustedH = (h + 360) % 360;
            const rgb = hslToRgb(adjustedH, hsl.s, hsl.l);
            colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
        });
        return colors;
    }
    
    function generateComplementary(hsl) {
        const complementH = (hsl.h + 180) % 360;
        const baseRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
        const compRgb = hslToRgb(complementH, hsl.s, hsl.l);
        
        return [
            rgbToHex(baseRgb.r, baseRgb.g, baseRgb.b),
            rgbToHex(compRgb.r, compRgb.g, compRgb.b)
        ];
    }
    
    function generateTriadic(hsl) {
        const colors = [];
        const hues = [hsl.h, (hsl.h + 120) % 360, (hsl.h + 240) % 360];
        hues.forEach(h => {
            const rgb = hslToRgb(h, hsl.s, hsl.l);
            colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
        });
        return colors;
    }
    
    function generateSplitComplementary(hsl) {
        const colors = [];
        const hues = [hsl.h, (hsl.h + 150) % 360, (hsl.h + 210) % 360];
        hues.forEach(h => {
            const rgb = hslToRgb(h, hsl.s, hsl.l);
            colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
        });
        return colors;
    }
    
    // Get color from element
    function getElementColor(element) {
        const style = window.getComputedStyle(element);
        const bgColor = style.backgroundColor;
        const textColor = style.color;
        
        // Convert rgba/rgb to hex
        const rgbaToHex = (rgba) => {
            const matches = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (!matches) return null;
            
            const r = parseInt(matches[1]);
            const g = parseInt(matches[2]);
            const b = parseInt(matches[3]);
            const a = matches[4] ? parseFloat(matches[4]) : 1;
            
            if (a === 0) return null; // Transparent
            
            return rgbToHex(r, g, b);
        };
        
        const bgHex = rgbaToHex(bgColor);
        const textHex = rgbaToHex(textColor);
        
        return {
            background: bgHex,
            text: textHex,
            element: element.tagName.toLowerCase()
        };
    }
    
    // Copy to clipboard
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'color-picker-modal';
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
        max-width: 900px;
        max-height: 85vh;
        overflow-y: auto;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    `;
    
    let isPickerActive = false;
    let currentColor = '#3498db';
    
    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #eee; padding-bottom: 15px;">
            <h2 style="margin: 0; color: #333; font-size: 24px;">🎨 Color Picker</h2>
            <button id="close-color-picker" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 16px;">✕</button>
        </div>
        
        <div style="margin-bottom: 25px;">
            <button id="activate-picker" style="background: #007bff; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; margin-right: 10px;">
                🔍 Click to Pick Colors
            </button>
            <span style="color: #666; font-size: 14px;">Click any element on the page to extract its colors</span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
            <!-- Current Color -->
            <div>
                <h4 style="margin: 0 0 15px 0; color: #333;">🎯 Current Color</h4>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
                    <div id="current-color-display" style="width: 100px; height: 100px; margin: 0 auto 15px; border-radius: 50%; border: 3px solid #ddd; background: ${currentColor}; cursor: pointer;" title="Click to copy"></div>
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;" id="current-color-hex">${currentColor}</div>
                    <div style="font-size: 14px; color: #666;" id="current-color-rgb">RGB(52, 152, 219)</div>
                    <div style="font-size: 14px; color: #666;" id="current-color-hsl">HSL(204, 70%, 53%)</div>
                </div>
            </div>
            
            <!-- Manual Input -->
            <div>
                <h4 style="margin: 0 0 15px 0; color: #333;">✏️ Manual Input</h4>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                    <input type="color" id="color-input" value="${currentColor}" style="width: 100%; height: 50px; border: none; border-radius: 8px; cursor: pointer; margin-bottom: 15px;">
                    <input type="text" id="hex-input" value="${currentColor}" placeholder="Enter hex color..." style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-family: monospace;">
                </div>
            </div>
        </div>
        
        <!-- Palette Section -->
        <div id="palette-section">
            <h4 style="margin: 0 0 15px 0; color: #333;">🎨 Generated Palettes</h4>
            <div id="palette-container"></div>
        </div>
        
        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <strong>💡 Pro Tips:</strong> 
            • Click the color picker button then click any element to extract its colors
            • Click any color swatch to copy it to clipboard
            • Use the manual input to generate palettes from specific colors
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .palette-section {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid #e9ecef;
        }
        .palette-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
            text-transform: capitalize;
        }
        .color-swatches {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .color-swatch {
            width: 60px;
            height: 60px;
            border-radius: 8px;
            cursor: pointer;
            border: 2px solid #ddd;
            position: relative;
            transition: transform 0.2s ease;
        }
        .color-swatch:hover {
            transform: scale(1.1);
            border-color: #333;
        }
        .color-swatch::after {
            content: attr(data-color);
            position: absolute;
            bottom: -25px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            color: #666;
            white-space: nowrap;
        }
        .picker-cursor {
            cursor: crosshair !important;
        }
        .element-highlight {
            outline: 3px solid #007bff !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(style);
    
    // Update color display
    function updateColorDisplay(color) {
        currentColor = color;
        const rgb = hexToRgb(color);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        modal.querySelector('#current-color-display').style.background = color;
        modal.querySelector('#current-color-hex').textContent = color.toUpperCase();
        modal.querySelector('#current-color-rgb').textContent = `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        modal.querySelector('#current-color-hsl').textContent = `HSL(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        modal.querySelector('#color-input').value = color;
        modal.querySelector('#hex-input').value = color;
        
        generatePalettes(color);
    }
    
    // Generate and display palettes
    function generatePalettes(color) {
        const palettes = generatePalette(color);
        const container = modal.querySelector('#palette-container');
        
        container.innerHTML = Object.entries(palettes).map(([type, colors]) => `
            <div class="palette-section">
                <div class="palette-title">${type} Palette</div>
                <div class="color-swatches">
                    ${colors.map(c => `
                        <div class="color-swatch" 
                             style="background: ${c}" 
                             data-color="${c.toUpperCase()}"
                             onclick="copyColor('${c}')"
                             title="Click to copy ${c}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
    
    // Copy color function
    window.copyColor = function(color) {
        copyToClipboard(color);
        showToast(`Copied ${color} to clipboard!`);
    };
    
    // Show toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 1000000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    // Picker functionality
    let highlightedElement = null;
    
    function activatePicker() {
        isPickerActive = true;
        document.body.style.cursor = 'crosshair';
        modal.querySelector('#activate-picker').style.background = '#dc3545';
        modal.querySelector('#activate-picker').textContent = '❌ Cancel Picking';
        
        document.addEventListener('mouseover', highlightElement);
        document.addEventListener('click', pickColor);
    }
    
    function deactivatePicker() {
        isPickerActive = false;
        document.body.style.cursor = '';
        modal.querySelector('#activate-picker').style.background = '#007bff';
        modal.querySelector('#activate-picker').textContent = '🔍 Click to Pick Colors';
        
        if (highlightedElement) {
            highlightedElement.classList.remove('element-highlight');
        }
        
        document.removeEventListener('mouseover', highlightElement);
        document.removeEventListener('click', pickColor);
    }
    
    function highlightElement(e) {
        if (e.target === modal || modal.contains(e.target)) return;
        
        if (highlightedElement) {
            highlightedElement.classList.remove('element-highlight');
        }
        
        highlightedElement = e.target;
        highlightedElement.classList.add('element-highlight');
    }
    
    function pickColor(e) {
        if (e.target === modal || modal.contains(e.target)) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const colors = getElementColor(e.target);
        
        if (colors.background && colors.background !== '#ffffff') {
            updateColorDisplay(colors.background);
            showToast(`Picked background color from ${colors.element} element!`);
        } else if (colors.text) {
            updateColorDisplay(colors.text);
            showToast(`Picked text color from ${colors.element} element!`);
        } else {
            showToast('No suitable color found on this element');
        }
        
        deactivatePicker();
    }
    
    // Event listeners
    modal.querySelector('#close-color-picker').onclick = function() {
        modal.remove();
        style.remove();
        deactivatePicker();
        delete window.copyColor;
    };
    
    modal.querySelector('#activate-picker').onclick = function() {
        if (isPickerActive) {
            deactivatePicker();
        } else {
            activatePicker();
        }
    };
    
    modal.querySelector('#color-input').oninput = function(e) {
        updateColorDisplay(e.target.value);
    };
    
    modal.querySelector('#hex-input').oninput = function(e) {
        const value = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(value)) {
            updateColorDisplay(value);
        }
    };
    
    modal.querySelector('#current-color-display').onclick = function() {
        copyColor(currentColor);
    };
    
    // Initialize
    document.body.appendChild(modal);
    updateColorDisplay(currentColor);
})();
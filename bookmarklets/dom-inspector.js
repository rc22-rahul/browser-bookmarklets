// Enhanced DOM Inspector Bookmarklet
// Advanced DOM inspection with element selection, properties, and manipulation tools

javascript:(function(){
    let inspectorActive = false;
    let inspectorPanel = null;
    let highlightOverlay = null;
    let selectedElement = null;
    let originalOutlines = new Map();
    
    // Create inspector panel
    function createInspectorPanel() {
        const panel = document.createElement('div');
        panel.id = 'dom-inspector-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 20px;
            border-radius: 12px;
            z-index: 999998;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Courier New', monospace;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            min-width: 350px;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            transition: all 0.3s ease;
            resize: both;
        `;
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 10px;">
                <h3 style="margin: 0; font-size: 18px; color: #4CAF50;">🔍 DOM Inspector</h3>
                <div>
                    <button id="toggle-inspector" style="background: rgba(76, 175, 80, 0.8); color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px; font-size: 12px;">
                        🎯 Enable
                    </button>
                    <button id="close-inspector" style="background: rgba(244, 67, 54, 0.8); color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        ✕
                    </button>
                </div>
            </div>
            
            <div id="inspector-status" style="background: rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 6px; font-size: 12px; margin-bottom: 15px; text-align: center;">
                Click "Enable" then hover over elements to inspect
            </div>
            
            <div id="element-info" style="display: none;">
                <div style="margin-bottom: 15px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #FFC107;">📋 Element Details</h4>
                    <div id="element-details" style="font-size: 11px; font-family: monospace; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 4px; max-height: 150px; overflow-y: auto;">
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #2196F3;">🎨 Computed Styles</h4>
                    <div style="display: flex; gap: 5px; margin-bottom: 8px;">
                        <button class="style-category" data-category="layout" style="background: rgba(33, 150, 243, 0.8); color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;">Layout</button>
                        <button class="style-category" data-category="typography" style="background: rgba(156, 39, 176, 0.8); color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;">Typography</button>
                        <button class="style-category" data-category="colors" style="background: rgba(255, 152, 0, 0.8); color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;">Colors</button>
                        <button class="style-category" data-category="all" style="background: rgba(96, 125, 139, 0.8); color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;">All</button>
                    </div>
                    <div id="computed-styles" style="font-size: 10px; font-family: monospace; background: rgba(255,255,255,0.1); padding: 8px; border-radius: 4px; max-height: 120px; overflow-y: auto;">
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #FF5722;">⚡ Quick Actions</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
                        <button id="copy-selector" style="background: rgba(0, 150, 136, 0.8); color: white; border: none; padding: 6px; border-radius: 3px; cursor: pointer; font-size: 10px;">Copy CSS Selector</button>
                        <button id="copy-xpath" style="background: rgba(103, 58, 183, 0.8); color: white; border: none; padding: 6px; border-radius: 3px; cursor: pointer; font-size: 10px;">Copy XPath</button>
                        <button id="show-parents" style="background: rgba(121, 85, 72, 0.8); color: white; border: none; padding: 6px; border-radius: 3px; cursor: pointer; font-size: 10px;">Show Parents</button>
                        <button id="show-children" style="background: rgba(158, 158, 158, 0.8); color: white; border: none; padding: 6px; border-radius: 3px; cursor: pointer; font-size: 10px;">Show Children</button>
                        <button id="hide-element" style="background: rgba(244, 67, 54, 0.8); color: white; border: none; padding: 6px; border-radius: 3px; cursor: pointer; font-size: 10px;">Hide Element</button>
                        <button id="highlight-similar" style="background: rgba(255, 193, 7, 0.8); color: #000; border: none; padding: 6px; border-radius: 3px; cursor: pointer; font-size: 10px;">Highlight Similar</button>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #E91E63;">📊 Element Metrics</h4>
                    <div id="element-metrics" style="font-size: 10px; font-family: monospace; background: rgba(255,255,255,0.1); padding: 8px; border-radius: 4px;">
                    </div>
                </div>
            </div>
        `;
        
        return panel;
    }
    
    // Create highlight overlay
    function createHighlightOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'dom-inspector-overlay';
        overlay.style.cssText = `
            position: absolute;
            pointer-events: none;
            background: rgba(0, 123, 255, 0.2);
            border: 2px solid #007bff;
            z-index: 999997;
            transition: all 0.1s ease;
            display: none;
        `;
        
        // Add measurement labels
        const topLabel = document.createElement('div');
        topLabel.className = 'inspector-label inspector-label-top';
        topLabel.style.cssText = `
            position: absolute;
            top: -20px;
            left: 0;
            background: #007bff;
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
            white-space: nowrap;
        `;
        
        const sideLabel = document.createElement('div');
        sideLabel.className = 'inspector-label inspector-label-side';
        sideLabel.style.cssText = `
            position: absolute;
            top: 0;
            right: -80px;
            background: #007bff;
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
            white-space: nowrap;
        `;
        
        overlay.appendChild(topLabel);
        overlay.appendChild(sideLabel);
        
        return overlay;
    }
    
    // Generate CSS selector for element
    function generateCSSSelector(element) {
        if (element.id) {
            return `#${element.id}`;
        }
        
        let selector = element.tagName.toLowerCase();
        
        if (element.className) {
            const classes = element.className.split(' ').filter(c => c.trim());
            selector += '.' + classes.join('.');
        }
        
        // Add nth-child if needed
        const parent = element.parentElement;
        if (parent) {
            const siblings = Array.from(parent.children).filter(e => 
                e.tagName === element.tagName && 
                e.className === element.className
            );
            if (siblings.length > 1) {
                const index = siblings.indexOf(element) + 1;
                selector += `:nth-child(${index})`;
            }
        }
        
        return selector;
    }
    
    // Generate XPath for element
    function generateXPath(element) {
        if (element.id) {
            return `//*[@id="${element.id}"]`;
        }
        
        const parts = [];
        let current = element;
        
        while (current && current.nodeType === Node.ELEMENT_NODE) {
            let part = current.tagName.toLowerCase();
            
            if (current.parentElement) {
                const siblings = Array.from(current.parentElement.children);
                const sameTagSiblings = siblings.filter(e => e.tagName === current.tagName);
                
                if (sameTagSiblings.length > 1) {
                    const index = sameTagSiblings.indexOf(current) + 1;
                    part += `[${index}]`;
                }
            }
            
            parts.unshift(part);
            current = current.parentElement;
        }
        
        return '/' + parts.join('/');
    }
    
    // Get element details
    function getElementDetails(element) {
        const details = {
            tag: element.tagName.toLowerCase(),
            id: element.id || 'none',
            classes: element.className || 'none',
            attributes: [],
            text: (element.textContent || '').trim().substring(0, 100),
            children: element.children.length,
            parent: element.parentElement ? element.parentElement.tagName.toLowerCase() : 'none'
        };
        
        Array.from(element.attributes).forEach(attr => {
            if (attr.name !== 'id' && attr.name !== 'class') {
                details.attributes.push(`${attr.name}="${attr.value}"`);
            }
        });
        
        return details;
    }
    
    // Get computed styles for specific categories
    function getComputedStyles(element, category = 'layout') {
        const computed = window.getComputedStyle(element);
        const styles = {};
        
        const categories = {
            layout: ['display', 'position', 'top', 'right', 'bottom', 'left', 'width', 'height', 'margin', 'padding', 'border', 'float', 'clear', 'z-index'],
            typography: ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align', 'text-decoration', 'text-transform', 'white-space'],
            colors: ['color', 'background-color', 'background-image', 'border-color', 'opacity', 'box-shadow', 'text-shadow'],
            all: null
        };
        
        if (category === 'all') {
            for (let prop of computed) {
                const value = computed.getPropertyValue(prop);
                if (value && value !== 'initial' && value !== 'normal' && value !== 'auto') {
                    styles[prop] = value;
                }
            }
        } else {
            const props = categories[category] || categories.layout;
            props.forEach(prop => {
                const value = computed.getPropertyValue(prop);
                if (value && value !== 'initial' && value !== 'normal' && value !== 'auto') {
                    styles[prop] = value;
                }
            });
        }
        
        return styles;
    }
    
    // Get element metrics
    function getElementMetrics(element) {
        const rect = element.getBoundingClientRect();
        const computed = window.getComputedStyle(element);
        
        return {
            position: `${Math.round(rect.left)}, ${Math.round(rect.top)}`,
            size: `${Math.round(rect.width)} × ${Math.round(rect.height)}`,
            scrollSize: `${element.scrollWidth} × ${element.scrollHeight}`,
            boxModel: {
                content: `${element.clientWidth} × ${element.clientHeight}`,
                padding: computed.padding,
                border: computed.border || computed.borderWidth,
                margin: computed.margin
            },
            visibility: {
                visible: rect.width > 0 && rect.height > 0,
                inViewport: rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth,
                opacity: computed.opacity,
                zIndex: computed.zIndex
            }
        };
    }
    
    // Update element information display
    function updateElementInfo(element) {
        if (!inspectorPanel || !element) return;
        
        selectedElement = element;
        const infoSection = inspectorPanel.querySelector('#element-info');
        const detailsDiv = inspectorPanel.querySelector('#element-details');
        const stylesDiv = inspectorPanel.querySelector('#computed-styles');
        const metricsDiv = inspectorPanel.querySelector('#element-metrics');
        
        infoSection.style.display = 'block';
        
        // Update element details
        const details = getElementDetails(element);
        detailsDiv.innerHTML = `
            <div><span style="color: #FFC107;">Tag:</span> &lt;${details.tag}&gt;</div>
            <div><span style="color: #4CAF50;">ID:</span> ${details.id}</div>
            <div><span style="color: #2196F3;">Classes:</span> ${details.classes}</div>
            <div><span style="color: #FF5722;">Attributes:</span> ${details.attributes.length > 0 ? details.attributes.join(', ') : 'none'}</div>
            <div><span style="color: #9C27B0;">Text:</span> ${details.text || 'none'}</div>
            <div><span style="color: #607D8B;">Children:</span> ${details.children}</div>
            <div><span style="color: #795548;">Parent:</span> &lt;${details.parent}&gt;</div>
        `;
        
        // Update computed styles (default to layout)
        updateStylesDisplay('layout');
        
        // Update metrics
        const metrics = getElementMetrics(element);
        metricsDiv.innerHTML = `
            <div><span style="color: #4CAF50;">Position:</span> ${metrics.position}</div>
            <div><span style="color: #2196F3;">Size:</span> ${metrics.size}</div>
            <div><span style="color: #FF9800;">Scroll Size:</span> ${metrics.scrollSize}</div>
            <div><span style="color: #9C27B0;">Content:</span> ${metrics.boxModel.content}</div>
            <div><span style="color: #607D8B;">In Viewport:</span> ${metrics.visibility.inViewport ? 'Yes' : 'No'}</div>
            <div><span style="color: #795548;">Z-Index:</span> ${metrics.visibility.zIndex}</div>
        `;
    }
    
    // Update styles display based on category
    function updateStylesDisplay(category) {
        if (!selectedElement || !inspectorPanel) return;
        
        const stylesDiv = inspectorPanel.querySelector('#computed-styles');
        const styles = getComputedStyles(selectedElement, category);
        
        let html = '';
        const entries = Object.entries(styles);
        
        if (entries.length === 0) {
            html = '<div style="color: #666;">No relevant styles found</div>';
        } else {
            // Limit to first 20 entries for performance
            entries.slice(0, 20).forEach(([prop, value]) => {
                html += `<div><span style="color: #FFC107;">${prop}:</span> ${value}</div>`;
            });
            if (entries.length > 20) {
                html += `<div style="color: #666; font-style: italic;">... and ${entries.length - 20} more</div>`;
            }
        }
        
        stylesDiv.innerHTML = html;
    }
    
    // Highlight element
    function highlightElement(element) {
        if (!highlightOverlay || !element) return;
        
        const rect = element.getBoundingClientRect();
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        highlightOverlay.style.display = 'block';
        highlightOverlay.style.left = (rect.left + scrollX) + 'px';
        highlightOverlay.style.top = (rect.top + scrollY) + 'px';
        highlightOverlay.style.width = rect.width + 'px';
        highlightOverlay.style.height = rect.height + 'px';
        
        // Update labels
        const topLabel = highlightOverlay.querySelector('.inspector-label-top');
        const sideLabel = highlightOverlay.querySelector('.inspector-label-side');
        
        topLabel.textContent = `<${element.tagName.toLowerCase()}>${element.id ? '#' + element.id : ''}`;
        sideLabel.textContent = `${Math.round(rect.width)}×${Math.round(rect.height)}`;
    }
    
    // Copy to clipboard
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'absolute';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand('copy');
            textArea.remove();
            return success ? Promise.resolve() : Promise.reject();
        }
    }
    
    // Update status message
    function updateStatus(message, isError = false) {
        if (!inspectorPanel) return;
        const status = inspectorPanel.querySelector('#inspector-status');
        status.textContent = message;
        status.style.background = isError ? 'rgba(244, 67, 54, 0.3)' : 'rgba(255,255,255,0.1)';
        
        if (!isError) {
            setTimeout(() => {
                status.style.background = 'rgba(255,255,255,0.1)';
            }, 3000);
        }
    }
    
    // Mouse event handlers
    function handleMouseOver(e) {
        if (!inspectorActive) return;
        e.preventDefault();
        e.stopPropagation();
        
        const element = e.target;
        if (element && element !== inspectorPanel && !inspectorPanel.contains(element)) {
            highlightElement(element);
            updateElementInfo(element);
        }
    }
    
    function handleMouseOut(e) {
        if (!inspectorActive) return;
        if (highlightOverlay) {
            highlightOverlay.style.display = 'none';
        }
    }
    
    function handleClick(e) {
        if (!inspectorActive) return;
        e.preventDefault();
        e.stopPropagation();
        
        const element = e.target;
        if (element && element !== inspectorPanel && !inspectorPanel.contains(element)) {
            selectedElement = element;
            updateStatus(`Selected: <${element.tagName.toLowerCase()}>`);
        }
    }
    
    // Enable/disable inspector
    function toggleInspector() {
        inspectorActive = !inspectorActive;
        const button = inspectorPanel.querySelector('#toggle-inspector');
        
        if (inspectorActive) {
            document.addEventListener('mouseover', handleMouseOver, true);
            document.addEventListener('mouseout', handleMouseOut, true);
            document.addEventListener('click', handleClick, true);
            
            button.textContent = '🚫 Disable';
            button.style.background = 'rgba(244, 67, 54, 0.8)';
            updateStatus('Inspector active - hover over elements to inspect');
        } else {
            document.removeEventListener('mouseover', handleMouseOver, true);
            document.removeEventListener('mouseout', handleMouseOut, true);
            document.removeEventListener('click', handleClick, true);
            
            if (highlightOverlay) {
                highlightOverlay.style.display = 'none';
            }
            
            button.textContent = '🎯 Enable';
            button.style.background = 'rgba(76, 175, 80, 0.8)';
            updateStatus('Inspector disabled - click Enable to start');
        }
    }
    
    // Initialize inspector
    function initializeInspector() {
        if (inspectorPanel) {
            inspectorPanel.remove();
        }
        
        if (highlightOverlay) {
            highlightOverlay.remove();
        }
        
        inspectorPanel = createInspectorPanel();
        highlightOverlay = createHighlightOverlay();
        
        document.body.appendChild(inspectorPanel);
        document.body.appendChild(highlightOverlay);
        
        // Event listeners
        inspectorPanel.querySelector('#close-inspector').onclick = closeInspector;
        inspectorPanel.querySelector('#toggle-inspector').onclick = toggleInspector;
        
        // Style category buttons
        inspectorPanel.querySelectorAll('.style-category').forEach(button => {
            button.onclick = () => {
                const category = button.dataset.category;
                updateStylesDisplay(category);
                
                // Update button states
                inspectorPanel.querySelectorAll('.style-category').forEach(btn => {
                    btn.style.opacity = '0.7';
                });
                button.style.opacity = '1';
            };
        });
        
        // Quick action buttons
        inspectorPanel.querySelector('#copy-selector').onclick = () => {
            if (selectedElement) {
                const selector = generateCSSSelector(selectedElement);
                copyToClipboard(selector).then(() => {
                    updateStatus('CSS selector copied to clipboard');
                }).catch(() => {
                    updateStatus('Failed to copy selector', true);
                });
            }
        };
        
        inspectorPanel.querySelector('#copy-xpath').onclick = () => {
            if (selectedElement) {
                const xpath = generateXPath(selectedElement);
                copyToClipboard(xpath).then(() => {
                    updateStatus('XPath copied to clipboard');
                }).catch(() => {
                    updateStatus('Failed to copy XPath', true);
                });
            }
        };
        
        inspectorPanel.querySelector('#show-parents').onclick = () => {
            if (selectedElement) {
                let parent = selectedElement.parentElement;
                let parents = [];
                while (parent && parent !== document.body) {
                    parents.push(`<${parent.tagName.toLowerCase()}>${parent.id ? '#' + parent.id : ''}${parent.className ? '.' + parent.className.split(' ')[0] : ''}`);
                    parent = parent.parentElement;
                }
                updateStatus(`Parents: ${parents.join(' > ') || 'none'}`);
            }
        };
        
        inspectorPanel.querySelector('#show-children').onclick = () => {
            if (selectedElement) {
                const children = Array.from(selectedElement.children).map(child => 
                    `<${child.tagName.toLowerCase()}>${child.id ? '#' + child.id : ''}`
                );
                updateStatus(`Children (${children.length}): ${children.slice(0, 5).join(', ')}${children.length > 5 ? '...' : ''}`);
            }
        };
        
        inspectorPanel.querySelector('#hide-element').onclick = () => {
            if (selectedElement) {
                originalOutlines.set(selectedElement, selectedElement.style.outline);
                selectedElement.style.display = 'none';
                updateStatus(`Element hidden`);
                
                // Provide unhide option
                setTimeout(() => {
                    if (confirm('Unhide element?')) {
                        selectedElement.style.display = '';
                        updateStatus('Element restored');
                    }
                }, 2000);
            }
        };
        
        inspectorPanel.querySelector('#highlight-similar').onclick = () => {
            if (selectedElement) {
                const tag = selectedElement.tagName.toLowerCase();
                const className = selectedElement.className;
                
                let selector = tag;
                if (className) {
                    selector += '.' + className.split(' ')[0];
                }
                
                const similar = document.querySelectorAll(selector);
                similar.forEach(el => {
                    originalOutlines.set(el, el.style.outline);
                    el.style.outline = '3px solid #ff6b6b';
                });
                
                updateStatus(`Highlighted ${similar.length} similar elements`);
                
                // Auto-remove after 5 seconds
                setTimeout(() => {
                    similar.forEach(el => {
                        el.style.outline = originalOutlines.get(el) || '';
                    });
                    updateStatus('Highlights removed');
                }, 5000);
            }
        };
        
        updateStatus('DOM Inspector ready - click Enable to start');
    }
    
    // Close inspector
    function closeInspector() {
        if (inspectorActive) {
            toggleInspector();
        }
        
        // Restore any modified elements
        originalOutlines.forEach((originalOutline, element) => {
            element.style.outline = originalOutline;
        });
        originalOutlines.clear();
        
        if (inspectorPanel) {
            inspectorPanel.remove();
            inspectorPanel = null;
        }
        
        if (highlightOverlay) {
            highlightOverlay.remove();
            highlightOverlay = null;
        }
        
        selectedElement = null;
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (inspectorPanel) {
            if (e.key === 'Escape') {
                closeInspector();
            } else if (e.key === 'i' && e.ctrlKey) {
                e.preventDefault();
                toggleInspector();
            }
        }
    });
    
    // Initialize
    initializeInspector();
})();
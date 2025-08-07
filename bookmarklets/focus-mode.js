// Focus Mode Bookmarklet
// Hide distractions and focus on the main content of any webpage

javascript:(function(){
    let focusModeActive = false;
    let hiddenElements = [];
    let originalStyles = new Map();
    let focusOverlay = null;
    let focusPanel = null;
    
    // Common distraction selectors
    const distractionSelectors = [
        // Ads and promotional content
        '[class*="ad-"]', '[id*="ad-"]', '[class*="advertisement"]', '[id*="advertisement"]',
        '[class*="banner"]', '[id*="banner"]', '.ad', '.ads', '.advert', '.advertising',
        
        // Social media widgets
        '[class*="social"]', '[id*="social"]', '[class*="share"]', '[id*="share"]',
        '[class*="follow"]', '[id*="follow"]', '.social-media', '.social-share',
        
        // Comments and discussions
        '[class*="comment"]', '[id*="comment"]', '[class*="discussion"]', '[id*="discussion"]',
        '.comments', '.discussion', '.disqus',
        
        // Sidebars and secondary content
        '[class*="sidebar"]', '[id*="sidebar"]', '[class*="aside"]', 'aside',
        '.sidebar', '.side-bar', '.widget-area',
        
        // Navigation elements
        '[class*="navigation"]', '[id*="navigation"]', '[class*="menu"]', '[id*="menu"]',
        '[class*="navbar"]', '[id*="navbar"]', 'nav:not([class*="breadcrumb"])',
        
        // Headers and footers (optional)
        'header:not([class*="article"])', 'footer', '[class*="header"]:not([class*="article"])',
        '[class*="footer"]', '[id*="header"]:not([id*="article"])', '[id*="footer"]',
        
        // Cookie notices and popups
        '[class*="cookie"]', '[id*="cookie"]', '[class*="gdpr"]', '[id*="gdpr"]',
        '[class*="consent"]', '[id*="consent"]', '[class*="notice"]', '[class*="popup"]',
        '[class*="modal"]', '[class*="overlay"]',
        
        // Related content and suggestions
        '[class*="related"]', '[id*="related"]', '[class*="suggest"]', '[id*="suggest"]',
        '[class*="recommend"]', '[id*="recommend"]', '.related-posts', '.suggestions'
    ];
    
    // Content selectors (main content areas)
    const contentSelectors = [
        'main', '[role="main"]', '#main', '.main',
        'article', '[role="article"]', '.article', '.post', '.content',
        '.entry', '.entry-content', '.post-content', '.article-content',
        '.story', '.story-content', '.news-content', '.blog-post'
    ];
    
    // Create focus mode panel
    function createFocusPanel() {
        const panel = document.createElement('div');
        panel.id = 'focus-mode-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 12px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            min-width: 280px;
            transition: all 0.3s ease;
        `;
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 18px; color: #fff;">🎯 Focus Mode</h3>
                <button id="close-focus-mode" style="background: rgba(220, 53, 69, 0.8); color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; backdrop-filter: blur(5px);">✕</button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <button id="toggle-focus" style="background: rgba(40, 167, 69, 0.8); color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; width: 100%; font-weight: bold; backdrop-filter: blur(5px); margin-bottom: 10px;">
                    🔍 Enable Focus Mode
                </button>
                <button id="auto-focus" style="background: rgba(0, 123, 255, 0.8); color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; width: 100%; font-weight: bold; backdrop-filter: blur(5px);">
                    ✨ Auto Focus Content
                </button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 8px; color: #ccc;">Quick Actions:</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <button class="focus-action" data-action="hide-ads" style="background: rgba(255, 193, 7, 0.8); color: #000; border: none; padding: 8px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; backdrop-filter: blur(5px);">Hide Ads</button>
                    <button class="focus-action" data-action="hide-social" style="background: rgba(23, 162, 184, 0.8); color: white; border: none; padding: 8px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; backdrop-filter: blur(5px);">Hide Social</button>
                    <button class="focus-action" data-action="hide-nav" style="background: rgba(108, 117, 125, 0.8); color: white; border: none; padding: 8px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; backdrop-filter: blur(5px);">Hide Nav</button>
                    <button class="focus-action" data-action="hide-sidebar" style="background: rgba(111, 66, 193, 0.8); color: white; border: none; padding: 8px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; backdrop-filter: blur(5px);">Hide Sidebar</button>
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 8px; color: #ccc;">Reading Settings:</div>
                <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                    <button id="increase-text" style="background: rgba(40, 167, 69, 0.8); color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; backdrop-filter: blur(5px);">A+</button>
                    <button id="decrease-text" style="background: rgba(220, 53, 69, 0.8); color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; backdrop-filter: blur(5px);">A-</button>
                    <button id="dark-mode" style="background: rgba(52, 58, 64, 0.8); color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; backdrop-filter: blur(5px);">🌙 Dark</button>
                    <button id="reset-text" style="background: rgba(108, 117, 125, 0.8); color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; backdrop-filter: blur(5px);">Reset</button>
                </div>
            </div>
            
            <div id="focus-status" style="font-size: 12px; color: #ccc; text-align: center; padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 6px;">
                Ready to focus. Click a button above to start.
            </div>
        `;
        
        return panel;
    }
    
    // Hide elements by selector
    function hideElementsBySelector(selectors, reason = 'hidden') {
        let count = 0;
        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (!hiddenElements.includes(element)) {
                        // Store original styles
                        originalStyles.set(element, {
                            display: element.style.display || '',
                            visibility: element.style.visibility || '',
                            opacity: element.style.opacity || ''
                        });
                        
                        element.style.display = 'none';
                        hiddenElements.push(element);
                        element.setAttribute('data-focus-mode', reason);
                        count++;
                    }
                });
            } catch (e) {
                // Ignore invalid selectors
            }
        });
        return count;
    }
    
    // Show all hidden elements
    function showAllHiddenElements() {
        hiddenElements.forEach(element => {
            const originalStyle = originalStyles.get(element);
            if (originalStyle) {
                element.style.display = originalStyle.display;
                element.style.visibility = originalStyle.visibility;
                element.style.opacity = originalStyle.opacity;
            }
            element.removeAttribute('data-focus-mode');
        });
        
        hiddenElements = [];
        originalStyles.clear();
    }
    
    // Auto focus on main content
    function autoFocusContent() {
        let mainContent = null;
        
        // Try to find main content
        for (const selector of contentSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                mainContent = element;
                break;
            }
        }
        
        if (mainContent) {
            // Hide everything except main content and its parents
            const allElements = Array.from(document.body.querySelectorAll('*'));
            let focused = 0;
            
            allElements.forEach(element => {
                if (!mainContent.contains(element) && !element.contains(mainContent) && element !== mainContent) {
                    // Don't hide essential elements
                    const tagName = element.tagName.toLowerCase();
                    if (!['html', 'head', 'body', 'script', 'style', 'meta', 'title'].includes(tagName)) {
                        if (!hiddenElements.includes(element) && element !== focusPanel) {
                            originalStyles.set(element, {
                                display: element.style.display || '',
                                visibility: element.style.visibility || '',
                                opacity: element.style.opacity || ''
                            });
                            
                            element.style.opacity = '0.1';
                            element.style.pointerEvents = 'none';
                            hiddenElements.push(element);
                            element.setAttribute('data-focus-mode', 'auto-focused');
                            focused++;
                        }
                    }
                }
            });
            
            updateStatus(`Auto-focused on main content. Dimmed ${focused} elements.`);
            return focused;
        } else {
            updateStatus('Could not identify main content. Try manual focus instead.');
            return 0;
        }
    }
    
    // Update status message
    function updateStatus(message) {
        if (focusPanel) {
            const status = focusPanel.querySelector('#focus-status');
            if (status) {
                status.textContent = message;
            }
        }
    }
    
    // Text size adjustment
    let currentTextScale = 1;
    function adjustTextSize(delta) {
        currentTextScale = Math.max(0.5, Math.min(2, currentTextScale + delta));
        
        // Apply to common content elements
        const textElements = document.querySelectorAll('p, article, .content, .post, .entry, main, h1, h2, h3, h4, h5, h6, li, div');
        textElements.forEach(element => {
            element.style.fontSize = (currentTextScale * 100) + '%';
        });
        
        updateStatus(`Text size: ${Math.round(currentTextScale * 100)}%`);
    }
    
    // Toggle dark mode
    let darkModeActive = false;
    function toggleDarkMode() {
        if (!darkModeActive) {
            document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
            document.querySelectorAll('img, video, iframe, svg').forEach(el => {
                el.style.filter = 'invert(1) hue-rotate(180deg)';
            });
            darkModeActive = true;
            updateStatus('Dark mode enabled');
        } else {
            document.documentElement.style.filter = '';
            document.querySelectorAll('img, video, iframe, svg').forEach(el => {
                el.style.filter = '';
            });
            darkModeActive = false;
            updateStatus('Dark mode disabled');
        }
    }
    
    // Initialize focus mode
    function initializeFocusMode() {
        if (focusPanel) {
            focusPanel.remove();
        }
        
        focusPanel = createFocusPanel();
        document.body.appendChild(focusPanel);
        
        // Event listeners
        focusPanel.querySelector('#close-focus-mode').onclick = function() {
            exitFocusMode();
        };
        
        focusPanel.querySelector('#toggle-focus').onclick = function() {
            if (!focusModeActive) {
                enableFocusMode();
            } else {
                disableFocusMode();
            }
        };
        
        focusPanel.querySelector('#auto-focus').onclick = function() {
            disableFocusMode();
            autoFocusContent();
            focusModeActive = true;
            this.parentElement.querySelector('#toggle-focus').textContent = '🔓 Disable Focus Mode';
            this.parentElement.querySelector('#toggle-focus').style.background = 'rgba(220, 53, 69, 0.8)';
        };
        
        // Quick actions
        focusPanel.querySelectorAll('.focus-action').forEach(button => {
            button.onclick = function() {
                const action = this.dataset.action;
                let selectors = [];
                let count = 0;
                
                switch(action) {
                    case 'hide-ads':
                        selectors = ['[class*="ad-"]', '[id*="ad-"]', '.ad', '.ads', '.advert'];
                        break;
                    case 'hide-social':
                        selectors = ['[class*="social"]', '[class*="share"]', '[class*="follow"]'];
                        break;
                    case 'hide-nav':
                        selectors = ['nav', '[class*="nav"]', '[class*="menu"]'];
                        break;
                    case 'hide-sidebar':
                        selectors = ['[class*="sidebar"]', 'aside', '.sidebar'];
                        break;
                }
                
                count = hideElementsBySelector(selectors, action);
                updateStatus(`${action.replace('-', ' ')}: ${count} elements hidden`);
            };
        });
        
        // Text size controls
        focusPanel.querySelector('#increase-text').onclick = () => adjustTextSize(0.1);
        focusPanel.querySelector('#decrease-text').onclick = () => adjustTextSize(-0.1);
        focusPanel.querySelector('#reset-text').onclick = () => {
            currentTextScale = 1;
            document.querySelectorAll('*').forEach(el => el.style.fontSize = '');
            updateStatus('Text size reset to normal');
        };
        focusPanel.querySelector('#dark-mode').onclick = toggleDarkMode;
        
        updateStatus('Focus mode panel ready. Choose an option above.');
    }
    
    // Enable full focus mode
    function enableFocusMode() {
        const count = hideElementsBySelector(distractionSelectors, 'focus-mode');
        focusModeActive = true;
        
        const button = focusPanel.querySelector('#toggle-focus');
        button.textContent = '🔓 Disable Focus Mode';
        button.style.background = 'rgba(220, 53, 69, 0.8)';
        
        updateStatus(`Focus mode enabled. ${count} distractions hidden.`);
    }
    
    // Disable focus mode
    function disableFocusMode() {
        showAllHiddenElements();
        focusModeActive = false;
        
        const button = focusPanel.querySelector('#toggle-focus');
        button.textContent = '🔍 Enable Focus Mode';
        button.style.background = 'rgba(40, 167, 69, 0.8)';
        
        updateStatus('Focus mode disabled. All elements restored.');
    }
    
    // Exit focus mode completely
    function exitFocusMode() {
        showAllHiddenElements();
        
        // Reset text size
        currentTextScale = 1;
        document.querySelectorAll('*').forEach(el => el.style.fontSize = '');
        
        // Reset dark mode
        if (darkModeActive) {
            toggleDarkMode();
        }
        
        if (focusPanel) {
            focusPanel.remove();
            focusPanel = null;
        }
        
        focusModeActive = false;
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (focusPanel) {
            if (e.key === 'Escape') {
                exitFocusMode();
            } else if (e.key === 'f' && e.ctrlKey) {
                e.preventDefault();
                if (!focusModeActive) {
                    enableFocusMode();
                } else {
                    disableFocusMode();
                }
            }
        }
    });
    
    // Initialize
    initializeFocusMode();
})();
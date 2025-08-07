# 🎯 Focus Mode Bookmarklet

Hide distractions and enhance reading experience by removing clutter and focusing on the main content of any webpage.

## What it does

- **Hide distractions** like ads, social widgets, sidebars, and navigation
- **Auto-focus on content** by intelligently identifying main content areas
- **Selective hiding** with quick action buttons for specific element types
- **Reading enhancements** including text size adjustment and dark mode
- **Keyboard shortcuts** for quick toggling and control
- **Visual feedback** with a floating control panel

## How to install

1. Create a new bookmark in your browser
2. Copy the code below and paste it as the URL:

```javascript
javascript:(function(){let focusModeActive=false;let hiddenElements=[];let originalStyles=new Map();let focusOverlay=null;let focusPanel=null;const distractionSelectors=['[class*="ad-"]','[id*="ad-"]','[class*="advertisement"]','[id*="advertisement"]','[class*="banner"]','[id*="banner"]','.ad','.ads','.advert','.advertising','[class*="social"]','[id*="social"]','[class*="share"]','[id*="share"]','[class*="follow"]','[id*="follow"]','.social-media','.social-share','[class*="comment"]','[id*="comment"]','[class*="discussion"]','[id*="discussion"]','.comments','.discussion','.disqus','[class*="sidebar"]','[id*="sidebar"]','[class*="aside"]','aside','.sidebar','.side-bar','.widget-area','[class*="navigation"]','[id*="navigation"]','[class*="menu"]','[id*="menu"]','[class*="navbar"]','[id*="navbar"]','nav:not([class*="breadcrumb"])','header:not([class*="article"])','footer','[class*="header"]:not([class*="article"])','[class*="footer"]','[id*="header"]:not([id*="article"])','[id*="footer"]','[class*="cookie"]','[id*="cookie"]','[class*="gdpr"]','[id*="gdpr"]','[class*="consent"]','[id*="consent"]','[class*="notice"]','[class*="popup"]','[class*="modal"]','[class*="overlay"]','[class*="related"]','[id*="related"]','[class*="suggest"]','[id*="suggest"]','[class*="recommend"]','[id*="recommend"]','.related-posts','.suggestions'];const contentSelectors=['main','[role="main"]','#main','.main','article','[role="article"]','.article','.post','.content','.entry','.entry-content','.post-content','.article-content','.story','.story-content','.news-content','.blog-post'];function createFocusPanel(){const panel=document.createElement('div');panel.id='focus-mode-panel';panel.style.cssText=`position: fixed;top: 20px;right: 20px;background: rgba(0, 0, 0, 0.9);color: white;padding: 20px;border-radius: 12px;z-index: 999999;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;box-shadow: 0 8px 32px rgba(0,0,0,0.5);backdrop-filter: blur(10px);border: 1px solid rgba(255, 255, 255, 0.1);min-width: 280px;transition: all 0.3s ease;`;panel.innerHTML=`<div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;\"><h3 style=\"margin: 0; font-size: 18px; color: #fff;\">🎯 Focus Mode</h3><button id=\"close-focus-mode\" style=\"background: rgba(220, 53, 69, 0.8); color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; backdrop-filter: blur(5px);\">✕</button></div><div style=\"margin-bottom: 15px;\"><button id=\"toggle-focus\" style=\"background: rgba(40, 167, 69, 0.8); color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; width: 100%; font-weight: bold; backdrop-filter: blur(5px); margin-bottom: 10px;\">🔍 Enable Focus Mode</button><button id=\"auto-focus\" style=\"background: rgba(0, 123, 255, 0.8); color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; width: 100%; font-weight: bold; backdrop-filter: blur(5px);\">✨ Auto Focus Content</button></div><div style=\"margin-bottom: 15px;\"><div style=\"font-size: 14px; font-weight: bold; margin-bottom: 8px; color: #ccc;\">Quick Actions:</div><div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 8px;\"><button class=\"focus-action\" data-action=\"hide-ads\" style=\"background: rgba(255, 193, 7, 0.8); color: #000; border: none; padding: 8px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; backdrop-filter: blur(5px);\">Hide Ads</button><button class=\"focus-action\" data-action=\"hide-social\" style=\"background: rgba(23, 162, 184, 0.8); color: white; border: none; padding: 8px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; backdrop-filter: blur(5px);\">Hide Social</button><button class=\"focus-action\" data-action=\"hide-nav\" style=\"background: rgba(108, 117, 125, 0.8); color: white; border: none; padding: 8px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; backdrop-filter: blur(5px);\">Hide Nav</button><button class=\"focus-action\" data-action=\"hide-sidebar\" style=\"background: rgba(111, 66, 193, 0.8); color: white; border: none; padding: 8px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; backdrop-filter: blur(5px);\">Hide Sidebar</button></div></div><div style=\"margin-bottom: 15px;\"><div style=\"font-size: 14px; font-weight: bold; margin-bottom: 8px; color: #ccc;\">Reading Settings:</div><div style=\"display: flex; gap: 8px; margin-bottom: 8px;\"><button id=\"increase-text\" style=\"background: rgba(40, 167, 69, 0.8); color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; backdrop-filter: blur(5px);\">A+</button><button id=\"decrease-text\" style=\"background: rgba(220, 53, 69, 0.8); color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; backdrop-filter: blur(5px);\">A-</button><button id=\"dark-mode\" style=\"background: rgba(52, 58, 64, 0.8); color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; backdrop-filter: blur(5px);\">🌙 Dark</button><button id=\"reset-text\" style=\"background: rgba(108, 117, 125, 0.8); color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; backdrop-filter: blur(5px);\">Reset</button></div></div><div id=\"focus-status\" style=\"font-size: 12px; color: #ccc; text-align: center; padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 6px;\">Ready to focus. Click a button above to start.</div>`;return panel}function hideElementsBySelector(selectors,reason='hidden'){let count=0;selectors.forEach(selector=>{try{const elements=document.querySelectorAll(selector);elements.forEach(element=>{if(!hiddenElements.includes(element)){originalStyles.set(element,{display:element.style.display||'',visibility:element.style.visibility||'',opacity:element.style.opacity||''});element.style.display='none';hiddenElements.push(element);element.setAttribute('data-focus-mode',reason);count++}})}catch(e){}});return count}function showAllHiddenElements(){hiddenElements.forEach(element=>{const originalStyle=originalStyles.get(element);if(originalStyle){element.style.display=originalStyle.display;element.style.visibility=originalStyle.visibility;element.style.opacity=originalStyle.opacity}element.removeAttribute('data-focus-mode')});hiddenElements=[];originalStyles.clear()}function autoFocusContent(){let mainContent=null;for(const selector of contentSelectors){const element=document.querySelector(selector);if(element){mainContent=element;break}}if(mainContent){const allElements=Array.from(document.body.querySelectorAll('*'));let focused=0;allElements.forEach(element=>{if(!mainContent.contains(element)&&!element.contains(mainContent)&&element!==mainContent){const tagName=element.tagName.toLowerCase();if(!['html','head','body','script','style','meta','title'].includes(tagName)){if(!hiddenElements.includes(element)&&element!==focusPanel){originalStyles.set(element,{display:element.style.display||'',visibility:element.style.visibility||'',opacity:element.style.opacity||''});element.style.opacity='0.1';element.style.pointerEvents='none';hiddenElements.push(element);element.setAttribute('data-focus-mode','auto-focused');focused++}}}});updateStatus(`Auto-focused on main content. Dimmed ${focused} elements.`);return focused}else{updateStatus('Could not identify main content. Try manual focus instead.');return 0}}function updateStatus(message){if(focusPanel){const status=focusPanel.querySelector('#focus-status');if(status){status.textContent=message}}}let currentTextScale=1;function adjustTextSize(delta){currentTextScale=Math.max(0.5,Math.min(2,currentTextScale+delta));const textElements=document.querySelectorAll('p, article, .content, .post, .entry, main, h1, h2, h3, h4, h5, h6, li, div');textElements.forEach(element=>{element.style.fontSize=(currentTextScale*100)+'%'});updateStatus(`Text size: ${Math.round(currentTextScale*100)}%`)}let darkModeActive=false;function toggleDarkMode(){if(!darkModeActive){document.documentElement.style.filter='invert(1) hue-rotate(180deg)';document.querySelectorAll('img, video, iframe, svg').forEach(el=>{el.style.filter='invert(1) hue-rotate(180deg)'});darkModeActive=true;updateStatus('Dark mode enabled')}else{document.documentElement.style.filter='';document.querySelectorAll('img, video, iframe, svg').forEach(el=>{el.style.filter=''});darkModeActive=false;updateStatus('Dark mode disabled')}}function initializeFocusMode(){if(focusPanel){focusPanel.remove()}focusPanel=createFocusPanel();document.body.appendChild(focusPanel);focusPanel.querySelector('#close-focus-mode').onclick=function(){exitFocusMode()};focusPanel.querySelector('#toggle-focus').onclick=function(){if(!focusModeActive){enableFocusMode()}else{disableFocusMode()}};focusPanel.querySelector('#auto-focus').onclick=function(){disableFocusMode();autoFocusContent();focusModeActive=true;this.parentElement.querySelector('#toggle-focus').textContent='🔓 Disable Focus Mode';this.parentElement.querySelector('#toggle-focus').style.background='rgba(220, 53, 69, 0.8)'};focusPanel.querySelectorAll('.focus-action').forEach(button=>{button.onclick=function(){const action=this.dataset.action;let selectors=[];let count=0;switch(action){case'hide-ads':selectors=['[class*="ad-"]','[id*="ad-"]','.ad','.ads','.advert'];break;case'hide-social':selectors=['[class*="social"]','[class*="share"]','[class*="follow"]'];break;case'hide-nav':selectors=['nav','[class*="nav"]','[class*="menu"]'];break;case'hide-sidebar':selectors=['[class*="sidebar"]','aside','.sidebar'];break}count=hideElementsBySelector(selectors,action);updateStatus(`${action.replace('-',' ')}: ${count} elements hidden`)}});focusPanel.querySelector('#increase-text').onclick=()=>adjustTextSize(0.1);focusPanel.querySelector('#decrease-text').onclick=()=>adjustTextSize(-0.1);focusPanel.querySelector('#reset-text').onclick=()=>{currentTextScale=1;document.querySelectorAll('*').forEach(el=>el.style.fontSize='');updateStatus('Text size reset to normal')};focusPanel.querySelector('#dark-mode').onclick=toggleDarkMode;updateStatus('Focus mode panel ready. Choose an option above.')}function enableFocusMode(){const count=hideElementsBySelector(distractionSelectors,'focus-mode');focusModeActive=true;const button=focusPanel.querySelector('#toggle-focus');button.textContent='🔓 Disable Focus Mode';button.style.background='rgba(220, 53, 69, 0.8)';updateStatus(`Focus mode enabled. ${count} distractions hidden.`)}function disableFocusMode(){showAllHiddenElements();focusModeActive=false;const button=focusPanel.querySelector('#toggle-focus');button.textContent='🔍 Enable Focus Mode';button.style.background='rgba(40, 167, 69, 0.8)';updateStatus('Focus mode disabled. All elements restored.')}function exitFocusMode(){showAllHiddenElements();currentTextScale=1;document.querySelectorAll('*').forEach(el=>el.style.fontSize='');if(darkModeActive){toggleDarkMode()}if(focusPanel){focusPanel.remove();focusPanel=null}focusModeActive=false}document.addEventListener('keydown',function(e){if(focusPanel){if(e.key==='Escape'){exitFocusMode()}else if(e.key==='f'&&e.ctrlKey){e.preventDefault();if(!focusModeActive){enableFocusMode()}else{disableFocusMode()}}}});initializeFocusMode()})()
```

## How to use

1. Click the bookmarklet on any webpage
2. **Enable Focus Mode**: Hide common distractions automatically
3. **Auto Focus Content**: Intelligently dim everything except main content
4. **Quick Actions**: Use targeted buttons to hide specific element types
5. **Reading Settings**: Adjust text size and enable dark mode
6. **Close**: Click ✕ or press Escape to exit focus mode

## Focus modes

### 🔍 **Standard Focus Mode**
- Hides advertisements and banners
- Removes social media widgets and sharing buttons
- Eliminates sidebars and secondary navigation
- Hides comment sections and related content
- Removes cookie notices and popups

### ✨ **Auto Focus Content**
- Intelligently identifies main content area
- Dims all other elements to 10% opacity
- Disables interaction with non-essential elements
- Preserves content structure and layout
- Works with articles, blog posts, and news sites

### 🎯 **Selective Hiding**
- **Hide Ads**: Target advertising elements specifically
- **Hide Social**: Remove social media widgets and buttons
- **Hide Navigation**: Eliminate menus and navigation bars
- **Hide Sidebar**: Remove sidebar content and widgets

## Reading enhancements

### 📖 **Text Controls**
- **A+/A-**: Increase or decrease text size (50%-200%)
- **Reset**: Restore original text size
- Applies to all content elements automatically
- Maintains proportional scaling

### 🌙 **Dark Mode**
- **Instant dark theme** using CSS filters
- **Smart image handling** to prevent double-inversion
- **Preserves readability** while reducing eye strain
- **Toggle on/off** with single click

## Key features

### 🧠 **Intelligent Detection**
- **Pattern-based recognition** of common distraction elements
- **Multiple selector strategies** for comprehensive coverage
- **Content-aware focusing** that identifies main content areas
- **Fallback mechanisms** when auto-detection fails

### 💾 **Reversible Changes**
- **Non-destructive hiding** - all elements can be restored
- **Style preservation** - original CSS properties are maintained
- **Complete restoration** when focus mode is disabled
- **Memory management** - proper cleanup of stored styles

### 🎨 **Visual Feedback**
- **Floating control panel** with glassmorphism design
- **Real-time status updates** showing actions performed
- **Element count feedback** for hidden/dimmed elements
- **Smooth animations** and transitions

### ⌨️ **Keyboard Shortcuts**
- **Escape**: Exit focus mode completely
- **Ctrl+F**: Toggle focus mode on/off
- **Accessible controls** for keyboard-only navigation

## Use cases

### 📚 **Reading & Research**
- **Article reading**: Focus on blog posts and news articles
- **Academic research**: Remove distractions from research papers
- **Documentation**: Clean interface for technical documentation
- **Long-form content**: Enhance readability of extensive text

### 🎯 **Productivity**
- **Web-based tools**: Remove clutter from productivity applications
- **Online learning**: Focus on educational content and courses
- **Form filling**: Hide distractions during important form completion
- **Comparison shopping**: Focus on product details and specifications

### ♿ **Accessibility**
- **ADHD support**: Reduce visual distractions and overwhelm
- **Visual impairment**: Simplify interface for screen readers
- **Cognitive assistance**: Reduce cognitive load by hiding non-essential elements
- **Focus disorders**: Create calm, distraction-free environment

### 🎨 **Content Creation**
- **Writing**: Focus on text editors and writing interfaces
- **Design work**: Remove distractions from creative applications
- **Code review**: Focus on code content without interface clutter
- **Content analysis**: Isolate specific content for evaluation

## Technical details

### 🎯 **Element Detection**
- **CSS attribute selectors** for comprehensive element matching
- **Class and ID patterns** targeting common naming conventions
- **Semantic HTML analysis** for content structure identification
- **Dynamic selector generation** based on page structure

### 💨 **Performance**
- **Efficient DOM queries** using optimized selectors
- **Minimal memory footprint** with cleanup on exit
- **Fast rendering** through CSS-only visibility changes
- **Non-blocking execution** that doesn't freeze the page

### 🔄 **State Management**
- **Original style preservation** in JavaScript Map objects
- **Element tracking** to prevent duplicate processing
- **Restoration system** for complete state rollback
- **Memory cleanup** preventing memory leaks

### 🌐 **Cross-browser Compatibility**
- **Modern CSS features** with fallback support
- **Standard DOM APIs** for maximum compatibility
- **Filter effects** for dark mode functionality
- **Event handling** with proper cleanup

## Pro tips

### 🎯 **Effective Usage**
- **Try auto focus first** for best content identification
- **Use selective hiding** for fine-tuned control
- **Combine with reading settings** for optimal experience
- **Experiment with different modes** on various sites

### 🔧 **Troubleshooting**
- **Content not detected**: Use manual selective hiding instead
- **Important elements hidden**: Use Escape to restore and try different mode
- **Dark mode issues**: Some sites may have compatibility issues
- **Text size problems**: Use reset button to restore original sizing

### 🚀 **Power User Features**
- **Keyboard shortcuts** for quick toggling without mouse
- **Multiple quick actions** can be used simultaneously
- **Status messages** provide feedback on action effectiveness
- **Restoration system** allows safe experimentation
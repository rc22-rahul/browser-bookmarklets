# 🌙 Dark Mode Toggle Bookmarklet

Apply or remove a universal dark theme to any website with smooth animations.

## What it does

- Toggles dark mode on/off for any website
- Applies comprehensive dark styling to all elements
- Shows animated notification when toggling
- Preserves readability while reducing eye strain
- Works on sites that don't have native dark mode

## How to install
1. Create a new bookmark in your browser
2. Copy the code below and paste it as the URL:

```javascript
javascript:(function(){const darkModeId='bookmarklet-dark-mode';let darkModeStyle=document.getElementById(darkModeId);if(darkModeStyle){darkModeStyle.remove();showNotification('🌞 Dark mode disabled','#28a745')}else{const darkStyle=`* {background-color: #2b2b2b !important;color: #e8e6e3 !important;border-color: #444 !important;}a, a * {color: #4da6ff !important;}a:visited, a:visited * {color: #9d4edd !important;}img, video {opacity: 0.8 !important;filter: brightness(0.8) !important;}input, textarea, select {background-color: #3a3a3a !important;color: #e8e6e3 !important;border: 1px solid #666 !important;}button {background-color: #444 !important;color: #e8e6e3 !important;border: 1px solid #666 !important;}code, pre {background-color: #1e1e1e !important;color: #f0f0f0 !important;}[style*="background: white"],[style*="background-color: white"],[style*="background: #fff"],[style*="background-color: #fff"] {background-color: #2b2b2b !important;}`;darkModeStyle=document.createElement('style');darkModeStyle.id=darkModeId;darkModeStyle.innerHTML=darkStyle;document.head.appendChild(darkModeStyle);showNotification('🌙 Dark mode enabled','#007bff')}function showNotification(message,color){const notification=document.createElement('div');notification.style.cssText=`position: fixed;top: 20px;right: 20px;background: ${color};color: white;padding: 12px 20px;border-radius: 6px;font-family: Arial, sans-serif;font-size: 14px;z-index: 999999;box-shadow: 0 2px 10px rgba(0,0,0,0.3);opacity: 0;transform: translateX(100%);transition: all 0.3s ease;`;notification.textContent=message;document.body.appendChild(notification);setTimeout(()=>{notification.style.opacity='1';notification.style.transform='translateX(0)'},10);setTimeout(()=>{notification.style.opacity='0';notification.style.transform='translateX(100%)';setTimeout(()=>notification.remove(),300)},3000)}})())
```

## How to use

1. Click the bookmark on any website
2. Watch the animated notification appear
3. Click again to toggle back to light mode
4. Works instantly on any page

## Features

- **Universal compatibility**: Works on any website
- **Smart styling**: Handles different element types appropriately  
- **Visual feedback**: Animated notifications show current state
- **Preserve functionality**: Doesn't break interactive elements
- **Eye-friendly**: Reduces brightness for comfortable reading

## Use cases

- **Night browsing**: Reduce eye strain in dark environments
- **Battery saving**: Dark themes can save battery on OLED screens
- **Accessibility**: Better contrast for some visual conditions
- **Focus**: Dark backgrounds can improve text focus
- **Sites without dark mode**: Add dark theme to any website

## Technical details

- Uses CSS !important to override existing styles
- Preserves link colors with improved dark theme variants
- Reduces image/video brightness for better integration
- Handles forms and interactive elements appropriately
- Animated notifications with CSS transitions
- Unique ID prevents conflicts with multiple applications
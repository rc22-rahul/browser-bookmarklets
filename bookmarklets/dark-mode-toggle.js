// Dark Mode Toggle Bookmarklet
// Applies or removes a universal dark theme to any website

javascript:(function(){
    const darkModeId = 'bookmarklet-dark-mode';
    let darkModeStyle = document.getElementById(darkModeId);
    
    if (darkModeStyle) {
        // Remove dark mode
        darkModeStyle.remove();
        // Show notification
        showNotification('🌞 Dark mode disabled', '#28a745');
    } else {
        // Apply dark mode
        const darkStyle = `
            * {
                background-color: #2b2b2b !important;
                color: #e8e6e3 !important;
                border-color: #444 !important;
            }
            
            a, a * {
                color: #4da6ff !important;
            }
            
            a:visited, a:visited * {
                color: #9d4edd !important;
            }
            
            img, video {
                opacity: 0.8 !important;
                filter: brightness(0.8) !important;
            }
            
            input, textarea, select {
                background-color: #3a3a3a !important;
                color: #e8e6e3 !important;
                border: 1px solid #666 !important;
            }
            
            button {
                background-color: #444 !important;
                color: #e8e6e3 !important;
                border: 1px solid #666 !important;
            }
            
            code, pre {
                background-color: #1e1e1e !important;
                color: #f0f0f0 !important;
            }
            
            /* Preserve some light backgrounds for readability */
            [style*="background: white"], 
            [style*="background-color: white"],
            [style*="background: #fff"],
            [style*="background-color: #fff"] {
                background-color: #2b2b2b !important;
            }
        `;
        
        darkModeStyle = document.createElement('style');
        darkModeStyle.id = darkModeId;
        darkModeStyle.innerHTML = darkStyle;
        document.head.appendChild(darkModeStyle);
        
        // Show notification
        showNotification('🌙 Dark mode enabled', '#007bff');
    }
    
    function showNotification(message, color) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 999999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
})();
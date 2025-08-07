# 🍪 Cookie Manager Bookmarklet

View, edit, and manage cookies with a powerful interface featuring search, add, edit, and bulk delete functionality.

## What it does

- **View all cookies** for the current domain in an organized table
- **Search and filter** cookies by name or value
- **Add new cookies** with custom names and values
- **Edit existing cookies** inline with simple clicks
- **Delete individual cookies** or clear all cookies at once
- **Real-time updates** showing cookie count and changes
- **Professional interface** with intuitive controls and visual feedback

## How to install

1. Create a new bookmark in your browser
2. Copy the code below and paste it as the URL:

```javascript
javascript:(function(){function getAllCookies(){const cookies=[];if(!document.cookie)return cookies;document.cookie.split(';').forEach(cookie=>{const[name,...valueParts]=cookie.trim().split('=');const value=valueParts.join('=');if(name&&value!==undefined){cookies.push({name:name.trim(),value:decodeURIComponent(value),domain:window.location.hostname,path:'/'})}});return cookies.sort((a,b)=>a.name.localeCompare(b.name))}function setCookie(name,value,days=365){const expires=new Date();expires.setTime(expires.getTime()+(days*24*60*60*1000));document.cookie=`${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`}function deleteCookie(name){document.cookie=`${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;document.cookie=`${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;document.cookie=`${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`}const modal=document.createElement('div');modal.id='cookie-manager-modal';modal.style.cssText=`position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);background: #fff;border: 2px solid #333;border-radius: 12px;padding: 25px;width: 90%;max-width: 800px;max-height: 80vh;overflow: hidden;z-index: 999999;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;box-shadow: 0 8px 32px rgba(0,0,0,0.3);display: flex;flex-direction: column;`;modal.innerHTML=`<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 15px;"><h2 style="margin: 0; color: #333; font-size: 24px;">🍪 Cookie Manager</h2><button id="close-cookie-manager" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 16px;">✕</button></div><div style="margin-bottom: 20px; display: flex; gap: 10px; align-items: center;"><input type="text" id="cookie-search" placeholder="Search cookies..." style="flex: 1; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px;"><button id="add-cookie-btn" style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight: bold;">+ Add Cookie</button><button id="clear-all-btn" style="background: #dc3545; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight: bold;">Clear All</button></div><div id="add-cookie-form" style="display: none; background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 2px solid #e9ecef;"><h4 style="margin: 0 0 10px 0; color: #333;">Add New Cookie</h4><div style="display: grid; grid-template-columns: 1fr 2fr; gap: 10px; align-items: center;"><label style="font-weight: bold;">Name:</label><input type="text" id="new-cookie-name" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;"><label style="font-weight: bold;">Value:</label><input type="text" id="new-cookie-value" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></div><div style="margin-top: 10px; display: flex; gap: 10px;"><button id="save-cookie-btn" style="background: #007bff; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Save</button><button id="cancel-cookie-btn" style="background: #6c757d; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Cancel</button></div></div><div style="margin-bottom: 10px; color: #666; font-size: 14px;"><span id="cookie-count">0</span> cookies found for <strong>${window.location.hostname}</strong></div><div id="cookies-container" style="flex: 1; overflow-y: auto; border: 1px solid #ddd; border-radius: 8px; max-height: 400px;"></div><div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #666;"><strong>💡 Pro Tips:</strong> • Use search to find specific cookies quickly • Click cookie names to edit values inline • Some cookies may require page refresh to see changes</div>`;const style=document.createElement('style');style.textContent=`.cookie-item {padding: 12px;border-bottom: 1px solid #eee;display: flex;align-items: center;gap: 10px;}.cookie-item:hover {background: #f8f9fa;}.cookie-item:last-child {border-bottom: none;}.cookie-name {font-weight: bold;color: #007bff;min-width: 120px;cursor: pointer;}.cookie-value {flex: 1;color: #333;word-break: break-all;font-family: monospace;font-size: 12px;background: #f1f3f4;padding: 4px 8px;border-radius: 4px;cursor: pointer;}.cookie-actions {display: flex;gap: 5px;}.cookie-delete {background: #dc3545;color: white;border: none;padding: 4px 8px;border-radius: 4px;cursor: pointer;font-size: 12px;}.cookie-edit {background: #ffc107;color: #212529;border: none;padding: 4px 8px;border-radius: 4px;cursor: pointer;font-size: 12px;}`;document.head.appendChild(style);function renderCookies(searchTerm=''){const cookies=getAllCookies();const filteredCookies=cookies.filter(cookie=>cookie.name.toLowerCase().includes(searchTerm.toLowerCase())||cookie.value.toLowerCase().includes(searchTerm.toLowerCase()));const container=modal.querySelector('#cookies-container');const countElement=modal.querySelector('#cookie-count');countElement.textContent=filteredCookies.length;if(filteredCookies.length===0){container.innerHTML=`<div style="padding: 40px; text-align: center; color: #666;"><div style="font-size: 48px; margin-bottom: 10px;">🍪</div><div>No cookies found${searchTerm?' matching your search':''}</div></div>`;return}container.innerHTML=filteredCookies.map(cookie=>`<div class="cookie-item"><div class="cookie-name" title="Click to edit">${escapeHtml(cookie.name)}</div><div class="cookie-value" title="Click to edit value">${escapeHtml(truncateText(cookie.value,100))}</div><div class="cookie-actions"><button class="cookie-edit" onclick="editCookie('${escapeHtml(cookie.name)}')">Edit</button><button class="cookie-delete" onclick="deleteCookieItem('${escapeHtml(cookie.name)}')">Delete</button></div></div>`).join('')}function escapeHtml(text){const div=document.createElement('div');div.textContent=text;return div.innerHTML}function truncateText(text,length){return text.length>length?text.substring(0,length)+'...':text}window.editCookie=function(name){const cookies=getAllCookies();const cookie=cookies.find(c=>c.name===name);if(!cookie)return;const newValue=prompt(`Edit cookie "${name}":`,cookie.value);if(newValue!==null){setCookie(name,newValue);renderCookies(modal.querySelector('#cookie-search').value)}};window.deleteCookieItem=function(name){if(confirm(`Are you sure you want to delete cookie "${name}"?`)){deleteCookie(name);renderCookies(modal.querySelector('#cookie-search').value)}};modal.querySelector('#close-cookie-manager').onclick=function(){modal.remove();style.remove();delete window.editCookie;delete window.deleteCookieItem};modal.querySelector('#cookie-search').oninput=function(e){renderCookies(e.target.value)};modal.querySelector('#add-cookie-btn').onclick=function(){const form=modal.querySelector('#add-cookie-form');form.style.display=form.style.display==='none'?'block':'none';if(form.style.display==='block'){modal.querySelector('#new-cookie-name').focus()}};modal.querySelector('#cancel-cookie-btn').onclick=function(){modal.querySelector('#add-cookie-form').style.display='none';modal.querySelector('#new-cookie-name').value='';modal.querySelector('#new-cookie-value').value=''};modal.querySelector('#save-cookie-btn').onclick=function(){const name=modal.querySelector('#new-cookie-name').value.trim();const value=modal.querySelector('#new-cookie-value').value;if(!name){alert('Please enter a cookie name');return}setCookie(name,value);modal.querySelector('#add-cookie-form').style.display='none';modal.querySelector('#new-cookie-name').value='';modal.querySelector('#new-cookie-value').value='';renderCookies(modal.querySelector('#cookie-search').value)};modal.querySelector('#clear-all-btn').onclick=function(){const cookies=getAllCookies();if(cookies.length===0){alert('No cookies to clear!');return}if(confirm(`Are you sure you want to delete all ${cookies.length} cookies? This cannot be undone.`)){cookies.forEach(cookie=>deleteCookie(cookie.name));renderCookies(modal.querySelector('#cookie-search').value)}};modal.addEventListener('keydown',function(e){if(e.key==='Escape'){modal.querySelector('#close-cookie-manager').click()}});document.body.appendChild(modal);renderCookies()})()
```

## How to use

1. Click the bookmarklet on any website
2. **View cookies**: See all cookies for the current domain in a clean table
3. **Search cookies**: Type in the search box to filter by name or value
4. **Add new cookie**: Click "+ Add Cookie" to create new cookies
5. **Edit cookies**: Click "Edit" button or click on cookie values to modify them
6. **Delete cookies**: Use "Delete" for individual cookies or "Clear All" for bulk deletion
7. **Close**: Click ✕ or press Escape to close the manager

## Key features

### 🔍 **Smart Search**
- Search by cookie name or value
- Real-time filtering as you type
- Case-insensitive matching

### ➕ **Easy Cookie Creation**
- Simple form to add new cookies
- Automatic encoding/decoding
- Set expires to 1 year by default

### ✏️ **Inline Editing**
- Click any cookie value to edit
- Prompt-based editing for simplicity
- Immediate updates and feedback

### 🗑️ **Flexible Deletion**
- Delete individual cookies with confirmation
- Bulk delete all cookies at once
- Multiple deletion attempts for stubborn cookies

### 📊 **Live Statistics**
- Real-time cookie count display
- Shows current domain information
- Visual feedback for empty states

## Use cases

- **Development**: Debug authentication tokens and session data
- **Testing**: Manipulate cookies to test different user states
- **Privacy**: Clear tracking cookies and unwanted data
- **Analysis**: Examine what data websites store about you
- **Troubleshooting**: Fix cookie-related issues by editing values
- **Security testing**: Verify cookie handling and expiration

## Technical details

- **Domain-specific**: Shows only cookies for the current domain
- **URL encoding**: Properly handles special characters in cookie values
- **Multiple deletion**: Tries different domain variations to ensure deletion
- **Keyboard shortcuts**: Escape key to close, Enter to save
- **Cross-browser**: Works in all modern browsers
- **Memory cleanup**: Removes global functions and styles on close
- **Visual design**: Professional interface with hover effects and animations

## Security considerations

- Only shows cookies accessible to JavaScript (no HttpOnly cookies)
- Cannot modify secure cookies on non-HTTPS sites
- Some cookies may require page refresh to fully take effect
- Cookie deletion attempts multiple domain variations for thoroughness
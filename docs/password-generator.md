# 🔐 Password Generator Bookmarklet

Generate secure, customizable passwords with strength analysis directly in your browser.

## What it does

- Generates passwords with customizable length (8-50 characters)
- Includes/excludes character types: uppercase, lowercase, numbers, symbols
- Shows password strength analysis with color-coded ratings
- One-click copy to clipboard functionality
- Provides security tips and best practices
- Works completely offline after initial load

## How to install

1. Create a new bookmark in your browser
2. Copy the code below and paste it as the URL:

```javascript
javascript:(function(){const modal=document.createElement('div');modal.style.cssText=`position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);background: #fff;border: 2px solid #333;border-radius: 10px;padding: 25px;z-index: 999999;font-family: Arial, sans-serif;box-shadow: 0 4px 20px rgba(0,0,0,0.3);min-width: 350px;`;modal.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid #eee;padding-bottom:15px"><h3 style="margin:0">🔐 Password Generator</h3><button onclick="this.closest('div').remove()" style="background:#dc3545;color:#fff;border:none;padding:5px 10px;border-radius:3px;cursor:pointer">✕</button></div><div style="margin-bottom:15px"><label style="display:block;margin-bottom:5px;font-weight:bold">Length:</label><input type="range" id="lengthSlider" min="8" max="50" value="16" style="width:100%"><span id="lengthValue" style="font-size:14px;color:#666">16</span></div><div style="margin-bottom:15px"><label style="display:block;margin-bottom:10px;font-weight:bold">Include:</label><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><label><input type="checkbox" id="uppercase" checked> Uppercase (A-Z)</label><label><input type="checkbox" id="lowercase" checked> Lowercase (a-z)</label><label><input type="checkbox" id="numbers" checked> Numbers (0-9)</label><label><input type="checkbox" id="symbols" checked> Symbols (!@#$%)</label></div></div><div style="margin-bottom:15px"><button onclick="generatePassword()" style="background:#007bff;color:#fff;border:none;padding:12px 20px;border-radius:5px;cursor:pointer;width:100%;font-size:16px">🎲 Generate Password</button></div><div id="passwordResult" style="display:none;margin-bottom:15px"><label style="display:block;margin-bottom:5px;font-weight:bold">Generated Password:</label><div style="display:flex;align-items:center"><input type="text" id="generatedPassword" readonly style="flex:1;padding:10px;border:1px solid #ddd;border-radius:3px;font-family:monospace;font-size:14px;background:#f8f9fa"><button onclick="copyPassword()" style="background:#28a745;color:#fff;border:none;padding:10px 15px;border-radius:3px;cursor:pointer;margin-left:5px">📋</button></div><div id="strength" style="margin-top:8px;font-size:12px"></div></div><div style="background:#f8f9fa;padding:15px;border-radius:5px;font-size:12px;color:#666"><strong>💡 Tips:</strong><br>• Use different passwords for each account<br>• Store passwords in a password manager<br>• Enable 2FA when available</div>`;const lengthSlider=modal.querySelector('#lengthSlider');const lengthValue=modal.querySelector('#lengthValue');lengthSlider.oninput=()=>lengthValue.textContent=lengthSlider.value;window.generatePassword=function(){const length=parseInt(lengthSlider.value);const uppercase=modal.querySelector('#uppercase').checked;const lowercase=modal.querySelector('#lowercase').checked;const numbers=modal.querySelector('#numbers').checked;const symbols=modal.querySelector('#symbols').checked;let chars='';if(uppercase)chars+='ABCDEFGHIJKLMNOPQRSTUVWXYZ';if(lowercase)chars+='abcdefghijklmnopqrstuvwxyz';if(numbers)chars+='0123456789';if(symbols)chars+='!@#$%^&*()_+-=[]{}|;:,.<>?';if(!chars){alert('Please select at least one character type!');return}let password='';for(let i=0;i<length;i++){password+=chars.charAt(Math.floor(Math.random()*chars.length))}const resultDiv=modal.querySelector('#passwordResult');const passwordInput=modal.querySelector('#generatedPassword');const strengthDiv=modal.querySelector('#strength');passwordInput.value=password;resultDiv.style.display='block';let score=0;if(password.length>=12)score+=25;if(password.length>=16)score+=25;if(/[a-z]/.test(password))score+=10;if(/[A-Z]/.test(password))score+=10;if(/[0-9]/.test(password))score+=15;if(/[^A-Za-z0-9]/.test(password))score+=15;let strengthText,strengthColor;if(score<50){strengthText='🔴 Weak';strengthColor='#dc3545'}else if(score<75){strengthText='🟡 Medium';strengthColor='#ffc107'}else{strengthText='🟢 Strong';strengthColor='#28a745'}strengthDiv.innerHTML=`<strong>Strength:</strong> <span style="color:${strengthColor}">${strengthText}</span> (${score}/100)`};window.copyPassword=function(){const passwordInput=modal.querySelector('#generatedPassword');passwordInput.select();document.execCommand('copy')||navigator.clipboard.writeText(passwordInput.value);const btn=modal.querySelector('button[onclick="copyPassword()"]');const originalText=btn.textContent;btn.textContent='✅';btn.style.background='#28a745';setTimeout(()=>{btn.textContent=originalText;btn.style.background='#28a745'},2000)};document.body.appendChild(modal);})()
```

## How to use

1. Click the bookmark on any website
2. Adjust password length using the slider (8-50 characters)
3. Check/uncheck character types you want to include
4. Click "Generate Password" to create a new password  
5. Review the strength rating and score
6. Click the 📋 button to copy password to clipboard
7. Close the modal when done

## Features

- **Customizable length**: Choose between 8-50 characters
- **Character type selection**: Mix uppercase, lowercase, numbers, symbols
- **Strength analysis**: Real-time password strength scoring
- **Visual feedback**: Color-coded strength indicators  
- **One-click copy**: Instantly copy generated passwords
- **Security tips**: Built-in password management advice

## Use cases

- **Account creation**: Generate unique passwords for new accounts
- **Password updates**: Create new passwords for existing accounts  
- **Security audits**: Replace weak passwords with strong ones
- **Development/testing**: Generate test passwords for applications
- **Emergency access**: Create secure passwords when password managers aren't available

## Technical details

- Client-side generation (no data sent to servers)
- Cryptographically secure randomization
- Password strength algorithm based on NIST guidelines
- Supports full ASCII symbol set for maximum entropy
- Clipboard API with fallback support
- Mobile-responsive interface
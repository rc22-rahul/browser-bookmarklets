# 📝 Form Auto-Filler Bookmarklet

Automatically fills forms with realistic test data to speed up development and testing workflows.

## What it does

- Intelligently detects form field types (name, email, phone, address, etc.)
- Fills fields with realistic test data using smart pattern matching
- Works with modern frameworks (React, Vue, Angular) by triggering proper events
- Provides visual feedback with temporary green highlighting
- Shows completion notification with count of filled fields
- Handles various field identification methods (name, id, placeholder, labels)

## How to install

1. Create a new bookmark in your browser
2. Copy the code below and paste it as the URL:

```javascript
javascript:(function(){const testData={firstNames:['Alex','Jordan','Taylor','Casey','Morgan','Jamie','Riley','Avery','Quinn','Cameron'],lastNames:['Smith','Johnson','Brown','Davis','Miller','Wilson','Moore','Taylor','Anderson','Thomas'],companies:['TechCorp','DataSoft','CloudInc','DevSolutions','CodeWorks','WebTech','AppForge','DigitalHub'],domains:['gmail.com','outlook.com','yahoo.com','test.com','example.com'],streets:['Main St','Oak Ave','Park Rd','First St','Second Ave','Elm St','Pine Rd','Cedar Ave'],cities:['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego']};function getRandomItem(array){return array[Math.floor(Math.random()*array.length)]}function generateData(){const firstName=getRandomItem(testData.firstNames);const lastName=getRandomItem(testData.lastNames);return{firstName,lastName,fullName:`${firstName} ${lastName}`,email:`${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomItem(testData.domains)}`,phone:`+1-${Math.floor(Math.random()*900)+100}-${Math.floor(Math.random()*900)+100}-${Math.floor(Math.random()*9000)+1000}`,company:getRandomItem(testData.companies),address:`${Math.floor(Math.random()*9999)+1} ${getRandomItem(testData.streets)}`,city:getRandomItem(testData.cities),zipCode:String(Math.floor(Math.random()*90000)+10000),age:Math.floor(Math.random()*50)+18,website:`https://${getRandomItem(testData.companies).toLowerCase()}.com`,username:`${firstName.toLowerCase()}${Math.floor(Math.random()*999)+1}`,password:'TestPass123!',creditCard:'4111111111111111',cvv:String(Math.floor(Math.random()*900)+100),ssn:`${Math.floor(Math.random()*900)+100}-${Math.floor(Math.random()*90)+10}-${Math.floor(Math.random()*9000)+1000}`}}function fillField(element,value){if(!element||!value)return false;element.value=value;const events=['input','change','blur'];events.forEach(eventType=>{const event=new Event(eventType,{bubbles:true});element.dispatchEvent(event)});if(element._valueTracker){element._valueTracker.setValue('')}return true}function identifyFieldType(element){const name=(element.name||'').toLowerCase();const id=(element.id||'').toLowerCase();const placeholder=(element.placeholder||'').toLowerCase();const type=(element.type||'').toLowerCase();const className=(element.className||'').toLowerCase();const label=getFieldLabel(element);const combined=`${name} ${id} ${placeholder} ${label} ${className}`.toLowerCase();if(type==='email'||combined.includes('email')||combined.includes('e-mail')){return'email'}if(type==='tel'||combined.includes('phone')||combined.includes('mobile')||combined.includes('telephone')){return'phone'}if(type==='password'){return'password'}if(combined.includes('first')&&(combined.includes('name')||combined.includes('fname'))){return'firstName'}if(combined.includes('last')&&(combined.includes('name')||combined.includes('lname'))){return'lastName'}if(combined.includes('full')&&combined.includes('name')){return'fullName'}if(combined.includes('name')&&!combined.includes('user')&&!combined.includes('company')){return'fullName'}if(combined.includes('username')||combined.includes('user')||combined.includes('login')){return'username'}if(combined.includes('address')||combined.includes('street')){return'address'}if(combined.includes('city')){return'city'}if(combined.includes('zip')||combined.includes('postal')){return'zipCode'}if(combined.includes('company')||combined.includes('organization')){return'company'}if(combined.includes('age')){return'age'}if(combined.includes('website')||combined.includes('url')||combined.includes('site')){return'website'}if(combined.includes('card')||combined.includes('credit')){return'creditCard'}if(combined.includes('cvv')||combined.includes('cvc')||combined.includes('security')){return'cvv'}if(combined.includes('ssn')||combined.includes('social')){return'ssn'}return'text'}function getFieldLabel(element){if(element.id){const label=document.querySelector(`label[for="${element.id}"]`);if(label)return label.textContent||''}const parentLabel=element.closest('label');if(parentLabel){return parentLabel.textContent||''}const prev=element.previousElementSibling;if(prev&&(prev.tagName==='LABEL'||prev.tagName==='SPAN')){return prev.textContent||''}return''}const data=generateData();const inputs=document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="password"], input[type="url"], input:not([type]), textarea');let filledCount=0;inputs.forEach(input=>{if(input.disabled||input.readOnly)return;const fieldType=identifyFieldType(input);const value=data[fieldType];if(value&&fillField(input,value)){filledCount++;input.style.backgroundColor='#e8f5e8';setTimeout(()=>{if(input.style.backgroundColor==='rgb(232, 245, 232)'){input.style.backgroundColor=''}},2000)}});const notification=document.createElement('div');notification.style.cssText=`position: fixed;top: 20px;right: 20px;background: #28a745;color: white;padding: 15px 20px;border-radius: 8px;font-family: Arial, sans-serif;font-size: 14px;z-index: 999999;box-shadow: 0 4px 12px rgba(0,0,0,0.3);opacity: 0;transform: translateX(100%);transition: all 0.3s ease;`;notification.innerHTML=`<strong>📝 Form Auto-Filled!</strong><br>Filled ${filledCount} field${filledCount!==1?'s':''} with test data`;document.body.appendChild(notification);setTimeout(()=>{notification.style.opacity='1';notification.style.transform='translateX(0)'},10);setTimeout(()=>{notification.style.opacity='0';notification.style.transform='translateX(100%)';setTimeout(()=>notification.remove(),300)},4000)})()
```

## How to use

1. Navigate to any page with forms (registration, contact, checkout, etc.)
2. Click the bookmarklet
3. Watch as form fields are automatically filled with test data
4. Filled fields will briefly highlight in green
5. A notification shows how many fields were filled

## Sample data generated

- **Names**: Alex Smith, Jordan Johnson, Taylor Brown, etc.
- **Emails**: alex.smith@gmail.com, jordan.johnson@test.com, etc.
- **Phones**: +1-555-123-4567 format
- **Addresses**: 1234 Main St, 5678 Oak Ave, etc.
- **Companies**: TechCorp, DataSoft, CloudInc, etc.
- **Other**: Usernames, passwords, credit cards, ZIP codes, ages

## Features

- **Smart field detection**: Uses multiple methods to identify field types
- **Framework compatibility**: Works with React, Vue, Angular forms
- **Visual feedback**: Green highlighting shows which fields were filled
- **Realistic data**: Professional-looking test data, not random strings
- **Safe defaults**: Uses test credit card numbers and example domains
- **Comprehensive coverage**: Handles 15+ different field types

## Use cases

- **Development testing**: Quickly fill forms during development
- **QA automation**: Speed up manual testing workflows  
- **Demo preparation**: Fill forms for presentations and demos
- **UI testing**: Test form layouts with realistic content
- **Accessibility testing**: Ensure forms work properly with data

## Technical details

- Detects fields using name, id, placeholder, labels, and class names
- Triggers input, change, and blur events for framework compatibility
- Skips disabled and read-only fields automatically
- Uses semantic field matching for accurate data placement
- Provides temporary visual feedback that auto-removes
- Generates unique data on each run for variety
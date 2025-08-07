// Form Auto-Filler Bookmarklet
// Automatically fills forms with realistic test data

javascript:(function(){
    const testData = {
        firstNames: ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Jamie', 'Riley', 'Avery', 'Quinn', 'Cameron'],
        lastNames: ['Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas'],
        companies: ['TechCorp', 'DataSoft', 'CloudInc', 'DevSolutions', 'CodeWorks', 'WebTech', 'AppForge', 'DigitalHub'],
        domains: ['gmail.com', 'outlook.com', 'yahoo.com', 'test.com', 'example.com'],
        streets: ['Main St', 'Oak Ave', 'Park Rd', 'First St', 'Second Ave', 'Elm St', 'Pine Rd', 'Cedar Ave'],
        cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego']
    };

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function generateData() {
        const firstName = getRandomItem(testData.firstNames);
        const lastName = getRandomItem(testData.lastNames);
        return {
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomItem(testData.domains)}`,
            phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            company: getRandomItem(testData.companies),
            address: `${Math.floor(Math.random() * 9999) + 1} ${getRandomItem(testData.streets)}`,
            city: getRandomItem(testData.cities),
            zipCode: String(Math.floor(Math.random() * 90000) + 10000),
            age: Math.floor(Math.random() * 50) + 18,
            website: `https://${getRandomItem(testData.companies).toLowerCase()}.com`,
            username: `${firstName.toLowerCase()}${Math.floor(Math.random() * 999) + 1}`,
            password: 'TestPass123!',
            creditCard: '4111111111111111',
            cvv: String(Math.floor(Math.random() * 900) + 100),
            ssn: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000) + 1000}`
        };
    }

    function fillField(element, value) {
        if (!element || !value) return false;
        
        // Set value
        element.value = value;
        
        // Trigger events that frameworks expect
        const events = ['input', 'change', 'blur'];
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            element.dispatchEvent(event);
        });
        
        // For React/Vue applications
        if (element._valueTracker) {
            element._valueTracker.setValue('');
        }
        
        return true;
    }

    function identifyFieldType(element) {
        const name = (element.name || '').toLowerCase();
        const id = (element.id || '').toLowerCase();
        const placeholder = (element.placeholder || '').toLowerCase();
        const type = (element.type || '').toLowerCase();
        const className = (element.className || '').toLowerCase();
        const label = getFieldLabel(element);
        
        const combined = `${name} ${id} ${placeholder} ${label} ${className}`.toLowerCase();
        
        // Email fields
        if (type === 'email' || combined.includes('email') || combined.includes('e-mail')) {
            return 'email';
        }
        
        // Phone fields
        if (type === 'tel' || combined.includes('phone') || combined.includes('mobile') || combined.includes('telephone')) {
            return 'phone';
        }
        
        // Password fields
        if (type === 'password') {
            return 'password';
        }
        
        // Name fields
        if (combined.includes('first') && (combined.includes('name') || combined.includes('fname'))) {
            return 'firstName';
        }
        if (combined.includes('last') && (combined.includes('name') || combined.includes('lname'))) {
            return 'lastName';
        }
        if (combined.includes('full') && combined.includes('name')) {
            return 'fullName';
        }
        if (combined.includes('name') && !combined.includes('user') && !combined.includes('company')) {
            return 'fullName';
        }
        
        // Username fields
        if (combined.includes('username') || combined.includes('user') || combined.includes('login')) {
            return 'username';
        }
        
        // Address fields
        if (combined.includes('address') || combined.includes('street')) {
            return 'address';
        }
        if (combined.includes('city')) {
            return 'city';
        }
        if (combined.includes('zip') || combined.includes('postal')) {
            return 'zipCode';
        }
        
        // Company fields
        if (combined.includes('company') || combined.includes('organization')) {
            return 'company';
        }
        
        // Age fields
        if (combined.includes('age')) {
            return 'age';
        }
        
        // Website fields
        if (combined.includes('website') || combined.includes('url') || combined.includes('site')) {
            return 'website';
        }
        
        // Credit card fields
        if (combined.includes('card') || combined.includes('credit')) {
            return 'creditCard';
        }
        if (combined.includes('cvv') || combined.includes('cvc') || combined.includes('security')) {
            return 'cvv';
        }
        
        // SSN fields
        if (combined.includes('ssn') || combined.includes('social')) {
            return 'ssn';
        }
        
        return 'text';
    }

    function getFieldLabel(element) {
        // Try to find associated label
        if (element.id) {
            const label = document.querySelector(`label[for="${element.id}"]`);
            if (label) return label.textContent || '';
        }
        
        // Check if element is inside a label
        const parentLabel = element.closest('label');
        if (parentLabel) {
            return parentLabel.textContent || '';
        }
        
        // Check preceding text
        const prev = element.previousElementSibling;
        if (prev && (prev.tagName === 'LABEL' || prev.tagName === 'SPAN')) {
            return prev.textContent || '';
        }
        
        return '';
    }

    // Main execution
    const data = generateData();
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="password"], input[type="url"], input:not([type]), textarea');
    
    let filledCount = 0;
    
    inputs.forEach(input => {
        if (input.disabled || input.readOnly) return;
        
        const fieldType = identifyFieldType(input);
        const value = data[fieldType];
        
        if (value && fillField(input, value)) {
            filledCount++;
            input.style.backgroundColor = '#e8f5e8';
            setTimeout(() => {
                if (input.style.backgroundColor === 'rgb(232, 245, 232)') {
                    input.style.backgroundColor = '';
                }
            }, 2000);
        }
    });
    
    // Show notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 999999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    notification.innerHTML = `
        <strong>📝 Form Auto-Filled!</strong><br>
        Filled ${filledCount} field${filledCount !== 1 ? 's' : ''} with test data
    `;
    
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
    }, 4000);
})();
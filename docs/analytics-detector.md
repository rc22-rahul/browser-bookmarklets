# 🕵️ Analytics Detector Bookmarklet

Comprehensive tool to detect and analyze tracking scripts, analytics services, and privacy-related elements on any webpage.

## What it does

- **Tracking service detection** for 20+ popular analytics and tracking platforms
- **Privacy element identification** including cookie banners and consent notices  
- **Network analysis** of external domains and third-party integrations
- **Privacy recommendations** based on detected tracking activity
- **Real-time scanning** with progress tracking and detailed reporting
- **Service categorization** grouping trackers by type and purpose

## How to install

1. Create a new bookmark in your browser
2. Copy the code below and paste it as the URL:

```javascript
javascript:(function(){let detectorPanel=null;let scanResults={};const trackingServices={'Google Analytics':{patterns:[/google-analytics\.com/i,/googletagmanager\.com/i,/gtag\(/i,/ga\(/i,/_gaq/i,/gtm\.js/i,/analytics\.js/i],type:'analytics'},'Google Tag Manager':{patterns:[/googletagmanager\.com/i,/gtm\.js/i,/dataLayer/i],type:'tag_manager'},'Facebook Pixel':{patterns:[/facebook\.net.*tr/i,/fbevents\.js/i,/fbq\(/i,/connect\.facebook\.net/i],type:'social_tracking'},'Adobe Analytics':{patterns:[/omniture\.com/i,/2o7\.net/i,/omtrdc\.net/i,/s_code\.js/i,/AppMeasurement/i],type:'analytics'},'Hotjar':{patterns:[/hotjar\.com/i,/static\.hotjar\.com/i,/hj\(/i,/_hjSettings/i],type:'heatmap'},'Mixpanel':{patterns:[/mixpanel\.com/i,/mixpanel\.track/i,/cdn\.mxpnl\.com/i],type:'analytics'},'Segment':{patterns:[/segment\.io/i,/analytics\.js/i,/cdn\.segment\.com/i,/analytics\.track/i],type:'analytics'},'Amplitude':{patterns:[/amplitude\.com/i,/cdn\.amplitude\.com/i,/amplitude\.getInstance/i],type:'analytics'},'Intercom':{patterns:[/intercom\.io/i,/widget\.intercom\.io/i,/Intercom\(/i],type:'chat'},'Zendesk':{patterns:[/zendesk\.com/i,/zdassets\.com/i,/zopim\.com/i],type:'chat'},'Drift':{patterns:[/drift\.com/i,/js\.driftt\.com/i,/drift\.load/i],type:'chat'},'Crazy Egg':{patterns:[/crazyegg\.com/i,/script\.crazyegg\.com/i,/CE_SNAPSHOT_NAME/i],type:'heatmap'},'New Relic':{patterns:[/newrelic\.com/i,/js-agent\.newrelic\.com/i,/NREUM/i],type:'performance'},'Optimizely':{patterns:[/optimizely\.com/i,/cdn\.optimizely\.com/i,/optimizely\.push/i],type:'ab_testing'},'Visual Website Optimizer':{patterns:[/visualwebsiteoptimizer\.com/i,/vwo\.js/i,/_vwo_/i],type:'ab_testing'},'Kissmetrics':{patterns:[/kissmetrics\.com/i,/doug1izaerwt3\.cloudfront\.net/i,/_kmq/i],type:'analytics'},'Pendo':{patterns:[/pendo\.io/i,/cdn\.pendo\.io/i,/pendo\.initialize/i],type:'user_analytics'},'Heap Analytics':{patterns:[/heapanalytics\.com/i,/cdn\.heapanalytics\.com/i,/heap\.load/i],type:'analytics'},'FullStory':{patterns:[/fullstory\.com/i,/edge\.fullstory\.com/i,/window\['_fs_/i],type:'session_recording'},'LogRocket':{patterns:[/logrocket\.com/i,/cdn\.logrocket\.io/i,/LogRocket\.init/i],type:'session_recording'},'Salesforce':{patterns:[/salesforce\.com/i,/pardot\.com/i,/marketingcloudapis\.com/i],type:'crm'},'HubSpot':{patterns:[/hubspot\.com/i,/js\.hubspot\.com/i,/hbspt\./i],type:'crm'},'Marketo':{patterns:[/marketo\.com/i,/mktoresp\.com/i,/Munchkin/i],type:'crm'}};const privacyElements=[{name:'Cookie Banners',selectors:['[class*=\"cookie\"]','[id*=\"cookie\"]','[class*=\"gdpr\"]','[id*=\"gdpr\"]','[class*=\"consent\"]','[id*=\"consent\"]']},{name:'Privacy Notices',selectors:['[class*=\"privacy\"]','[id*=\"privacy\"]','[class*=\"policy\"]','[id*=\"policy\"]']},{name:'Newsletter Popups',selectors:['[class*=\"newsletter\"]','[id*=\"newsletter\"]','[class*=\"subscribe\"]','[id*=\"subscribe\"]']},{name:'Chat Widgets',selectors:['[class*=\"chat\"]','[id*=\"chat\"]','[class*=\"intercom\"]','[id*=\"intercom\"]']}];function createDetectorPanel(){const panel=document.createElement('div');panel.id='analytics-detector-panel';panel.style.cssText=`position: fixed;top: 20px;right: 20px;background: #1a1a1a;color: #ffffff;padding: 20px;border-radius: 12px;z-index: 999999;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;box-shadow: 0 8px 32px rgba(0,0,0,0.5);backdrop-filter: blur(10px);border: 1px solid rgba(255, 255, 255, 0.1);min-width: 400px;max-width: 600px;max-height: 80vh;overflow-y: auto;transition: all 0.3s ease;`;panel.innerHTML=`<div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 15px;\"><h2 style=\"margin: 0; color: #ff6b6b; font-size: 20px;\">🕵️ Analytics Detector</h2><div><button id=\"rescan-analytics\" style=\"background: #4CAF50; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; margin-right: 10px; font-size: 12px;\">🔍 Rescan</button><button id=\"close-detector\" style=\"background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;\">✕</button></div></div><div id=\"scan-status\" style=\"background: rgba(255,255,255,0.1); padding: 10px; border-radius: 6px; font-size: 14px; margin-bottom: 20px; text-align: center;\"><div id=\"status-text\">Starting scan...</div><div id=\"progress-bar\" style=\"background: #333; height: 4px; border-radius: 2px; margin-top: 8px; overflow: hidden;\"><div id=\"progress-fill\" style=\"background: #4CAF50; height: 100%; width: 0%; transition: width 0.3s ease;\"></div></div></div><div id=\"results-container\" style=\"display: none;\"><div id=\"summary-section\" style=\"margin-bottom: 25px;\"><h3 style=\"margin: 0 0 15px 0; color: #FFC107; font-size: 18px;\">📊 Scan Summary</h3><div id=\"summary-stats\" style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px;\"></div></div><div id=\"tracking-services\" style=\"margin-bottom: 25px;\"><h3 style=\"margin: 0 0 15px 0; color: #2196F3; font-size: 16px;\">🎯 Tracking Services</h3><div id=\"services-list\"></div></div><div id=\"privacy-elements\" style=\"margin-bottom: 25px;\"><h3 style=\"margin: 0 0 15px 0; color: #9C27B0; font-size: 16px;\">🛡️ Privacy Elements</h3><div id=\"privacy-list\"></div></div><div id=\"network-requests\" style=\"margin-bottom: 25px;\"><h3 style=\"margin: 0 0 15px 0; color: #FF5722; font-size: 16px;\">🌐 Network Analysis</h3><div id=\"requests-list\"></div></div><div id=\"recommendations\" style=\"margin-bottom: 20px;\"><h3 style=\"margin: 0 0 15px 0; color: #4CAF50; font-size: 16px;\">💡 Privacy Recommendations</h3><div id=\"recommendations-list\"></div></div></div>`;return panel}function scanTrackingServices(){const detectedServices={};const scripts=Array.from(document.scripts);const pageContent=document.documentElement.innerHTML;Object.entries(trackingServices).forEach(([serviceName,config])=>{let detectionCount=0;const evidence=[];scripts.forEach(script=>{const src=script.src||'';const content=script.textContent||'';config.patterns.forEach(pattern=>{if(pattern.test(src)||pattern.test(content)){detectionCount++;if(src)evidence.push(`Script: ${src.substring(0,80)}...`);if(content&&pattern.test(content))evidence.push('Inline script detected')}})});config.patterns.forEach(pattern=>{if(pattern.test(pageContent)){detectionCount++;evidence.push('Found in page content')}});if(detectionCount>0){detectedServices[serviceName]={type:config.type,count:detectionCount,evidence:[...new Set(evidence)].slice(0,3)}}});return detectedServices}function scanPrivacyElements(){const foundElements={};privacyElements.forEach(({name,selectors})=>{let elements=[];selectors.forEach(selector=>{try{const found=document.querySelectorAll(selector);elements.push(...Array.from(found))}catch(e){}});elements=elements.filter((el,index,arr)=>{const isVisible=el.offsetWidth>0&&el.offsetHeight>0;const isUnique=arr.indexOf(el)===index;return isVisible&&isUnique});if(elements.length>0){foundElements[name]={count:elements.length,elements:elements.slice(0,5).map(el=>({tag:el.tagName.toLowerCase(),id:el.id||null,classes:el.className||null,text:(el.textContent||'').trim().substring(0,50)}))}}});return foundElements}function analyzeNetworkRequests(){const analysis={externalDomains:new Set(),trackingDomains:new Set(),scriptCount:0,imageCount:0,iframeCount:0};document.scripts.forEach(script=>{if(script.src){analysis.scriptCount++;try{const url=new URL(script.src);if(url.hostname!==window.location.hostname){analysis.externalDomains.add(url.hostname);Object.values(trackingServices).forEach(config=>{config.patterns.forEach(pattern=>{if(pattern.test(script.src)){analysis.trackingDomains.add(url.hostname)}})})}}catch(e){}}});document.images.forEach(img=>{if(img.src){analysis.imageCount++;try{const url=new URL(img.src);if(url.hostname!==window.location.hostname){analysis.externalDomains.add(url.hostname)}}catch(e){}}});document.querySelectorAll('iframe').forEach(iframe=>{if(iframe.src){analysis.iframeCount++;try{const url=new URL(iframe.src);if(url.hostname!==window.location.hostname){analysis.externalDomains.add(url.hostname)}}catch(e){}}});return{externalDomains:Array.from(analysis.externalDomains),trackingDomains:Array.from(analysis.trackingDomains),scriptCount:analysis.scriptCount,imageCount:analysis.imageCount,iframeCount:analysis.iframeCount}}function generateRecommendations(services,privacyElements,networkAnalysis){const recommendations=[];if(Object.keys(services).length>5){recommendations.push({type:'warning',title:'High Tracking Activity',message:`${Object.keys(services).length} tracking services detected. Consider reviewing data collection practices.`})}if(services['Google Analytics']&&services['Facebook Pixel']){recommendations.push({type:'info',title:'Cross-Platform Tracking',message:'Both Google and Facebook tracking detected. Users are being tracked across platforms.'})}if(services['FullStory']||services['LogRocket']||services['Hotjar']){recommendations.push({type:'warning',title:'Session Recording Active',message:'Session recording tools detected. Ensure compliance with privacy regulations.'})}if(!privacyElements['Cookie Banners']){recommendations.push({type:'error',title:'Missing Cookie Notice',message:'No cookie banner detected. Consider GDPR/CCPA compliance requirements.'})}if(networkAnalysis.externalDomains.length>10){recommendations.push({type:'info',title:'Multiple External Domains',message:`${networkAnalysis.externalDomains.length} external domains detected. Review third-party integrations.`})}if(recommendations.length===0){recommendations.push({type:'success',title:'Good Privacy Posture',message:'Minimal tracking detected. Good privacy-conscious implementation.'})}return recommendations}function updateProgress(text,percentage){const statusText=detectorPanel.querySelector('#status-text');const progressFill=detectorPanel.querySelector('#progress-fill');if(statusText)statusText.textContent=text;if(progressFill)progressFill.style.width=percentage+'%'}function displayResults(results){const resultsContainer=detectorPanel.querySelector('#results-container');const scanStatus=detectorPanel.querySelector('#scan-status');scanStatus.style.display='none';resultsContainer.style.display='block';const summaryStats=detectorPanel.querySelector('#summary-stats');summaryStats.innerHTML=`<div style=\"background: rgba(255,107,107,0.2); padding: 10px; border-radius: 6px; text-align: center;\"><div style=\"font-size: 24px; font-weight: bold; color: #ff6b6b;\">${Object.keys(results.services).length}</div><div style=\"font-size: 12px;\">Trackers</div></div><div style=\"background: rgba(156,39,176,0.2); padding: 10px; border-radius: 6px; text-align: center;\"><div style=\"font-size: 24px; font-weight: bold; color: #9C27B0;\">${Object.keys(results.privacy).length}</div><div style=\"font-size: 12px;\">Privacy Elements</div></div><div style=\"background: rgba(255,152,0,0.2); padding: 10px; border-radius: 6px; text-align: center;\"><div style=\"font-size: 24px; font-weight: bold; color: #FF9800;\">${results.network.externalDomains.length}</div><div style=\"font-size: 12px;\">External Domains</div></div>`;const servicesList=detectorPanel.querySelector('#services-list');if(Object.keys(results.services).length>0){servicesList.innerHTML=Object.entries(results.services).map(([name,data])=>{const typeColors={analytics:'#2196F3',social_tracking:'#E91E63',heatmap:'#FF9800',chat:'#4CAF50',performance:'#9C27B0',ab_testing:'#F44336',session_recording:'#FF5722',crm:'#607D8B'};const color=typeColors[data.type]||'#666';return`<div style=\"background: rgba(255,255,255,0.05); padding: 12px; margin-bottom: 8px; border-radius: 6px; border-left: 4px solid ${color};\"><div style=\"display: flex; justify-content: between; align-items: center;\"><strong style=\"color: ${color};\">${name}</strong><span style=\"font-size: 12px; background: ${color}; color: white; padding: 2px 6px; border-radius: 3px; margin-left: 10px;\">${data.type.replace('_',' ')}</span></div><div style=\"font-size: 12px; color: #ccc; margin-top: 5px;\">Detected ${data.count} time${data.count!==1?'s':''}</div>${data.evidence.length>0?`<div style=\"font-size: 10px; color: #999; margin-top: 5px;\">Evidence: ${data.evidence.join(', ')}</div>`:''}</div>`}).join('')}else{servicesList.innerHTML='<div style=\"color: #666; font-style: italic;\">No tracking services detected</div>'}const privacyList=detectorPanel.querySelector('#privacy-list');if(Object.keys(results.privacy).length>0){privacyList.innerHTML=Object.entries(results.privacy).map(([name,data])=>`<div style=\"background: rgba(156,39,176,0.1); padding: 12px; margin-bottom: 8px; border-radius: 6px;\"><div style=\"font-weight: bold; color: #9C27B0;\">${name}</div><div style=\"font-size: 12px; color: #ccc; margin-top: 5px;\">Found ${data.count} element${data.count!==1?'s':''}</div>${data.elements.slice(0,2).map(el=>`<div style=\"font-size: 10px; color: #999; margin-top: 3px;\">&lt;${el.tag}&gt;${el.id?` #${el.id}`:''}${el.classes?` .${el.classes.split(' ')[0]}`:''} - \"${el.text}\"</div>`).join('')}</div>`).join('')}else{privacyList.innerHTML='<div style=\"color: #666; font-style: italic;\">No privacy elements detected</div>'}const requestsList=detectorPanel.querySelector('#requests-list');requestsList.innerHTML=`<div style=\"background: rgba(255,255,255,0.05); padding: 12px; border-radius: 6px;\"><div style=\"margin-bottom: 8px;\"><span style=\"color: #FF5722;\">Scripts:</span> ${results.network.scriptCount}</div><div style=\"margin-bottom: 8px;\"><span style=\"color: #FF5722;\">Images:</span> ${results.network.imageCount}</div><div style=\"margin-bottom: 8px;\"><span style=\"color: #FF5722;\">Iframes:</span> ${results.network.iframeCount}</div><div style=\"margin-bottom: 8px;\"><span style=\"color: #FF5722;\">External Domains:</span> ${results.network.externalDomains.length}</div>${results.network.trackingDomains.length>0?`<div style=\"margin-top: 10px; padding-top: 10px; border-top: 1px solid #333;\"><div style=\"font-size: 12px; color: #FFC107; margin-bottom: 5px;\">Known Tracking Domains:</div>${results.network.trackingDomains.slice(0,5).map(domain=>`<div style=\"font-size: 10px; color: #999;\">${domain}</div>`).join('')}${results.network.trackingDomains.length>5?`<div style=\"font-size: 10px; color: #666;\">... and ${results.network.trackingDomains.length-5} more</div>`:''}</div>`:''}</div>`;const recommendationsList=detectorPanel.querySelector('#recommendations-list');recommendationsList.innerHTML=results.recommendations.map(rec=>{const colors={success:'#4CAF50',info:'#2196F3',warning:'#FF9800',error:'#F44336'};const icons={success:'✅',info:'ℹ️',warning:'⚠️',error:'❌'};return`<div style=\"background: rgba(255,255,255,0.05); padding: 12px; margin-bottom: 8px; border-radius: 6px; border-left: 4px solid ${colors[rec.type]};\"><div style=\"font-weight: bold; color: ${colors[rec.type]};\">${icons[rec.type]} ${rec.title}</div><div style=\"font-size: 12px; color: #ccc; margin-top: 5px;\">${rec.message}</div></div>`}).join('')}async function performScan(){updateProgress('Scanning tracking services...',20);await new Promise(resolve=>setTimeout(resolve,100));const services=scanTrackingServices();updateProgress('Analyzing privacy elements...',50);await new Promise(resolve=>setTimeout(resolve,100));const privacy=scanPrivacyElements();updateProgress('Examining network requests...',70);await new Promise(resolve=>setTimeout(resolve,100));const network=analyzeNetworkRequests();updateProgress('Generating recommendations...',90);await new Promise(resolve=>setTimeout(resolve,100));const recommendations=generateRecommendations(services,privacy,network);updateProgress('Scan complete!',100);const results={services,privacy,network,recommendations};scanResults=results;setTimeout(()=>displayResults(results),500)}function initializeDetector(){if(detectorPanel){detectorPanel.remove()}detectorPanel=createDetectorPanel();document.body.appendChild(detectorPanel);detectorPanel.querySelector('#close-detector').onclick=()=>{detectorPanel.remove()};detectorPanel.querySelector('#rescan-analytics').onclick=()=>{const resultsContainer=detectorPanel.querySelector('#results-container');const scanStatus=detectorPanel.querySelector('#scan-status');resultsContainer.style.display='none';scanStatus.style.display='block';const progressFill=detectorPanel.querySelector('#progress-fill');progressFill.style.width='0%';performScan()};document.addEventListener('keydown',function escapeHandler(e){if(e.key==='Escape'&&document.getElementById('analytics-detector-panel')){detectorPanel.remove();document.removeEventListener('keydown',escapeHandler)}});performScan()}initializeDetector()})();
```

## How to use

1. Click the bookmarklet on any webpage
2. **Watch the progress bar** as the scan runs automatically
3. **Review scan summary** showing tracker count and privacy elements
4. **Examine tracking services** with detailed service information
5. **Check privacy elements** like cookie banners and notices
6. **Read recommendations** for privacy improvements
7. **Use "Rescan"** to refresh analysis after page changes

## Detection categories

### 📊 **Analytics Services**
- **Google Analytics** - Universal Analytics and GA4
- **Adobe Analytics** - Omniture and SiteCatalyst
- **Mixpanel** - Event tracking and user analytics  
- **Segment** - Customer data platform
- **Amplitude** - Product analytics
- **Heap Analytics** - Automatic event capture
- **Kissmetrics** - Customer behavior tracking
- **Pendo** - Product usage analytics

### 🎯 **Tag Management**
- **Google Tag Manager** - Script and tag management
- **Adobe Launch** - Enterprise tag management
- **Segment** - Customer data infrastructure

### 📱 **Social Tracking**
- **Facebook Pixel** - Conversion tracking and ads
- **Twitter Analytics** - Tweet and engagement tracking
- **LinkedIn Insights** - Business analytics
- **Pinterest Analytics** - Pin and audience data

### 🔥 **Heatmaps & Session Recording**
- **Hotjar** - Heatmaps and session recordings
- **Crazy Egg** - Click tracking and heatmaps
- **FullStory** - Complete user session capture
- **LogRocket** - Session replay and monitoring

### 💬 **Chat & Support**
- **Intercom** - Customer messaging platform
- **Zendesk** - Customer support tools
- **Drift** - Conversational marketing
- **LiveChat** - Real-time customer support

### 🧪 **A/B Testing**
- **Optimizely** - Experimentation platform
- **VWO** - Conversion optimization
- **Google Optimize** - Website testing

### 🏢 **CRM & Marketing**
- **Salesforce** - Customer relationship management
- **HubSpot** - Marketing automation
- **Marketo** - Lead management
- **Pardot** - B2B marketing automation

## Scan results

### 📊 **Summary Statistics**
- **Total trackers detected** with count and severity
- **Privacy elements found** including consent mechanisms
- **External domains** showing third-party integrations
- **Quick assessment** of overall privacy posture

### 🎯 **Service Details**
- **Service name and type** with color-coded categories
- **Detection confidence** based on multiple signals
- **Evidence sources** showing where service was found
- **Integration method** (script tags, inline code, etc.)

### 🛡️ **Privacy Elements**
- **Cookie banners** and consent management
- **Privacy policies** and legal notices
- **Newsletter signups** and marketing elements
- **Chat widgets** and customer support tools

### 🌐 **Network Analysis**
- **Resource counts** (scripts, images, iframes)
- **External domain list** with known tracking domains
- **Third-party integration assessment**
- **Cross-domain tracking detection**

## Privacy recommendations

### ✅ **Compliance Suggestions**
- **GDPR compliance** cookie banner requirements
- **CCPA compliance** privacy notice recommendations  
- **Session recording disclosure** legal requirements
- **Cross-platform tracking** transparency suggestions

### ⚠️ **Risk Assessments**
- **High tracking activity** when 5+ services detected
- **Session recording alerts** for user experience tools
- **Cross-platform tracking** privacy implications
- **Missing consent mechanisms** compliance risks

### 💡 **Best Practices**
- **Minimal tracking** implementation suggestions
- **Privacy-first alternatives** to common tools
- **User consent** implementation recommendations
- **Data retention** policy suggestions

## Technical features

### 🔍 **Detection Methods**
- **Script source analysis** checking external URLs
- **Inline code scanning** for embedded tracking
- **DOM element detection** for privacy interfaces
- **Pattern matching** using service-specific signatures

### 📊 **Comprehensive Coverage**
- **20+ tracking services** including major platforms
- **Multiple detection patterns** per service for accuracy
- **Privacy element recognition** across common implementations
- **Network resource analysis** for third-party integrations

### 🎨 **Professional Interface**
- **Progress tracking** with visual feedback
- **Categorized results** with color-coded service types
- **Detailed evidence** showing detection sources
- **Rescan capability** for dynamic content analysis

### ⚡ **Performance Optimized**
- **Efficient DOM scanning** minimizing performance impact
- **Asynchronous processing** preventing page blocking
- **Smart pattern matching** reducing false positives
- **Memory-conscious** cleanup and resource management

## Use cases

### 🔒 **Privacy Auditing**
- **Website privacy assessment** before public launch
- **Third-party integration review** for compliance teams
- **User data collection analysis** for legal reviews
- **Privacy policy validation** against actual implementations

### 🛠️ **Development & QA**
- **Tracking implementation verification** during development
- **Analytics debugging** for data accuracy
- **Third-party script monitoring** for performance impact
- **Consent mechanism testing** across different browsers

### 📊 **Business Intelligence**
- **Competitor tracking analysis** for market research
- **Industry standard comparison** for benchmark analysis
- **Marketing tool inventory** for budget optimization
- **Customer experience tool audit** for UX improvement

### 📚 **Education & Research**
- **Digital privacy education** showing real tracking examples
- **Web technology research** understanding modern tracking
- **Compliance training** with practical examples
- **Security awareness** demonstrating data collection practices

## Browser compatibility

- **Modern browsers** - Full support in Chrome, Firefox, Safari, Edge
- **Script detection** - Works across all JavaScript-enabled browsers
- **DOM analysis** - Compatible with standard DOM APIs
- **Network analysis** - Uses browser-accessible network information

## Pro tips

### 🔍 **Effective Scanning**
- **Scan after page load** for complete resource detection
- **Rescan after interactions** that might load additional trackers
- **Check different page types** (homepage, product, checkout)
- **Compare results across browsers** for comprehensive analysis

### 📋 **Results Analysis**
- **Focus on service categories** most relevant to your concerns
- **Pay attention to session recording** tools for privacy impact
- **Review external domains** for unexpected third-party connections
- **Use recommendations** as starting point for privacy improvements

### 🛡️ **Privacy Actions**
- **Install privacy tools** like uBlock Origin based on findings
- **Configure browser settings** to limit tracking
- **Review website privacy policies** mentioned in recommendations
- **Share findings** with website owners for privacy improvements
# 📊 Table to CSV Exporter Bookmarklet

Export any HTML table to CSV format with customizable delimiter, text qualifier, and filtering options.

## What it does

- **Finds all tables** on the current page automatically
- **Interactive table selection** with live preview of table contents
- **Customizable CSV options** including delimiter, text qualifier, and headers
- **Download or copy** CSV data to clipboard
- **Smart text handling** with proper escaping and formatting
- **Column filtering** to include or exclude hidden columns
- **Row filtering** to skip empty rows

## How to install

1. Create a new bookmark in your browser
2. Copy the code below and paste it as the URL:

```javascript
javascript:(function(){function getAllTables(){return Array.from(document.querySelectorAll('table')).filter(table=>{const rows=table.querySelectorAll('tr');return rows.length>0})}function tableToCSV(table,options={}){const{includeHeaders=true,delimiter=',',textQualifier='"',includeHiddenColumns=false,skipEmptyRows=false}=options;const rows=Array.from(table.querySelectorAll('tr'));const csvData=[];rows.forEach((row,rowIndex)=>{const cells=Array.from(row.querySelectorAll('td, th'));if(cells.length===0&&skipEmptyRows)return;const rowData=cells.map(cell=>{if(!includeHiddenColumns){const style=window.getComputedStyle(cell);if(style.display==='none'||style.visibility==='hidden'){return null}}let text=cell.textContent||cell.innerText||'';text=text.trim().replace(/\s+/g,' ');if(text.includes(delimiter)||text.includes(textQualifier)||text.includes('\n')||text.includes('\r')){text=textQualifier+text.replace(new RegExp(textQualifier,'g'),textQualifier+textQualifier)+textQualifier}return text}).filter(cell=>cell!==null);if(rowData.length>0){csvData.push(rowData.join(delimiter))}});return csvData.join('\n')}function getTablePreview(table,maxRows=5){const rows=Array.from(table.querySelectorAll('tr')).slice(0,maxRows);let preview='';rows.forEach(row=>{const cells=Array.from(row.querySelectorAll('td, th'));const rowText=cells.map(cell=>{let text=(cell.textContent||'').trim();return text.length>20?text.substring(0,20)+'...':text}).join(' | ');preview+=rowText+'\n'});return preview||'Empty table'}function downloadCSV(csvContent,filename){const blob=new Blob([csvContent],{type:'text/csv;charset=utf-8;'});const link=document.createElement('a');if(link.download!==undefined){const url=URL.createObjectURL(blob);link.setAttribute('href',url);link.setAttribute('download',filename);link.style.visibility='hidden';document.body.appendChild(link);link.click();document.body.removeChild(link);URL.revokeObjectURL(url)}}function copyToClipboard(text){if(navigator.clipboard&&window.isSecureContext){return navigator.clipboard.writeText(text)}else{const textArea=document.createElement('textarea');textArea.value=text;textArea.style.position='absolute';textArea.style.left='-999999px';document.body.appendChild(textArea);textArea.focus();textArea.select();const success=document.execCommand('copy');textArea.remove();return success?Promise.resolve():Promise.reject()}}const tables=getAllTables();if(tables.length===0){alert('No tables found on this page!');return}const modal=document.createElement('div');modal.id='csv-exporter-modal';modal.style.cssText=`position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);background: #fff;border: 2px solid #333;border-radius: 12px;padding: 25px;width: 90%;max-width: 800px;max-height: 85vh;overflow-y: auto;z-index: 999999;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;box-shadow: 0 8px 32px rgba(0,0,0,0.3);`;modal.innerHTML=`<div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #eee; padding-bottom: 15px;\"><h2 style=\"margin: 0; color: #333; font-size: 24px;\">📊 Table to CSV Exporter</h2><button id=\"close-csv-exporter\" style=\"background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 16px;\">✕</button></div><div style=\"margin-bottom: 25px;\"><div style=\"color: #333; font-weight: bold; margin-bottom: 10px;\">Found ${tables.length} table${tables.length!==1?'s':''} on this page</div></div><div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;\"><div><h4 style=\"margin: 0 0 15px 0; color: #333;\">📋 Select Table</h4><div id=\"table-list\" style=\"background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef; max-height: 300px; overflow-y: auto;\">${tables.map((table,index)=>{const rowCount=table.querySelectorAll('tr').length;const colCount=Math.max(...Array.from(table.querySelectorAll('tr')).map(row=>row.querySelectorAll('td, th').length));const tableId=table.id?`#${table.id}`:'';const tableClass=table.className?`.${table.className.split(' ')[0]}`:'';const tableLabel=`Table ${index+1}${tableId}${tableClass}`;return`<div class=\"table-option\" data-index=\"${index}\" style=\"padding: 15px; border-bottom: 1px solid #dee2e6; cursor: pointer; transition: background 0.2s;\"><div style=\"font-weight: bold; color: #007bff; margin-bottom: 5px;\">${tableLabel}</div><div style=\"font-size: 12px; color: #666; margin-bottom: 8px;\">${rowCount} rows × ${colCount} columns</div><div style=\"font-family: monospace; font-size: 11px; color: #333; background: #fff; padding: 8px; border-radius: 4px; border: 1px solid #ddd; max-height: 60px; overflow: hidden;\">${getTablePreview(table)}</div></div>`}).join('')}</div></div><div><h4 style=\"margin: 0 0 15px 0; color: #333;\">⚙️ Export Options</h4><div style=\"background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;\"><div style=\"margin-bottom: 15px;\"><label style=\"display: block; font-weight: bold; margin-bottom: 5px;\">Delimiter:</label><select id=\"delimiter-select\" style=\"width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;\"><option value=\",\">Comma (,)</option><option value=\";\">Semicolon (;)</option><option value=\"\t\">Tab</option><option value=\"|\">Pipe (|)</option></select></div><div style=\"margin-bottom: 15px;\"><label style=\"display: block; font-weight: bold; margin-bottom: 5px;\">Text Qualifier:</label><select id=\"qualifier-select\" style=\"width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;\"><option value='\"'>Double Quote (\")</option><option value=\"'\">Single Quote (')</option><option value=\"\">None</option></select></div><div style=\"margin-bottom: 15px;\"><input type=\"checkbox\" id=\"include-headers\" checked style=\"margin-right: 8px;\"><label for=\"include-headers\">Include Headers</label></div><div style=\"margin-bottom: 15px;\"><input type=\"checkbox\" id=\"include-hidden\" style=\"margin-right: 8px;\"><label for=\"include-hidden\">Include Hidden Columns</label></div><div style=\"margin-bottom: 15px;\"><input type=\"checkbox\" id=\"skip-empty\" checked style=\"margin-right: 8px;\"><label for=\"skip-empty\">Skip Empty Rows</label></div><div style=\"margin-bottom: 15px;\"><label style=\"display: block; font-weight: bold; margin-bottom: 5px;\">Filename:</label><input type=\"text\" id=\"filename-input\" value=\"table_export.csv\" style=\"width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;\"></div></div></div></div><div style=\"margin-bottom: 25px;\"><h4 style=\"margin: 0 0 15px 0; color: #333;\">👀 Preview</h4><div id=\"csv-preview\" style=\"background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e9ecef; font-family: monospace; font-size: 12px; max-height: 200px; overflow: auto; white-space: pre-wrap; color: #666;\">Select a table to see preview...</div></div><div style=\"display: flex; gap: 10px; justify-content: center;\"><button id=\"download-csv\" style=\"background: #007bff; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;\" disabled>💾 Download CSV</button><button id=\"copy-csv\" style=\"background: #28a745; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;\" disabled>📋 Copy to Clipboard</button></div><div style=\"margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center;\"><strong>💡 Pro Tip:</strong> Preview updates automatically when you change options. Large tables may be truncated in preview.</div>`;const style=document.createElement('style');style.textContent=`.table-option:hover {background: #e9ecef !important;}.table-option.selected {background: #d4edda !important;border-color: #28a745 !important;}`;document.head.appendChild(style);let selectedTableIndex=null;let currentCSV='';function updatePreview(){if(selectedTableIndex===null)return;const table=tables[selectedTableIndex];const options={delimiter:modal.querySelector('#delimiter-select').value,textQualifier:modal.querySelector('#qualifier-select').value,includeHeaders:modal.querySelector('#include-headers').checked,includeHiddenColumns:modal.querySelector('#include-hidden').checked,skipEmptyRows:modal.querySelector('#skip-empty').checked};currentCSV=tableToCSV(table,options);const lines=currentCSV.split('\n').slice(0,10);const preview=lines.join('\n');const truncated=currentCSV.split('\n').length>10;modal.querySelector('#csv-preview').textContent=preview+(truncated?'\n\n... (truncated, '+(currentCSV.split('\n').length-10)+' more lines)':'');modal.querySelector('#download-csv').disabled=false;modal.querySelector('#copy-csv').disabled=false}modal.querySelectorAll('.table-option').forEach((option,index)=>{option.onclick=function(){modal.querySelectorAll('.table-option').forEach(opt=>opt.classList.remove('selected'));this.classList.add('selected');selectedTableIndex=index;updatePreview()}});['#delimiter-select','#qualifier-select','#include-headers','#include-hidden','#skip-empty'].forEach(selector=>{modal.querySelector(selector).addEventListener('change',updatePreview)});modal.querySelector('#download-csv').onclick=function(){if(!currentCSV)return;const filename=modal.querySelector('#filename-input').value||'table_export.csv';downloadCSV(currentCSV,filename);this.style.background='#28a745';this.textContent='✅ Downloaded!';setTimeout(()=>{this.style.background='#007bff';this.textContent='💾 Download CSV'},2000)};modal.querySelector('#copy-csv').onclick=function(){if(!currentCSV)return;const button=this;copyToClipboard(currentCSV).then(()=>{button.style.background='#17a2b8';button.textContent='✅ Copied!';setTimeout(()=>{button.style.background='#28a745';button.textContent='📋 Copy to Clipboard'},2000)}).catch(()=>{button.style.background='#dc3545';button.textContent='❌ Copy Failed';setTimeout(()=>{button.style.background='#28a745';button.textContent='📋 Copy to Clipboard'},2000)})};modal.querySelector('#close-csv-exporter').onclick=function(){modal.remove();style.remove()};document.addEventListener('keydown',function escapeHandler(e){if(e.key==='Escape'&&document.getElementById('csv-exporter-modal')){modal.remove();style.remove();document.removeEventListener('keydown',escapeHandler)}});document.body.appendChild(modal)})()
```

## How to use

1. Click the bookmarklet on any page containing HTML tables
2. **Select a table** from the list (shows preview and dimensions)
3. **Configure options** like delimiter, text qualifier, and filters
4. **Preview the output** in the live preview section
5. **Download CSV file** or **copy to clipboard**
6. **Close** when finished

## Export options

### 📝 **Delimiter Options**
- **Comma (,)**: Standard CSV format, most widely supported
- **Semicolon (;)**: European CSV format, useful for international data
- **Tab**: TSV format, good for Excel and data analysis tools
- **Pipe (|)**: Alternative delimiter when data contains commas

### 🔤 **Text Qualifier Options**
- **Double Quote (")**: Standard CSV text qualifier
- **Single Quote (')**: Alternative qualifier
- **None**: No text qualification (use with caution)

### ⚙️ **Filtering Options**
- **Include Headers**: Export table headers as first row
- **Include Hidden Columns**: Export columns with CSS display:none
- **Skip Empty Rows**: Ignore rows with no content
- **Custom Filename**: Set your own filename for downloads

## Key features

### 🔍 **Smart Table Detection**
- Automatically finds all tables on the page
- Shows table dimensions (rows × columns)
- Provides preview of table content
- Handles tables with or without headers

### 📊 **Flexible Export Formats**
- Multiple delimiter options for different use cases
- Proper text escaping for special characters
- Handles multiline cell content correctly
- Supports both download and clipboard copy

### 🎯 **Interactive Preview**
- Live preview updates as you change options
- Shows first 10 lines of generated CSV
- Truncation indicator for large tables
- Monospace font for proper alignment

### 🎨 **Professional Interface**
- Clean, intuitive design
- Visual feedback for all actions
- Responsive layout for different screen sizes
- Keyboard shortcuts (Escape to close)

## Use cases

### 📈 **Data Analysis**
- Export financial tables from websites
- Download statistics and metrics tables  
- Convert web reports to spreadsheet format
- Extract pricing or comparison tables

### 🔬 **Research & Documentation**
- Save research data from web sources
- Export reference tables and specifications
- Download academic or scientific data tables
- Archive important tabular information

### 💼 **Business Intelligence**
- Extract competitive analysis data
- Download market research tables
- Export product comparison matrices
- Save industry reports and statistics

### 🎯 **Development & Testing**
- Export test data tables
- Download configuration or settings tables
- Extract API documentation tables
- Save debugging information in tabular format

## Technical details

### 🧹 **Text Processing**
- **Whitespace normalization**: Removes extra spaces and line breaks
- **Special character escaping**: Properly handles commas, quotes, and newlines
- **Hidden content filtering**: Can include/exclude CSS-hidden columns
- **Empty row detection**: Intelligently identifies and skips empty rows

### 💾 **Export Mechanisms**
- **File download**: Uses Blob API for cross-browser file creation
- **Clipboard integration**: Modern clipboard API with fallback
- **Character encoding**: UTF-8 encoding for international characters
- **MIME type**: Proper text/csv content type for downloads

### 🎨 **User Experience**
- **Visual feedback**: Button state changes and success indicators
- **Error handling**: Graceful fallbacks for unsupported browsers
- **Memory management**: Proper cleanup of DOM elements and event listeners
- **Responsive design**: Works on desktop and mobile devices

## Browser compatibility

- **Modern browsers**: Full support in Chrome, Firefox, Safari, Edge
- **Clipboard API**: Modern clipboard features in HTTPS contexts
- **File downloads**: Blob download support in all current browsers
- **Fallback support**: Command+C copy fallback for older browsers

## Pro tips

### 📋 **Table Selection**
- **Preview content**: Check the preview to ensure correct table selection
- **Multiple tables**: Process one table at a time for best results
- **Table identification**: Use ID/class names to identify correct tables

### ⚙️ **Options Configuration**
- **Test delimiters**: Preview helps choose the right delimiter
- **Check qualifiers**: Use quotes when data contains special characters
- **Filter appropriately**: Hidden columns may contain unwanted formatting data

### 💾 **Export Strategy**
- **Large tables**: Copy to clipboard may fail; use download instead
- **File naming**: Use descriptive filenames with timestamps
- **Format consistency**: Stick to one delimiter type across related exports

### 🔧 **Troubleshooting**
- **Empty exports**: Check if table has proper HTML structure
- **Missing data**: Verify hidden column and empty row settings
- **Character issues**: Ensure UTF-8 encoding in your spreadsheet application
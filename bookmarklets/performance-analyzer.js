// Performance Analyzer Bookmarklet
// Comprehensive page performance metrics and optimization insights

javascript:(function(){
    // Collect performance metrics
    function collectMetrics() {
        const nav = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        const resources = performance.getEntriesByType('resource');
        
        const metrics = {
            // Navigation timing
            domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd - nav.navigationStart) : 0,
            loadComplete: nav ? Math.round(nav.loadEventEnd - nav.navigationStart) : 0,
            domInteractive: nav ? Math.round(nav.domInteractive - nav.navigationStart) : 0,
            firstByte: nav ? Math.round(nav.responseStart - nav.navigationStart) : 0,
            
            // Paint timing
            firstPaint: 0,
            firstContentfulPaint: 0,
            
            // Resource metrics
            totalResources: resources.length,
            totalSize: 0,
            
            // DOM metrics
            domElements: document.querySelectorAll('*').length,
            images: document.images.length,
            scripts: document.scripts.length,
            stylesheets: document.styleSheets.length,
            
            // Memory (if available)
            memoryUsed: 0,
            memoryTotal: 0
        };
        
        // Paint metrics
        paint.forEach(entry => {
            if (entry.name === 'first-paint') {
                metrics.firstPaint = Math.round(entry.startTime);
            } else if (entry.name === 'first-contentful-paint') {
                metrics.firstContentfulPaint = Math.round(entry.startTime);
            }
        });
        
        // Calculate resource size
        resources.forEach(resource => {
            if (resource.transferSize) {
                metrics.totalSize += resource.transferSize;
            }
        });
        
        // Memory info (Chrome only)
        if (performance.memory) {
            metrics.memoryUsed = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
            metrics.memoryTotal = Math.round(performance.memory.totalJSHeapSize / 1024 / 1024);
        }
        
        return metrics;
    }
    
    // Get resource breakdown
    function getResourceBreakdown() {
        const resources = performance.getEntriesByType('resource');
        const breakdown = {
            images: { count: 0, size: 0 },
            scripts: { count: 0, size: 0 },
            stylesheets: { count: 0, size: 0 },
            fonts: { count: 0, size: 0 },
            xhr: { count: 0, size: 0 },
            other: { count: 0, size: 0 }
        };
        
        resources.forEach(resource => {
            let category = 'other';
            const initiatorType = resource.initiatorType;
            
            if (initiatorType === 'img' || resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
                category = 'images';
            } else if (initiatorType === 'script' || resource.name.match(/\.js$/i)) {
                category = 'scripts';
            } else if (initiatorType === 'link' || resource.name.match(/\.css$/i)) {
                category = 'stylesheets';
            } else if (resource.name.match(/\.(woff|woff2|ttf|otf|eot)$/i)) {
                category = 'fonts';
            } else if (initiatorType === 'xmlhttprequest' || initiatorType === 'fetch') {
                category = 'xhr';
            }
            
            breakdown[category].count++;
            if (resource.transferSize) {
                breakdown[category].size += resource.transferSize;
            }
        });
        
        return breakdown;
    }
    
    // Format bytes
    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Get performance score
    function getPerformanceScore(metrics) {
        let score = 100;
        
        // Deduct points based on metrics
        if (metrics.loadComplete > 3000) score -= 20;
        else if (metrics.loadComplete > 2000) score -= 10;
        
        if (metrics.firstContentfulPaint > 2000) score -= 15;
        else if (metrics.firstContentfulPaint > 1500) score -= 8;
        
        if (metrics.domElements > 1500) score -= 15;
        else if (metrics.domElements > 1000) score -= 8;
        
        if (metrics.totalSize > 3000000) score -= 20; // 3MB
        else if (metrics.totalSize > 1500000) score -= 10; // 1.5MB
        
        if (metrics.totalResources > 100) score -= 10;
        else if (metrics.totalResources > 50) score -= 5;
        
        return Math.max(0, score);
    }
    
    // Get recommendations
    function getRecommendations(metrics, breakdown) {
        const recommendations = [];
        
        if (metrics.loadComplete > 3000) {
            recommendations.push('🐌 Page load time is slow (>3s). Consider optimizing images and scripts.');
        }
        
        if (metrics.firstContentfulPaint > 2000) {
            recommendations.push('🎨 First Contentful Paint is slow (>2s). Optimize critical rendering path.');
        }
        
        if (breakdown.images.size > 1000000) {
            recommendations.push('🖼️ Large image payload (' + formatBytes(breakdown.images.size) + '). Compress images or use next-gen formats.');
        }
        
        if (breakdown.scripts.size > 500000) {
            recommendations.push('📜 Large JavaScript payload (' + formatBytes(breakdown.scripts.size) + '). Consider code splitting.');
        }
        
        if (metrics.domElements > 1500) {
            recommendations.push('🏗️ High DOM complexity (' + metrics.domElements + ' elements). Simplify page structure.');
        }
        
        if (metrics.totalResources > 100) {
            recommendations.push('📦 Too many HTTP requests (' + metrics.totalResources + '). Bundle resources or use HTTP/2.');
        }
        
        if (breakdown.fonts.count > 4) {
            recommendations.push('🔤 Too many font files (' + breakdown.fonts.count + '). Limit font variations.');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('✅ Great job! Your page performance looks good.');
        }
        
        return recommendations;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        border: 2px solid #333;
        border-radius: 12px;
        padding: 25px;
        width: 90%;
        max-width: 900px;
        max-height: 85vh;
        overflow-y: auto;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    `;
    
    const metrics = collectMetrics();
    const breakdown = getResourceBreakdown();
    const score = getPerformanceScore(metrics);
    const recommendations = getRecommendations(metrics, breakdown);
    
    // Get score color
    const getScoreColor = (score) => {
        if (score >= 90) return '#28a745';
        if (score >= 70) return '#ffc107';
        return '#dc3545';
    };
    
    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #eee; padding-bottom: 15px;">
            <h2 style="margin: 0; color: #333; font-size: 24px;">📊 Performance Analyzer</h2>
            <button onclick="this.parentElement.parentElement.remove()" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 16px;">✕</button>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
            <!-- Performance Score -->
            <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 10px; border: 2px solid #e9ecef;">
                <div style="font-size: 48px; font-weight: bold; color: ${getScoreColor(score)}; margin-bottom: 10px;">${score}</div>
                <div style="font-size: 18px; color: #333; font-weight: bold;">Performance Score</div>
                <div style="font-size: 14px; color: #666; margin-top: 5px;">
                    ${score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Work'}
                </div>
            </div>
            
            <!-- Key Metrics -->
            <div style="padding: 20px; background: #f8f9fa; border-radius: 10px; border: 2px solid #e9ecef;">
                <h4 style="margin: 0 0 15px 0; color: #333;">⚡ Key Metrics</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                    <div><strong>Load Complete:</strong></div>
                    <div style="color: ${metrics.loadComplete > 3000 ? '#dc3545' : metrics.loadComplete > 2000 ? '#ffc107' : '#28a745'};">
                        ${metrics.loadComplete}ms
                    </div>
                    
                    <div><strong>First Paint:</strong></div>
                    <div style="color: ${metrics.firstContentfulPaint > 2000 ? '#dc3545' : metrics.firstContentfulPaint > 1500 ? '#ffc107' : '#28a745'};">
                        ${metrics.firstContentfulPaint || metrics.firstPaint}ms
                    </div>
                    
                    <div><strong>DOM Elements:</strong></div>
                    <div style="color: ${metrics.domElements > 1500 ? '#dc3545' : metrics.domElements > 1000 ? '#ffc107' : '#28a745'};">
                        ${metrics.domElements}
                    </div>
                    
                    <div><strong>Total Size:</strong></div>
                    <div style="color: ${metrics.totalSize > 3000000 ? '#dc3545' : metrics.totalSize > 1500000 ? '#ffc107' : '#28a745'};">
                        ${formatBytes(metrics.totalSize)}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Detailed Metrics -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
            <div>
                <h4 style="margin: 0 0 15px 0; color: #333;">📈 Timing Metrics</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; font-size: 14px;">
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-bottom: 8px;">
                        <div>First Byte (TTFB)</div>
                        <div><strong>${metrics.firstByte}ms</strong></div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-bottom: 8px;">
                        <div>DOM Interactive</div>
                        <div><strong>${metrics.domInteractive}ms</strong></div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-bottom: 8px;">
                        <div>DOM Content Loaded</div>
                        <div><strong>${metrics.domContentLoaded}ms</strong></div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 10px;">
                        <div>Load Complete</div>
                        <div><strong>${metrics.loadComplete}ms</strong></div>
                    </div>
                </div>
            </div>
            
            <div>
                <h4 style="margin: 0 0 15px 0; color: #333;">📦 Resource Breakdown</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; font-size: 14px;">
                    ${Object.entries(breakdown).map(([type, data]) => `
                        <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 10px; margin-bottom: 8px;">
                            <div style="text-transform: capitalize;">${type}</div>
                            <div><strong>${data.count}</strong></div>
                            <div><strong>${formatBytes(data.size)}</strong></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <!-- Memory Usage (if available) -->
        ${metrics.memoryUsed ? `
            <div style="margin-bottom: 25px;">
                <h4 style="margin: 0 0 15px 0; color: #333;">🧠 Memory Usage</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; font-size: 14px;">
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 10px;">
                        <div>JavaScript Heap Used</div>
                        <div><strong>${metrics.memoryUsed} MB / ${metrics.memoryTotal} MB</strong></div>
                    </div>
                    <div style="margin-top: 10px; background: #e9ecef; height: 10px; border-radius: 5px; overflow: hidden;">
                        <div style="background: ${metrics.memoryUsed / metrics.memoryTotal > 0.8 ? '#dc3545' : '#007bff'}; height: 100%; width: ${(metrics.memoryUsed / metrics.memoryTotal * 100)}%; transition: width 0.3s ease;"></div>
                    </div>
                </div>
            </div>
        ` : ''}
        
        <!-- Recommendations -->
        <div style="margin-bottom: 15px;">
            <h4 style="margin: 0 0 15px 0; color: #333;">💡 Recommendations</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                ${recommendations.map(rec => `
                    <div style="padding: 8px 0; border-bottom: 1px solid #dee2e6; font-size: 14px;">
                        ${rec}
                    </div>
                `).join('').replace(/<div[^>]*>([^<]*)<\/div>$/, '<div style="padding: 8px 0; font-size: 14px;">$1</div>')}
            </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <div><strong>📍 Current URL:</strong> ${window.location.href}</div>
            <div style="margin-top: 5px;"><strong>🕐 Generated:</strong> ${new Date().toLocaleString()}</div>
        </div>
    `;
    
    document.body.appendChild(modal);
})();
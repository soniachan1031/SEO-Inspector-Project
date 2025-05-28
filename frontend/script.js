document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const loadingElement = document.getElementById('loading');
    const resultsContainer = document.getElementById('results-container');
    const seoTagsElement = document.getElementById('seo-tags');
    const scoreValueElement = document.getElementById('score-value');
    
    // Google preview elements
    const googleTitle = document.getElementById('google-title');
    const googleUrl = document.getElementById('google-url');
    const googleDescription = document.getElementById('google-description');
    
    // Social preview elements
    const socialTitle = document.getElementById('social-title');
    const socialDescription = document.getElementById('social-description');
    const socialImage = document.getElementById('social-image');
    const socialImageContainer = document.getElementById('social-image-container');
    
    // API endpoint - automatically use the current domain in production
    const API_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api/analyze'
        : '/api/analyze';
    
    // Function to ensure URL has protocol
    function ensureProtocol(url) {
        url = url.trim();
        if (!/^https?:\/\//i.test(url)) {
            return 'https://' + url;
        }
        return url;
    }
    
    // Function to validate URL - very permissive
    function isValidUrl(string) {
        // Accept almost anything as valid to avoid frustrating users
        return string && string.length > 0 && !string.includes(' ');
    }
    
    // Function to display status icon based on status
    function getStatusIcon(status) {
        switch (status) {
            case 'pass':
                return '<i class="fas fa-check-circle tag-status pass"></i>';
            case 'warning':
                return '<i class="fas fa-exclamation-triangle tag-status warning"></i>';
            case 'fail':
                return '<i class="fas fa-times-circle tag-status fail"></i>';
            default:
                return '';
        }
    }
    
    // Function to create tag items
    function createTagItem(name, result) {
        const { status, message, content } = result;
        
        const tagItem = document.createElement('div');
        tagItem.className = 'tag-item';
        
        // Format content for display (handle empty or undefined)
        const displayContent = content ? content : 'Not found';
        
        tagItem.innerHTML = `
            ${getStatusIcon(status)}
            <div class="tag-info">
                <div class="tag-name">${name}</div>
                <div class="tag-message">${message}</div>
                ${content ? `<div class="tag-content">${displayContent}</div>` : ''}
            </div>
        `;
        
        return tagItem;
    }
    
    // Function to display SEO analysis results
    function displayResults(data) {
        // Update score
        const { score, results, previewData } = data;
        scoreValueElement.textContent = score;
        
        // Update score circle color based on score
        const scoreCircle = document.querySelector('.score-circle');
        if (score >= 80) {
            scoreCircle.style.backgroundColor = '#28a745'; // Green
        } else if (score >= 50) {
            scoreCircle.style.backgroundColor = '#ffc107'; // Yellow
        } else {
            scoreCircle.style.backgroundColor = '#dc3545'; // Red
        }
        
        // Clear previous tags
        seoTagsElement.innerHTML = '';
        
        // Add tag items
        const displayNames = {
            title: 'Title',
            description: 'Meta Description',
            robots: 'Meta Robots',
            ogTitle: 'Open Graph Title',
            ogDescription: 'Open Graph Description',
            ogImage: 'Open Graph Image',
            twitterTitle: 'Twitter Title',
            twitterDescription: 'Twitter Description',
            twitterImage: 'Twitter Image'
        };
        
        for (const [key, result] of Object.entries(results)) {
            const displayName = displayNames[key] || key;
            const tagItem = createTagItem(displayName, result);
            seoTagsElement.appendChild(tagItem);
        }
        
        // Update Google preview
        const { google, social } = previewData;
        googleTitle.textContent = google.title;
        googleUrl.textContent = google.url;
        googleUrl.href = google.url;
        googleDescription.textContent = google.description;
        
        // Update Social preview
        socialTitle.textContent = social.title;
        socialDescription.textContent = social.description;
        
        if (social.image) {
            socialImage.src = social.image;
            socialImageContainer.style.display = 'flex';
        } else {
            socialImageContainer.style.display = 'none';
        }
        
        // Show results container
        resultsContainer.classList.remove('hidden');
    }
    
    // Event listener for analyze button
    analyzeBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        
        // Validate URL (very permissive)
        if (!url || !isValidUrl(url)) {
            alert('Please enter a valid URL');
            return;
        }
        
        // Add protocol if missing
        const fullUrl = ensureProtocol(url);
        
        // Update input with full URL
        urlInput.value = fullUrl;
        
        // Show loading and hide results
        loadingElement.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
        
        try {
            // Make API request to backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });
            
            if (!response.ok) {
                throw new Error('Failed to analyze URL');
            }
            
            const data = await response.json();
            
            // Hide loading
            loadingElement.classList.add('hidden');
            
            // Display results
            displayResults(data);
            
        } catch (error) {
            console.error('Error:', error);
            alert(`Error analyzing URL: ${error.message}`);
            loadingElement.classList.add('hidden');
        }
    });
    
    // Allow pressing Enter key to trigger analysis
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            analyzeBtn.click();
        }
    });
});

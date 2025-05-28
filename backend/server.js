const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Helper functions
const calculateScore = (results) => {
  const weights = {
    title: 15,
    description: 15,
    robots: 5,
    ogTitle: 10,
    ogDescription: 10,
    ogImage: 10,
    twitterTitle: 5,
    twitterDescription: 5,
    twitterImage: 5,
    titleLength: 10,
    descriptionLength: 10
  };

  let score = 0;
  let totalWeight = 0;

  for (const [key, status] of Object.entries(results)) {
    if (key in weights) {
      totalWeight += weights[key];
      
      if (status.status === 'pass') {
        score += weights[key];
      } else if (status.status === 'warning') {
        score += weights[key] * 0.5;
      }
    }
  }

  return Math.round((score / totalWeight) * 100);
};

// Route to analyze URL
// Helper function to ensure URL has protocol
const ensureProtocol = (url) => {
  url = url.trim();
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url;
  }
  return url;
};

// Very permissive URL validation
const isValidUrl = (url) => {
  // Accept almost anything as valid
  return url && url.length > 0 && !url.includes(' ');
};

app.post('/api/analyze', async (req, res) => {
  try {
    let { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    if (!isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    // Ensure URL has proper protocol
    url = ensureProtocol(url);

    // Fetch the HTML content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);
    
    // Extract and analyze SEO tags
    const title = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const metaRobots = $('meta[name="robots"]').attr('content') || '';
    
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';
    const ogDescription = $('meta[property="og:description"]').attr('content') || '';
    const ogImage = $('meta[property="og:image"]').attr('content') || '';
    
    const twitterTitle = $('meta[name="twitter:title"]').attr('content') || '';
    const twitterDescription = $('meta[name="twitter:description"]').attr('content') || '';
    const twitterImage = $('meta[name="twitter:image"]').attr('content') || '';

    // Analyze each tag
    const results = {
      title: {
        content: title,
        status: title ? (title.length > 10 ? 'pass' : 'warning') : 'fail',
        message: title ? 
          (title.length < 10 ? 'Title is too short' : 
           title.length > 60 ? 'Title is a bit long (should be 50-60 characters)' : 
           'Good title length') : 
          'Title tag is missing'
      },
      description: {
        content: metaDescription,
        status: metaDescription ? (metaDescription.length > 50 ? 'pass' : 'warning') : 'fail',
        message: metaDescription ? 
          (metaDescription.length < 50 ? 'Meta description is too short' : 
           metaDescription.length > 160 ? 'Meta description is too long (should be 50-160 characters)' : 
           'Good meta description length') : 
          'Meta description is missing'
      },
      robots: {
        content: metaRobots,
        status: metaRobots ? 'pass' : 'warning',
        message: metaRobots ? 'Robots meta tag is present' : 'Robots meta tag is missing'
      },
      ogTitle: {
        content: ogTitle,
        status: ogTitle ? 'pass' : 'warning',
        message: ogTitle ? 'OG Title is present' : 'OG Title is missing'
      },
      ogDescription: {
        content: ogDescription,
        status: ogDescription ? 'pass' : 'warning',
        message: ogDescription ? 'OG Description is present' : 'OG Description is missing'
      },
      ogImage: {
        content: ogImage,
        status: ogImage ? 'pass' : 'warning',
        message: ogImage ? 'OG Image is present' : 'OG Image is missing'
      },
      twitterTitle: {
        content: twitterTitle || ogTitle, // Falls back to OG title
        status: (twitterTitle || ogTitle) ? 'pass' : 'warning',
        message: twitterTitle ? 'Twitter Title is present' : 
                 ogTitle ? 'Twitter Title falls back to OG Title' : 'Twitter Title is missing'
      },
      twitterDescription: {
        content: twitterDescription || ogDescription, // Falls back to OG description
        status: (twitterDescription || ogDescription) ? 'pass' : 'warning',
        message: twitterDescription ? 'Twitter Description is present' : 
                 ogDescription ? 'Twitter Description falls back to OG Description' : 'Twitter Description is missing'
      },
      twitterImage: {
        content: twitterImage || ogImage, // Falls back to OG image
        status: (twitterImage || ogImage) ? 'pass' : 'warning',
        message: twitterImage ? 'Twitter Image is present' : 
                 ogImage ? 'Twitter Image falls back to OG Image' : 'Twitter Image is missing'
      }
    };

    // Calculate overall score
    const score = calculateScore(results);

    // Prepare preview data
    const previewData = {
      google: {
        title: title || 'No title',
        description: metaDescription || 'No description',
        url: url
      },
      social: {
        title: ogTitle || twitterTitle || title || 'No title',
        description: ogDescription || twitterDescription || metaDescription || 'No description',
        image: ogImage || twitterImage || '',
        url: url
      }
    };

    res.json({
      score,
      results,
      previewData
    });
    
  } catch (error) {
    console.error('Error analyzing URL:', error);
    res.status(500).json({ 
      error: 'Error analyzing URL', 
      message: error.message 
    });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server if not being imported (for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express API for Vercel
module.exports = app;

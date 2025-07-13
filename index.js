const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

let cachedData = { city: 'Israel', news: [], shabbat: { isActive: false, endTime: 'Unknown' } };

// Function to fetch news for Israel
async function fetchNews() {
  try {
    console.log('Fetching news... Key:', process.env.NEWSAPI_KEY ? 'Set' : 'Missing!'); // Debug: Check if key exists
    const res = await axios.get(`https://newsapi.org/v2/top-headlines?country=il&apiKey=${process.env.NEWSAPI_KEY}`);
    console.log('News fetched successfully:', res.data.articles.length); // Debug
    return res.data.articles.slice(0, 10).map(a => a.title);
  } catch (error) {
    console.error('News error:', error.message); // Improved error logging
    return [];
  }
}

// Function to fetch Shabbat times (Jerusalem; adjust city if needed)
async function fetchShabbat() {
  console.log('Fetching Shabbat...'); // Debug
  // Temporarily hardcoded for testing - remove after test!
  return { isActive: true, endTime: 'Test End Time (e.g., 20:28)' };
}

// Initial data fetch on startup
(async () => {
  console.log('Running initial data fetch on startup...');
  const news = await fetchNews();
  const shabbat = await fetchShabbat();
  cachedData = { city: 'Israel', news, shabbat };
  console.log('Initial fetch complete. cachedData:', JSON.stringify(cachedData)); // Debug
})();

// Poll data every 5 minutes
setInterval(async () => {
  console.log('Polling for updates...');
  const news = await fetchNews();
  const shabbat = await fetchShabbat();
  cachedData = { city: 'Israel', news, shabbat };
}, 300000); // 5 min

// API endpoint
app.get('/data', (req, res) => {
  res.json(cachedData);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

let cachedData = { city: 'Israel', news: [], shabbat: { isActive: false, endTime: 'Unknown' } };

// Function to fetch news for Israel
async function fetchNews() {
  try {
    console.log('Fetching news... Key:', process.env.NEWSAPI_KEY ? 'Set' : 'Missing!');
    const res = await axios.get(`https://newsapi.org/v2/everything?q=Israel emergency&language=en&sortBy=publishedAt&pageSize=10&apiKey=${process.env.NEWSAPI_KEY}`);
    console.log('News fetched successfully:', res.data.totalResults);
    return res.data.articles.map(a => a.title);
  } catch (error) {
    console.error('News error:', error.message, error.response ? error.response.data : '');
    return [];
  }
}

// Function to fetch Shabbat times (Jerusalem; adjust city if needed)
async function fetchShabbat() {
  console.log('Fetching Shabbat...');
  // Temporarily hardcoded for testing - remove after test!
  return { isActive: true, endTime: 'Test End Time (e.g., 20:28)' };
}

// Initial data fetch on startup
(async () => {
  console.log('Running initial data fetch on startup...');
  const news = await fetchNews();
  const shabbat = await fetchShabbat();
  cachedData = { city: 'Israel', news, shabbat };
  console.log('Initial fetch complete. cachedData:', JSON.stringify(cachedData));
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

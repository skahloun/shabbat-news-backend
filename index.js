const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

let cachedData = { city: 'Israel', news: [], shabbat: { isActive: false, endTime: 'Unknown' } };

// Function to fetch news for Israel
async function fetchNews() {
  try {
    const res = await axios.get(`https://newsapi.org/v2/top-headlines?country=il&apiKey=${process.env.NEWSAPI_KEY}`);
    return res.data.articles.slice(0, 10).map(a => a.title);
  } catch (error) {
    console.error('News error:', error);
    return [];
  }
}

// Function to fetch Shabbat times (Jerusalem; adjust city if needed)
async function fetchShabbat() {
  // Temporarily hardcoded for testing - remove after test!
  return { isActive: true, endTime: 'Test End Time (e.g., 20:28)' };
}

// Poll data every 5 minutes
setInterval(async () => {
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

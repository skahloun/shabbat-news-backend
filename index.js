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
  try {
    const res = await axios.get('https://www.hebcal.com/shabbat?cfg=json&city=Jerusalem&m=50');
    const items = res.data.items;
    const havdalah = items.find(i => i.category === 'havdalah');
    const now = new Date();
    const endTime = new Date(havdalah.date);
    const isActive = now < endTime && now > new Date(items.find(i => i.category === 'candles').date);
    return { isActive, endTime: endTime.toLocaleString() };
  } catch (error) {
    console.error('Shabbat error:', error);
    return { isActive: false, endTime: 'Unknown' };
  }
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

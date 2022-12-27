import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

const checkAvailability = async (url) => {
  try {
    const response = await axios.get(url);
    return {
      url: url,
      status: 'available',
      date: new Date()

    };
  } catch (error) {
    return {
      url: url,
      status: 'unavailable',
      date: new Date()
    };
  }
};

let results = [];

const checkSites = async () => {
  const sites = ['https://test.kwiecien.dev', 'https://kwiecien.dev'];
  try {
    results = await Promise.all(
      sites.map((site) => checkAvailability(site))
    );
  } catch (error) {
    console.error(error);
  }
};

setInterval(checkSites, 5000);

app.get('/sites', (req, res) => {
  res.json(results);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
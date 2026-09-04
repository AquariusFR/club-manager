const cheerio = require('cheerio');
const fs = require('fs');

async function testScrape() {
  try {
    const res = await fetch('https://eure-et-loir.fff.fr/les-clubs/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    fs.writeFileSync('temp_clubs.html', html);
    console.log('Saved temp_clubs.html');
  } catch (err) {
    console.error('Exception:', err);
  }
}

testScrape();

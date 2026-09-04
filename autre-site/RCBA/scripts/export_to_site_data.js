const fs = require('fs');
const path = require('path');

const SCRAPED_DATA_PATH = path.join(__dirname, '..', '..', 'scraped_data.json');
const SITE_DATA_DIR = path.join(__dirname, '..', '..', 'site-modern', 'src', 'data');

function loadJSON(filePath) {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return null;
}

function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${path.basename(filePath)}`);
}

async function exportData() {
  const scrapedData = loadJSON(SCRAPED_DATA_PATH);
  if (!scrapedData) {
    console.error("Scraped data not found!");
    return;
  }

  // 1. Update club.json (leaders)
  const clubPath = path.join(SITE_DATA_DIR, 'club.json');
  const clubData = loadJSON(clubPath);
  if (clubData) {
    const existingLeaders = clubData.dirigeants || [];
    const newLeaders = scrapedData.leaders.map(leader => {
      const existing = existingLeaders.find(l => l.name.toLowerCase() === leader.name.toLowerCase());
      return {
        name: leader.name,
        role: leader.role,
        image: leader.image || (existing ? existing.image : undefined)
      };
    });
    clubData.dirigeants = newLeaders;
    saveJSON(clubPath, clubData);
  }

  // 2. Update partners.json
  const partnersPath = path.join(SITE_DATA_DIR, 'partners.json');
  const existingPartners = loadJSON(partnersPath) || [];
  const newPartners = scrapedData.partners.map(partner => {
    const existing = existingPartners.find(p => p.name.toLowerCase() === partner.name.toLowerCase());
    return {
      name: partner.name,
      category: existing ? existing.category : "Partenaire"
    };
  });
  saveJSON(partnersPath, newPartners);

  // 3. Update teams.json (latestResults)
  const teamsPath = path.join(SITE_DATA_DIR, 'teams.json');
  const teamsData = loadJSON(teamsPath);
  if (teamsData) {
    teamsData.forEach(team => {
      // Map team.id/name to scraped results
      // res.equipe is e.g. "R.C.B.A. - Senior"
      const results = scrapedData.recent_results.filter(res => {
        const cat = res.equipe.split(' - ')[1];
        if (!cat) return false;
        return team.name.toLowerCase().includes(cat.toLowerCase()) || 
               team.id.toLowerCase().includes(cat.toLowerCase());
      });

      if (results.length > 0) {
        team.latestResults = results.map(r => ({
          opponent: r.adversaire,
          result: r.statut,
          score: r.score,
          date: r.date
        }));
      }
    });
    saveJSON(teamsPath, teamsData);
  }

  // 4. Update matches.json (last match)
  const matchesPath = path.join(SITE_DATA_DIR, 'matches.json');
  const matchesData = loadJSON(matchesPath);
  if (matchesData && scrapedData.recent_results.length > 0) {
    const lastResult = scrapedData.recent_results[0]; // Assuming it's sorted by date desc
    const seniorResult = scrapedData.recent_results.find(r => r.equipe.includes("Senior"));
    
    if (seniorResult) {
      // Update the "Dernier résultat" entry
      const lastMatchIndex = matchesData.findIndex(m => m.status === "Dernier résultat");
      if (lastMatchIndex !== -1) {
        matchesData[lastMatchIndex].date = seniorResult.date;
        matchesData[lastMatchIndex].away = seniorResult.adversaire;
        matchesData[lastMatchIndex].score = seniorResult.score;
        matchesData[lastMatchIndex].result = seniorResult.statut;
      }
      saveJSON(matchesPath, matchesData);
    }
  }

  console.log("All site-modern data files updated successfully.");
}

exportData().catch(console.error);

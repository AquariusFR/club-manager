
const { generateNewIntelligenceAction, getDetailedIntelligenceLogAction } = require('./lib/actions');
const path = require('path');

async function debug() {
  console.log("Current working directory:", process.cwd());
  console.log("Generating new intelligence...");
  const result = await generateNewIntelligenceAction();
  console.log("Result:", result);
  
  if (result.success) {
    console.log("New items generated:", result.count);
    const feed = await getDetailedIntelligenceLogAction(5);
    console.log("Latest 5 items in feed:");
    feed.forEach(item => {
      console.log(`[${item.date}] [${item.type}] ${item.titre}`);
    });
  } else {
    console.error("Error:", result.error);
  }
}

debug().catch(console.error);


import { generateNewIntelligenceAction, getDetailedIntelligenceLogAction } from '../lib/actions';

async function debug() {
  console.log("--- DEBUG INTELLIGENCE GENERATION ---");
  try {
    console.log("Running generateNewIntelligenceAction...");
    const result = await generateNewIntelligenceAction() as any;
    console.log("Result:", JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log(`Success! Inserted ${result.count} items.`);
      const feed = await getDetailedIntelligenceLogAction(10);
      console.log("Latest 10 items in feed:");
      feed.forEach((item: any) => {
        console.log(`[${item.date}] [${item.type}] [${item.gravite}] ${item.titre}`);
      });
    } else {
      console.error("Action returned failure:", result.error);
    }
  } catch (error) {
    console.error("CRITICAL ERROR during debug:", error);
  }
}

debug();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GW2_API_BASE = 'https://api.guildwars2.com/v2';
const CHUNK_SIZE = 200;
const RATE_LIMIT_DELAY = 250; // ms between requests
const OUTPUT_DIR = path.join(__dirname, '../public/data');

// Utility: Sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Utility: Format number with commas
const formatNumber = (num) => num.toLocaleString('en-US');

// Utility: Create progress bar
const createProgressBar = (current, total, width = 50) => {
  const percentage = Math.floor((current / total) * 100);
  const filledWidth = Math.floor((current / total) * width);
  const emptyWidth = width - filledWidth;
  const bar = '='.repeat(filledWidth) + '>'.padEnd(emptyWidth, ' ');
  return `[${bar}] ${percentage}% (${formatNumber(current)}/${formatNumber(total)})`;
};

// Fetch with error handling
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// Fetch all IDs for a resource
async function fetchIds(resource) {
  const url = `${GW2_API_BASE}/${resource}`;
  return fetchJson(url);
}

// Fetch data in chunks with progress
async function fetchInChunks(resource, ids, label) {
  const chunks = [];
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    chunks.push(ids.slice(i, i + CHUNK_SIZE));
  }

  const allData = [];
  let processedCount = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const url = `${GW2_API_BASE}/${resource}?ids=${chunk.join(',')}`;

    try {
      const data = await fetchJson(url);
      allData.push(...data);
      processedCount += chunk.length;

      // Update progress
      process.stdout.write(`\r${label} ${createProgressBar(processedCount, ids.length)}`);

      // Rate limiting - don't delay after the last chunk
      if (i < chunks.length - 1) {
        await sleep(RATE_LIMIT_DELAY);
      }
    } catch (error) {
      console.error(`\nError fetching chunk ${i + 1}/${chunks.length}:`, error.message);
      // Continue with next chunk instead of failing completely
    }
  }

  console.log(); // New line after progress bar
  return allData;
}

// Ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Save JSON file
function saveJsonFile(filename, data) {
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Main execution
async function main() {
  console.log('GW2 Data Updater');
  console.log('================\n');

  try {
    // Ensure output directory exists
    ensureDirectoryExists(OUTPUT_DIR);

    // Fetch items
    console.log('Fetching item IDs...');
    const itemIds = await fetchIds('items');
    console.log(`Found ${formatNumber(itemIds.length)} items\n`);

    const items = await fetchInChunks('items', itemIds, 'Fetching items...');
    console.log(`Successfully fetched ${formatNumber(items.length)} items\n`);

    // Fetch recipes
    console.log('Fetching recipe IDs...');
    const recipeIds = await fetchIds('recipes');
    console.log(`Found ${formatNumber(recipeIds.length)} recipes\n`);

    const recipes = await fetchInChunks('recipes', recipeIds, 'Fetching recipes...');
    console.log(`Successfully fetched ${formatNumber(recipes.length)} recipes\n`);

    // Save files
    console.log('Saving files...');

    saveJsonFile('items.json', items);
    console.log(`  ✓ Saved items.json`);

    saveJsonFile('recipes.json', recipes);
    console.log(`  ✓ Saved recipes.json`);

    const now = new Date().toISOString();
    const meta = {
      lastUpdated: now,
      itemCount: items.length,
      recipeCount: recipes.length
    };
    saveJsonFile('meta.json', meta);
    console.log(`  ✓ Saved meta.json`);

    console.log(`\nDone! Updated at ${now}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();

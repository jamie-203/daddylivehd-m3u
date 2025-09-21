// merge.js
const fs = require("fs");
const path = require("path");

console.log("🟢 merge.js starting…");

// League playlists
const playlists = ["nba.m3u","nhl.m3u","mlb.m3u","nfl.m3u","mls.m3u","wnba.m3u","ufc.m3u","boxing.m3u"];

let merged = "#EXTM3U\n";
let addedCount = 0;

playlists.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`➡️ Adding playlist: ${file}`);
    try {
      const content = fs.readFileSync(filePath, "utf8");
      merged += content.replace(/^#EXTM3U\s*/i, "") + "\n";
      addedCount++;
    } catch (err) {
      console.warn(`⚠️ Failed to read ${file}: ${err.message}`);
    }
  } else {
    console.warn(`⚠️ Missing file: ${file} (skipping)`);
  }
});

merged = merged.trim();

const outputFile = path.join(__dirname, "merged.m3u");
try {
  fs.writeFileSync(outputFile, merged, "utf8");
  console.log(`✅ Merged playlist saved as ${outputFile}`);
  console.log(`ℹ️ Total playlists merged: ${addedCount} / ${playlists.length}`);
} catch (err) {
  console.warn(`⚠️ Failed to write merged playlist: ${err.message}`);
}

console.log("🟢 merge.js completed successfully.");
process.exit(0);

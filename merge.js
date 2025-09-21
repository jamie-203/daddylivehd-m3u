// merge.js
const fs = require("fs");
const path = require("path");

// 👇 Playlists to merge (adjust if you add/remove leagues)
const playlists = [
  "nba.m3u",
  "nhl.m3u",
  "mlb.m3u",
  "nfl.m3u",
  "mls.m3u",
  "wnba.m3u",
  "ufc.m3u",
  "boxing.m3u"
];

let merged = "#EXTM3U\n";

playlists.forEach(file => {
  const filePath = path.join(__dirname, file);

  if (fs.existsSync(filePath)) {
    console.log(`➡️  Adding ${file}`);
    const content = fs.readFileSync(filePath, "utf8");

    // Remove extra headers so only the first one stays
    merged += content.replace(/^#EXTM3U\s*/i, "") + "\n";
  } else {
    console.warn(`⚠️  Missing file: ${file}`);
  }
});

fs.writeFileSync(path.join(__dirname, "merged.m3u"), merged.trim());
console.log("✅ Merged playlist saved as merged.m3u");

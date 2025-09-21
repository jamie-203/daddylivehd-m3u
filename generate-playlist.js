// generate-playlist.js
const fs = require("fs");
const path = require("path");

const league = process.argv[2];
if (!league) {
  console.error("⚠️ Please provide a league name, e.g., node generate-playlist.js nba");
  process.exit(0); 
}

console.log(`🟢 Generating playlist for league: ${league}`);

// Dummy events — replace with your actual schedule API
const events = [
  { name: `${league.toUpperCase()} Event 1`, url: `http://example.com/${league}/1` },
  { name: `${league.toUpperCase()} Event 2`, url: `http://example.com/${league}/2` },
  { name: `${league.toUpperCase()} Event 3`, url: `http://example.com/${league}/3` },
];

let m3u = "#EXTM3U\n";
events.forEach(ev => {
  m3u += `#EXTINF:-1,${ev.name}\n${ev.url}\n`;
});

const filename = path.join(__dirname, `${league}.m3u`);
try {
  fs.writeFileSync(filename, m3u, "utf8");
  console.log(`✅ Playlist saved as ${filename}`);
} catch (err) {
  console.warn(`⚠️ Failed to write playlist: ${err.message}`);
}

process.exit(0);

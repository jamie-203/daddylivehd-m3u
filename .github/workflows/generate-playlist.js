import fs from "fs";
import fetch from "node-fetch";

function isEnglish(text) {
  // allow ASCII only (English letters, numbers, punctuation)
  return /^[\x00-\x7F]+$/.test(text);
}

function filterEnglishEvents(events) {
  return events.filter(event => {
    // Grab channel name at the end in (CHANNEL NAME)
    const match = event.event.match(/\(([^)]+)\)$/);
    if (!match) return true; // keep if no channel info
    const channelName = match[1].trim();
    return isEnglish(channelName);
  });
}

async function generatePlaylist() {
  const res = await fetch("https://your-api-or-source-here");
  const allEvents = await res.json();

  // Filter only English channels
  const englishEvents = filterEnglishEvents(allEvents);

  // Build M3U
  let m3u = "#EXTM3U\n";
  for (const e of englishEvents) {
    m3u += `#EXTINF:-1,${e.event}\n${e.url}\n`;
  }

  fs.writeFileSync("playlist.m3u", m3u, "utf8");
  console.log("playlist.m3u generated with English-only channels ✅");
}

generatePlaylist().catch(err => {
  console.error("Error generating playlist:", err);
  process.exit(1);
});

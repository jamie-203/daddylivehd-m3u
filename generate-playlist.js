import fs from "fs";
import fetch from "node-fetch";

const API_URL = "https://daddylivestream.com/schedule/schedule-generated.php";
const OUTPUT_FILE = "daddylive.m3u";

// league mapping function
function detectLeague(eventName) {
  const name = eventName.toLowerCase();

  if (name.includes("nba")) return "NBA";
  if (name.includes("wnba")) return "WNBA";
  if (name.includes("nfl")) return "NFL";
  if (name.includes("mlb")) return "MLB";
  if (name.includes("nhl")) return "NHL";
  if (name.includes("cfl")) return "CFL";
  if (name.includes("college")) return "College Sports";
  if (name.includes("ufc") || name.includes("mma")) return "UFC";
  if (name.includes("boxing")) return "Boxing";
  if (name.includes("wwe") || name.includes("aew")) return "Wrestling";
  if (name.includes("tv") || name.includes("show")) return "TV Shows";

  return "Other";
}

async function generateM3U() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Failed to fetch API: ${res.status}`);
    const data = await res.json();

    let playlist = "#EXTM3U\n";

    for (const event of data.events || data.Events || []) {
      const league = detectLeague(event.event);

      for (const channel of event.channels) {
        const streamUrl = `https://daddylivestream.com/channels/${channel.channel_id}.m3u8`;

        playlist += `#EXTINF:-1 group-title="${league}" tvg-id="${channel.channel_id}" tvg-name="${channel.channel_name}", ${event.event} (${channel.channel_name})\n`;
        playlist += `${streamUrl}\n`;
      }
    }

    fs.writeFileSync(OUTPUT_FILE, playlist, "utf8");
    console.log(`✅ Playlist updated: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error("❌ Error generating playlist:", err);
  }
}

generateM3U();

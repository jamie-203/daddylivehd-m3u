import fs from "fs";
import fetch from "node-fetch";

const API_URL = "https://daddylivestream.com/schedule/schedule-generated.php";

// leagues we care about
const LEAGUES = [
  "NBA",
  "WNBA",
  "NFL",
  "MLB",
  "NHL",
  "CFL",
  "College Sports",
  "UFC",
  "Boxing",
  "Wrestling",
  "TV Shows",
  "Other",
];

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

function buildM3U(events, filterLeague = null) {
  let playlist = "#EXTM3U\n";

  for (const event of events) {
    const league = detectLeague(event.event);

    if (filterLeague && league !== filterLeague) continue;

    for (const channel of event.channels) {
      const streamUrl = `https://daddylivestream.com/channels/${channel.channel_id}.m3u8`;

      playlist += `#EXTINF:-1 group-title="${league}" tvg-id="${channel.channel_id}" tvg-name="${channel.channel_name}", ${event.event} (${channel.channel_name})\n`;
      playlist += `${streamUrl}\n`;
    }
  }

  return playlist;
}

async function generatePlaylists() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Failed to fetch API: ${res.status}`);
    const data = await res.json();
    const events = data.events || data.Events || [];

    // merged playlist
    fs.writeFileSync("daddylive.m3u", buildM3U(events), "utf8");
    console.log("✅ Wrote daddylive.m3u");

    // per-league playlists
    for (const league of LEAGUES) {
      const filename = `${league.toLowerCase().replace(/\s+/g, "")}.m3u`;
      fs.writeFileSync(filename, buildM3U(events, league), "utf8");
      console.log(`✅ Wrote ${filename}`);
    }
  } catch (err) {
    console.error("❌ Error generating playlists:", err);
  }
}

generatePlaylists();

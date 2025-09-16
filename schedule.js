import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    // Fetch DaddyLive schedule with browser headers to bypass Cloudflare
    const response = await fetch(
      "https://daddylivestream.com/schedule/schedule-generated.php",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      }
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .send(`Error fetching schedule: ${response.status}`);
    }

    // Convert to JSON and send
    const text = await response.text();
    res.status(200).json(JSON.parse(text));
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
}

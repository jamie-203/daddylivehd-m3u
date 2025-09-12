export default async function handler(req, res) {
  const target = "https://daddylivehd.sx/schedule"; // or another DaddyLive page

  try {
    const response = await fetch(target, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const text = await response.text();

    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify({ html: text }));
  } catch (e) {
    res.status(500).send({ error: e.toString() });
  }
}

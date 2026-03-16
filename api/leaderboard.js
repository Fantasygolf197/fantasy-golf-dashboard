
export default async function handler(req, res) {
  try {
    const response = await fetch("https://site.api.espn.com/apis/v2/sports/golf/pga/leaderboard");
    const data = await response.json();

    const competitors = data?.events?.[0]?.competitions?.[0]?.competitors || [];

    const players = competitors.slice(0, 50).map((p) => ({
      name: p?.athlete?.displayName || "",
      pos: p?.status?.position || "",
      score: p?.score || "",
      thru: p?.status?.thru || ""
    }));

    res.status(200).json({ players });

  } catch (err) {
    res.status(500).json({
      error: "Leaderboard fetch failed",
      details: err.message
    });
  }
}

export default async function handler(req, res) {
  try {
    const response = await fetch("https://site.api.espn.com/apis/v2/sports/golf/pga/leaderboard");
    const data = await response.json();

    let competitors = [];

    if (data?.events?.[0]?.competitions?.[0]?.competitors) {
      competitors = data.events[0].competitions[0].competitors;
    } else if (data?.events?.[0]?.competitors) {
      competitors = data.events[0].competitors;
    } else if (data?.competitors) {
      competitors = data.competitors;
    }

    const players = competitors.slice(0, 50).map((p) => ({
      name: p?.athlete?.displayName || p?.athlete?.fullName || "",
      pos: p?.status?.position || p?.position || "",
      score: p?.score || p?.status?.displayValue || "",
      thru: p?.status?.thru || p?.status?.displayThru || ""
    }));

    res.status(200).json({
      players,
      debug: {
        hasEvents: !!data?.events,
        hasCompetitions: !!data?.events?.[0]?.competitions,
        competitorCount: competitors.length
      }
    });

  } catch (err) {
    res.status(500).json({
      error: "Leaderboard fetch failed",
      details: err.message
    });
  }
}

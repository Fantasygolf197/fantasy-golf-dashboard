// update
export default async function handler(req, res) {
  try {
    const headerResponse = await fetch(
      "https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=golf&league=pga&region=us&lang=en&contentorigin=espn"
    );

    const headerData = await headerResponse.json();

    const eventId =
      headerData?.sports?.[0]?.leagues?.[0]?.events?.[0]?.id || null;

    if (!eventId) {
      return res.status(200).json({
        players: [],
        debug: {
          step: "header",
          eventId: null,
          message: "No current PGA event found"
        }
      });
    }

    const leaderboardResponse = await fetch(
      `https://site.web.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard/players?event=${eventId}`
    );

    const leaderboardData = await leaderboardResponse.json();

    const leaderboard = leaderboardData?.leaderboard || [];

    const players = leaderboard.slice(0, 50).map((p) => ({
      name: p?.displayName || p?.athlete?.displayName || "",
      pos: p?.position?.displayValue || p?.position || "",
      score: p?.toPar || p?.total || "",
      thru: p?.thru || p?.today || ""
    }));

    return res.status(200).json({
      players,
      debug: {
        step: "leaderboard",
        eventId,
        count: players.length
      }
    });
  } catch (err) {
    return res.status(500).json({
      error: "Leaderboard fetch failed",
      details: err.message
    });
  }
}

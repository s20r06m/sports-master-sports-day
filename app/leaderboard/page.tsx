import { supabase } from "@/lib/supabase";
import CurrentUserBar from "@/components/CurrentUserBar";
import ProtectedRoute from "@/components/ProtectedRoute";

type User = {
  firstname: string | null;
  lastname: string | null;
  house: string | null;
  participationcount: number | null;
  firstplacecount: number | null;
  secondplacecount: number | null;
  thirdplacecount: number | null;
};

type LeaderboardUser = User & {
  totalPoints: number;
};

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const { data, error } = await supabase
    .from("users")
    .select(
  "firstname, lastname, house, role, participationcount, firstplacecount, secondplacecount, thirdplacecount"
);

  if (error) {
    return (
      <main>
        <h1>Leaderboard</h1>
        <p>Unable to load users.</p>
      </main>
    );
  }

  const users = (data ?? [])
  .filter((user) => user.role !== "admin") as User[];
  const teamTotals = users.reduce((acc, user) => {
    const house = (user.house ?? "default").toLowerCase();

    const points =
      (user.participationcount ?? 0) * 1 +
      (user.firstplacecount ?? 0) * 4 +
      (user.secondplacecount ?? 0) * 3 +
      (user.thirdplacecount ?? 0) * 2;

    if (!acc[house]) {
      acc[house] = 0;
    }

    acc[house] += points;

    return acc;
  }, {} as Record<string, number>);

  const leaderboard: LeaderboardUser[] = users
    .map((user) => {
      const participation = user.participationcount ?? 0;
      const firstPlace = user.firstplacecount ?? 0;
      const secondPlace = user.secondplacecount ?? 0;
      const thirdPlace = user.thirdplacecount ?? 0;

      return {
        ...user,
        totalPoints:
          participation * 1 +
          firstPlace * 4 +
          secondPlace * 3 +
          thirdPlace * 2,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return (<ProtectedRoute>
    <main>
      <CurrentUserBar />
      <h1>Leaderboard</h1>
      
      <p><b>POINTS SYSTEM:</b> Participated: +1 | Third Place: +2 | Second Place: +3 | First Place: +4 </p>
      <div className="team-grid">
        <div className="team-card house-red">
          <h3>Red Team</h3>
          <p className="team-points">{teamTotals["red"] ?? 0} pts</p>
        </div>

        <div className="team-card house-blue">
          <h3>Blue Team</h3>
          <p className="team-points">{teamTotals["blue"] ?? 0} pts</p>
        </div>

        <div className="team-card house-green">
          <h3>Green Team</h3>
          <p className="team-points">{teamTotals["green"] ?? 0} pts</p>
        </div>

        <div className="team-card house-yellow">
          <h3>Yellow Team</h3>
          <p className="team-points">{teamTotals["yellow"] ?? 0} pts</p>
        </div>
      </div>

      <ul className="leaderboard-list">
        {leaderboard.map((user, index) => {
          const houseClass = `house-${(user.house ?? "default")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")}`;

          return (
            <li className={`leaderboard-item ${houseClass}`} key={index}>
              <div className="user-summary">
                <div className="user-name">
                  {index + 1}. {user.firstname ?? ""} {user.lastname ?? ""}
                </div>
                <div className="user-stats">
                  <span>P: <b>{user.participationcount ?? 0}</b></span>
                  <span>1st: <b>{user.firstplacecount ?? 0}</b></span>
                  <span>2nd: <b>{user.secondplacecount ?? 0}</b></span>
                  <span>3rd: <b>{user.thirdplacecount ?? 0}</b></span>
                </div>
              </div>
              <div className="user-points">{user.totalPoints} pts</div>
            </li>
          );
        })}
      </ul>
    </main>
  </ProtectedRoute>
  );
}

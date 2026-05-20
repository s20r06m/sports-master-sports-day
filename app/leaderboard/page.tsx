import { supabase } from "@/lib/supabase";

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

export default async function LeaderboardPage() {
  const { data, error } = await supabase
    .from<User>("users")
    .select(
      "firstname, lastname, house, participationcount, firstplacecount, secondplacecount, thirdplacecount"
    );

  if (error) {
    return (
      <main>
        <h1>Leaderboard</h1>
        <p>Unable to load users.</p>
      </main>
    );
  }

  const leaderboard: LeaderboardUser[] = (data ?? [])
    .map((user) => {
      const participation = user.participationcount ?? 0;
      const firstPlace = user.firstplacecount ?? 0;
      const secondPlace = user.secondplacecount ?? 0;
      const thirdPlace = user.thirdplacecount ?? 0;
      return {
        ...user,
        totalPoints: participation * 1 + firstPlace * 4 + secondPlace * 3 + thirdPlace * 2,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <main>
      <h1>Leaderboard</h1>
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
  );
}

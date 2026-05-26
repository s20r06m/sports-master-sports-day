import ProtectedRoute from "@/components/ProtectedRoute";
import CurrentUserBar from "@/components/CurrentUserBar";
import MatchupsAdmin from "@/components/MatchupsAdmin";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <main>
        <CurrentUserBar />
<h1>Matchups</h1>
<div className="admin-card">
  <MatchupsAdmin/>
</div>
      </main>
    </ProtectedRoute>
  );
}
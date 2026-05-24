import ProtectedRoute from "@/components/ProtectedRoute";
import CurrentUserBar from "@/components/CurrentUserBar";
import EventAdmin from "@/components/EventAdmin";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <main>
        <CurrentUserBar />

        <h1>Admin</h1>

        <div className="admin-sections">

          <div className="admin-card">
            <h2>Event Management</h2>
            <EventAdmin />
          </div>

          <div className="admin-card">
            <h2>User Management</h2>
          </div>

        </div>
      </main>
    </ProtectedRoute>
  );
}
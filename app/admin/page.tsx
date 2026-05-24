import ProtectedRoute from "@/components/ProtectedRoute";
import CurrentUserBar from "@/components/CurrentUserBar";
import EventAdmin from "@/components/EventAdmin";
import UserAdmin from "@/components/UserAdmin";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <main>
        <CurrentUserBar />

        <div className="admin-sections">
          {/* EVENTS */}
          <h1>Event Management</h1>
          <div className="admin-card">
            <EventAdmin />
          </div>

          {/* USERS */}
          <h1>User Management</h1>

          <div className="admin-card">
            <UserAdmin />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
import ProtectedRoute from "@/components/ProtectedRoute";
import CurrentUserBar from "@/components/CurrentUserBar";
import EventAdmin from "@/components/EventAdmin";
import UserAdmin from "@/components/UserAdmin";
import DetailsAdmin from "@/components/DetailsAdmin";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <main>
        <CurrentUserBar />
        <div className="admin-sections">
          {/*Event Details*/}
          <h1>Event Details</h1>
          <div className="admin-card">
            <DetailsAdmin />
          </div>
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
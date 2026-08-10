import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container">
      <div className="card">
        <h1>Event Management System</h1>
        {isAuthenticated ? (
          <p>
            Welcome back, <strong>{user.name}</strong> ({user.role}). Use the
            navigation bar above to go to your dashboard.
          </p>
        ) : (
          <>
            <p>
              Admins create events, students register for events, and faculty
              view participation reports.
            </p>
            <p>
              <Link to="/login">Login</Link> or{" "}
              <Link to="/register">create an account</Link> to get started.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

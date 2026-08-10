import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="navbar">
      <div>
        <Link to="/">Event Management</Link>
        {isAuthenticated && user.role === "ADMIN" && (
          <Link to="/admin">Admin Dashboard</Link>
        )}
        {isAuthenticated && user.role === "STUDENT" && (
          <Link to="/student">Student Dashboard</Link>
        )}
        {isAuthenticated && user.role === "FACULTY" && (
          <Link to="/faculty">Faculty Dashboard</Link>
        )}
      </div>
      <div className="right">
        {isAuthenticated ? (
          <>
            <span style={{ marginRight: 12 }}>
              {user.name} <span className="badge">{user.role}</span>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}

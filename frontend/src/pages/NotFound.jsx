import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container">
      <div className="card">
        <h2>404 - Page Not Found</h2>
        <Link to="/">Go back home</Link>
      </div>
    </div>
  );
}

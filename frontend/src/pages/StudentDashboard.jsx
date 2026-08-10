import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("events");

  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [registeringId, setRegisteringId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      // GET /events
      const eventsRes = await api.get("/events");
      setEvents(eventsRes.data.data);

      // GET /registration (backend returns all, we filter to this student)
      const regRes = await api.get("/registration");
      setRegistrations(regRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(eventId) {
    setError("");
    setSuccess("");
    setRegisteringId(eventId);
    try {
      // POST /registration
      await api.post("/registration", { event_id: eventId });
      setSuccess("Registered successfully!");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setRegisteringId(null);
    }
  }

  async function handleCancel(registrationId) {
    if (!window.confirm("Cancel this registration?")) return;
    setError("");
    setSuccess("");
    try {
      // DELETE /registration/:id
      await api.delete(`/registration/${registrationId}`);
      setSuccess("Registration cancelled.");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel registration.");
    }
  }

  const myRegistrations = registrations.filter(
    (r) => r.student_name === user.name
  );

  const registeredEventTitles = new Set(
    myRegistrations.map((r) => r.event_title)
  );

  return (
    <div className="container">
      <div className="card">
        <h2>Student Dashboard</h2>

        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            Available Events
          </button>
          <button
            className={`tab-btn ${
              activeTab === "registrations" ? "active" : ""
            }`}
            onClick={() => setActiveTab("registrations")}
          >
            My Registrations
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : activeTab === "events" ? (
          events.length === 0 ? (
            <p>No events available right now.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Seats</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>{ev.title}</td>
                    <td>
                      {ev.event_date
                        ? new Date(ev.event_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{ev.venue}</td>
                    <td>{ev.max_seats}</td>
                    <td>
                      {registeredEventTitles.has(ev.title) ? (
                        <span className="badge">Registered</span>
                      ) : (
                        <button
                          className="btn btn-small"
                          disabled={registeringId === ev.id}
                          onClick={() => handleRegister(ev.id)}
                        >
                          {registeringId === ev.id
                            ? "Registering..."
                            : "Register"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : myRegistrations.length === 0 ? (
          <p>You have not registered for any events yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Registered On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myRegistrations.map((r) => (
                <tr key={r.id}>
                  <td>{r.event_title}</td>
                  <td>
                    {r.registration_date
                      ? new Date(r.registration_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleCancel(r.id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

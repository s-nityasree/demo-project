import { useEffect, useState } from "react";
import api from "../api/axios";

export default function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState("summary");

  const [eventSummary, setEventSummary] = useState([]);
  const [studentSummary, setStudentSummary] = useState([]);

  const [selectedEventId, setSelectedEventId] = useState("");
  const [eventStudents, setEventStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);
    setError("");
    try {
      // GET /reports/event-summary
      const summaryRes = await api.get("/reports/event-summary");
      setEventSummary(summaryRes.data.data);

      // GET /reports/student-summary
      const studentRes = await api.get("/reports/student-summary");
      setStudentSummary(studentRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }

  async function handleViewEventStudents(eventId) {
    setError("");
    setSelectedEventId(eventId);
    try {
      // GET /reports/event/:id
      const res = await api.get(`/reports/event/${eventId}`);
      setEventStudents(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report.");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Faculty Dashboard - Event Participation Reports</h2>

        {error && <div className="error-box">{error}</div>}

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "summary" ? "active" : ""}`}
            onClick={() => setActiveTab("summary")}
          >
            Event Summary
          </button>
          <button
            className={`tab-btn ${activeTab === "students" ? "active" : ""}`}
            onClick={() => setActiveTab("students")}
          >
            Students By Event
          </button>
          <button
            className={`tab-btn ${
              activeTab === "studentSummary" ? "active" : ""
            }`}
            onClick={() => setActiveTab("studentSummary")}
          >
            Student Summary
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading reports...</div>
        ) : activeTab === "summary" ? (
          eventSummary.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Total Registrations</th>
                </tr>
              </thead>
              <tbody>
                {eventSummary.map((row) => (
                  <tr key={row.id}>
                    <td>{row.title}</td>
                    <td>
                      {row.event_date
                        ? new Date(row.event_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{row.venue}</td>
                    <td>{row.total_registrations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : activeTab === "students" ? (
          <div>
            <label htmlFor="eventSelect">Select an event</label>
            <select
              id="eventSelect"
              value={selectedEventId}
              onChange={(e) => handleViewEventStudents(e.target.value)}
            >
              <option value="">-- Choose Event --</option>
              {eventSummary.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>

            {selectedEventId && (
              <div style={{ marginTop: 16 }}>
                {eventStudents.length === 0 ? (
                  <p>No students registered for this event.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Registered On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventStudents.map((s) => (
                        <tr key={s.id}>
                          <td>{s.name}</td>
                          <td>{s.email}</td>
                          <td>
                            {s.registration_date
                              ? new Date(
                                  s.registration_date
                                ).toLocaleDateString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        ) : studentSummary.length === 0 ? (
          <p>No registrations found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Event</th>
                <th>Event Date</th>
                <th>Registered On</th>
              </tr>
            </thead>
            <tbody>
              {studentSummary.map((row, index) => (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.title}</td>
                  <td>
                    {row.event_date
                      ? new Date(row.event_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {row.registration_date
                      ? new Date(row.registration_date).toLocaleDateString()
                      : "-"}
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

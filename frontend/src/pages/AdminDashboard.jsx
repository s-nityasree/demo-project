import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = {
  title: "",
  description: "",
  event_date: "",
  venue: "",
  max_seats: ""
};

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  // GET /events
  async function loadEvents() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/events");
      setEvents(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setFormData(emptyForm);
    setEditingId(null);
  }

  function startEdit(ev) {
    setEditingId(ev.id);
    setFormData({
      title: ev.title || "",
      description: ev.description || "",
      event_date: ev.event_date ? ev.event_date.substring(0, 10) : "",
      venue: ev.venue || "",
      max_seats: ev.max_seats || ""
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.title ||
      !formData.event_date ||
      !formData.venue ||
      !formData.max_seats
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        // PUT /events/:id
        await api.put(`/events/${editingId}`, formData);
        setSuccess("Event updated successfully.");
      } else {
        // POST /events
        await api.post("/events", formData);
        setSuccess("Event created successfully.");
      }
      resetForm();
      loadEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save event.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this event?")) return;
    setError("");
    try {
      // DELETE /events/:id
      await api.delete(`/events/${id}`);
      setEvents(events.filter((ev) => ev.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete event.");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>{editingId ? "Edit Event" : "Create Event"}</h2>

        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Tech Fest 2026"
            />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Short description of the event"
            />
          </div>

          <div>
            <label htmlFor="event_date">Event Date</label>
            <input
              id="event_date"
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="venue">Venue</label>
            <input
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="Main Auditorium"
            />
          </div>

          <div>
            <label htmlFor="max_seats">Max Seats</label>
            <input
              id="max_seats"
              type="number"
              name="max_seats"
              value={formData.max_seats}
              onChange={handleChange}
              placeholder="100"
            />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit" disabled={submitting}>
              {submitting
                ? "Saving..."
                : editingId
                ? "Update Event"
                : "Create Event"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>All Events</h2>
        {loading ? (
          <div className="loading">Loading events...</div>
        ) : events.length === 0 ? (
          <p>No events yet. Create one above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Seats</th>
                <th>Actions</th>
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
                    <button
                      className="btn btn-small"
                      onClick={() => startEdit(ev)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(ev.id)}
                    >
                      Delete
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

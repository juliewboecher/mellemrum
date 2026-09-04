import { useEffect, useState } from "react";
import { Link } from "react-router";
import Footer from "../components/Footer";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json"
};

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function getRegistrations() {
      const response = await fetch(`${SUPABASE_URL}/registrations?order=createdAt.desc`, { headers });
      const data = await response.json();
      setRegistrations(data);
      setRegistrationCount(data.length);
    }

    getRegistrations();
  }, []);

  const filteredRegistrations = registrations.filter((registration) =>
    registration.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
 

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p aria-live="polite">{registrationCount} tilmeldinger i alt</p>
      </header>

      <main>
        <label
          className="registration-search-label"
          htmlFor="registration-search"
        >
          Søg efter event
        </label>
        <input
          className="registration-search"
          type="text"
          placeholder="Søg efter event..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredRegistrations.length === 0 && (
          <p>Ingen tilmeldinger matcher din søgning.</p>
        )}
        <div className="registration-list">
          <div className="registration-row registration-labels">
            <span>Navn</span>
            <span>Event</span>
            <span>Dato</span>
            <span>Status</span>
          </div>
          {filteredRegistrations.map((registration) => (
            <div className="registration-row" key={registration.id}>
              <div>
                <strong>{registration.name}</strong>
                <small>{registration.email}</small>
              </div>
              <span>{registration.eventTitle}</span>
              <span>
                {new Date(registration.eventDate).toLocaleDateString("da-DK")}
              </span>
              <span className="status">{registration.status}</span>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

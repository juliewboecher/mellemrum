import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json"
};

function EventCardSkeleton() {
  return (
    <article className="event-card skeleton">
      <div className="skeleton-image"></div>
      <div className="event-card-content">
        <div className="skeleton-line short"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line medium"></div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Alle");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [eventsRes, regsRes] = await Promise.all([
          fetch(
            `${SUPABASE_URL}/events?select=*,venue:venues(id,name,website)&order=date.asc`,
            { headers },
          ),
          fetch(`${SUPABASE_URL}/registrations`, { headers }),
        ]);

        const eventsData = await eventsRes.json();
        const regsData = await regsRes.json();

        setEvents(Array.isArray(eventsData) ? eventsData : []);
        setRegistrations(Array.isArray(regsData) ? regsData : []);
      } catch (error) {
        console.error("Fejl:", error);
      } finally {
        setLoading(false); 
      }
    }

    load();
  }, []);

  function getSignupCount(eventTitle) {
    return registrations.filter((r) => r.eventTitle === eventTitle).length;
  }

  const categories = [
    "Alle",
    ...new Set(events.map((event) => event.category)),
  ];

  const filteredEvents = events.filter((event) => {
    const searchText =
      `${event.title} ${event.summary} ${event.venueName}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesCategory = category === "Alle" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  function formatEventDate(eventDate) {
    const date = new Date(eventDate);
    const formattedDate = date.toLocaleDateString("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return (
    <>
      <header className="hero">
        <p className="eyebrow">Kultur i Aarhus</p>
        <h1>Find plads til noget nyt.</h1>
        <p className="hero-copy">
          Koncerter, talks og workshops samlet ét sted. Find dit næste event, og
          tilmeld dig på få minutter.
        </p>
        <a className="hero-link" href="#events">
          Se kommende events ↓
        </a>
      </header>

      <main id="events">
        <section className="section-heading">
          <div>
            <p className="eyebrow dark">Det sker</p>
            <h2>Kommende events</h2>
          </div>
          <p>Kuraterede oplevelser i byen – fra små scener til store idéer.</p>
        </section>

        <section className="filters">
          <label>
            Søg
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Søg efter titel eller sted"
            />
          </label>
          <label>
            Kategori
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </section>

        <section className="event-grid">
          {loading
    ? Array.from({ length: 6 }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))
    : filteredEvents.map((event) => (
        <article
          className="event-card"
          key={event.id}
          onClick={() => navigate(`/events/${event.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={event.image} alt="" loading="lazy" />
              <div className="event-card-content">
                <p className="event-category">{event.category}</p>
                <h3>{event.title}</h3>
                <p>{event.summary}</p>
                <p>{event.venue?.name}</p>
                <div className="event-meta">
                  <span>{formatEventDate(event.date)}</span>
                  <span>{event.venueName}</span>
                </div>
                <div className="event-actions">
                  <Link
                    className="card-link"
                    to={`/events/${event.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Læs mere
                  </Link>
                  <span>{getSignupCount(event.title)} tilmeldte</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-intro">
            <p className="footer-brand">
              mellemrum<span>.</span>
            </p>
            <p>Udvalgte kulturoplevelser og nye perspektiver på Aarhus.</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <div className="footer-link-group">
              <p className="footer-heading">Udforsk</p>
              <Link to="/">Events</Link>
              <Link to="/om">Om Mellemrum</Link>
            </div>
            <div className="footer-link-group">
              <p className="footer-heading">For arrangører</p>
              <Link to="/tilmeldinger">Se tilmeldinger</Link>
              <a href="mailto:hej@mellemrum.dk">Kontakt os</a>
            </div>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-meta">© 2026 Mellemrum</p>
          <p>Aarhus, Danmark</p>
        </div>
      </footer>
    </>
  );
}

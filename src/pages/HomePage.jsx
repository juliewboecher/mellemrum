import { useEffect, useState } from "react";
import { Link } from "react-router";
import Footer from "../components/Footer";

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
        <p className="eyebrow" aria-hidden="true">
          Kultur i Aarhus
        </p>
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

        <section className="filters" aria-label="Liste over events">
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
                <article className="event-card" key={event.id}>
                  <Link to={`/events/${event.id}`} className="event-card-link">
                    <img src={event.image} alt={event.title} loading="lazy" />

                    <div className="event-card-content">
                      <p className="event-category">{event.category}</p>
                      <h3>{event.title}</h3>
                      <p>{event.summary}</p>
                      <p>{event.venue?.name}</p>

                      <div className="event-meta">
                        <span>{formatEventDate(event.date)}</span>
                        <span>{event.venueName}</span>
                      </div>
                    </div>
                    
                    <span className="card-link">Læs mere</span>
                  </Link>

                  <div className="event-actions">
                    <span>{getSignupCount(event.title)} tilmeldte</span>
                  </div>
                </article>
              ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

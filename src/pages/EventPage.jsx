import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { createRegistration } from "../lib/supabase";


const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

function EventPageSkeleton() {
  return (
    <main className="event-page">
      <div
        className="back-link skeleton-line short"
        style={{ width: "120px", height: "20px" }}
      ></div>

      <section className="event-detail">
        <div
          className="skeleton-image"
          style={{ aspectRatio: "16/10", borderRadius: "12px" }}
        ></div>

        <div className="event-detail-content">
          <div className="skeleton-line short"></div>
          <div
            className="skeleton-line"
            style={{ height: "32px", width: "80%" }}
          ></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line medium"></div>

          <div className="detail-list" style={{ marginTop: "2rem" }}>
            <div className="skeleton-line medium"></div>
            <div className="skeleton-line medium"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function EventPage() {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
    try {
      setLoading(true);

      const [eventRes, regsRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/events?id=eq.${eventId}&select=*,venue:venues(id,name,website)`, { headers }),
        fetch(`${SUPABASE_URL}/registrations`, { headers }),
      ]);

      const eventData = await eventRes.json();
      const regsData = await regsRes.json();

      setEvent(eventData[0]);
      setRegistrations(regsData);

      setEvent(eventData[0] ?? null);
      setRegistrations(Array.isArray(regsData) ? regsData : []);
    } catch (error) {
      console.error("Fejl:", error);
    } finally {
      setLoading(false);
    }
  }

    load();
  }, [eventId]);

  function getSignupCount(eventTitle) {
    return registrations.filter((reg) => reg.eventTitle === eventTitle).length;
  }

  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();
    const newErrors = {};
   
    if (!name) {
      newErrors.name = true;
    }

    if (!email) {
      newErrors.email = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const registration = {
      name,
      email,
      status: "Ny",
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: event.venueName,
    };

    try {
      await createRegistration(registration);

      setRegistrations((prev) => [...prev, registration]);
      setName("");
      setEmail("");
      setSubmitted(true);
    } catch (error) {
      console.error("Kunne ikke tilmelde:", error);
    }
  }

  if (loading) {
    return <EventPageSkeleton />;
  }

  if (!event) {
    return (
      <main className="event-page">
        <p>Eventet blev ikke fundet.</p>
        <Link to="/">← Tilbage til alle events</Link>
      </main>
    );
  }

  const date = new Date(event.date);

  return (
    <>
      <main className="event-page">
        <Link className="back-link" to="/">
          ← Alle events
        </Link>

        <section className="event-detail">
          <img src={event.image} alt="" loading="lazy" />

          <div className="event-detail-content">
            <p className="event-category">{event.category}</p>

            <h1>{event.title}</h1>

            <p className="lead">{event.summary}</p>

            <div className="detail-list">
              <p>
                <strong>Dato</strong>
                {date.toLocaleDateString("da-DK", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                kl.{" "}
                {date.toLocaleTimeString("da-DK", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Arrangør</strong>
                {event.venue?.name}
              </p>

              <p>
                <strong>Sted</strong>

                <span>
                  {event.venueName}
                  <br />
                  {event.venueAddress}, {event.venuePostalCode}{" "}
                  {event.venueCity}
                  {event.venueWebsite && (
                    <>
                      <br />

                      <a href={event.venueWebsite}>Besøg venue</a>
                    </>
                  )}
                </span>
              </p>

              <p>
                <strong>Pris</strong>

                {event.price === 0 ? "Gratis" : `${event.price} kr.`}
              </p>
              <p>
                <strong>Tilmeldte</strong>
                <span>{getSignupCount(event.title)}</span>
              </p>
            </div>

            <p>{event.description}</p>
          </div>
        </section>

        <section className="signup-panel">
          <div>
            <p className="eyebrowdark">Tilmelding</p>

            <h2>Reserver din plads</h2>

            <p>
              Udfyld formularen, så sender vi din tilmelding til arrangøren.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: false }));
                }}
                placeholder="Dit navn"
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <p className="field-error">Udfyld feltet</p>}
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: false }));
                }}
                placeholder="dig@example.com"
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <p className="field-error">Udfyld feltet</p>}
            </div>

            <button type="submit">Tilmeld mig</button>
          </form>
          {submitted && (
            <div className="success-popup">
              <h2>Tilmelding modtaget! ✓</h2>
              <p>Tak for din tilmelding.</p>
            </div>
          )}
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

        <div className="footers">
          <p className="footer-meta">© 2025 Mellemrum</p>

          <p>Aarhus, Danmark</p>
        </div>
      </footer>
    </>
  );
}

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { createRegistration } from "../lib/supabase";
import styles from "./EventPage.module.css";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function EventPage() {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function getEvent() {
      const response = await fetch(`${SUPABASE_URL}/events?id=eq.${eventId}`, {
        headers,
      });

      const data = await response.json();

      setEvent(data[0]);
    }

    getEvent();
  }, [eventId]);

  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();

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

      console.log("Tilmelding sendt!");

      setName("");
      setEmail("");
      setSubmitted(true);
    } catch (error) {
      console.error("Kunne ikke tilmelde:", error);
    }
  }

  if (!event) {
    return null;
  }

  const date = new Date(event.date);

  return (
    <>
      <main className={styles.eventpage}>
        <Link className={styles.backlink} to="/">
          ← Alle events
        </Link>

        <section className={styles.eventdetail}>
          <img src={event.image} alt="" />

          <div className={styles["event-detail-content"]}>
            <p className={styles["event-category"]}>{event.category}</p>

            <h1>{event.title}</h1>

            <p className={styles.lead}>{event.summary}</p>

            <div className={styles["detail-list"]}>
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
            </div>

            <p>{event.description}</p>
          </div>
        </section>

        <section className={styles.signuppanel}>
          <div>
            <p className={styles.eyebrowdark}>Tilmelding</p>

            <h2>Reserver din plads</h2>

            <p>
              Udfyld formularen, så sender vi din tilmelding til arrangøren.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Navn
              <input
                type="text"
                value={name}
                onChange={(inputEvent) => setName(inputEvent.target.value)}
                required
              />
            </label>

            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(inputEvent) => setEmail(inputEvent.target.value)}
                placeholder="dig@example.com"
                required
              />
            </label>

            <button type="submit">Tilmeld mig</button>
          </form>
          {submitted && (
            <div className={styles.successpopup}>
              <h2>Tilmelding modtaget! ✓</h2>
              <p>Tak for din tilmelding.</p>
            </div>
          )}
        </section>
      </main>

      <footer className={styles.sitefooter}>
        <div className={styles.footertop}>
          <div className={styles.footerintro}>
            <p className={styles.footerbrand}>
              mellemrum<span>.</span>
            </p>

            <p>Udvalgte kulturoplevelser og nye perspektiver på Aarhus.</p>
          </div>

          <nav className={styles.footerlinks} aria-label="Footer">
            <div className={styles.footerlinkgroup}>
              <p className={styles.footerheading}>Udforsk</p>

              <Link to="/">Events</Link>

              <Link to="/om">Om Mellemrum</Link>
            </div>

            <div className={styles.footerlinkgroup}>
              <p className={styles.footerheading}>For arrangører</p>

              <Link to="/tilmeldinger">Se tilmeldinger</Link>

              <a href="mailto:hej@mellemrum.dk">Kontakt os</a>
            </div>
          </nav>
        </div>

        <div className={styles.footers}>
          <p className={styles.footermeta}>© 2025 Mellemrum</p>

          <p>Aarhus, Danmark</p>
        </div>
      </footer>
    </>
  );
}

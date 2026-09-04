import { Link } from "react-router";
import Footer from "../components/Footer";

export default function NotFoundPage() {
  return (
    <>
      <main className="not-found" aria-labelledby="not-found-heading">
        <header>
          <h1>Siden blev ikke fundet</h1>
          <p className="not-found-code" aria-hidden="true">
            404
          </p>
        </header>

        <h1 id="not-found-heading">Siden blev ikke fundet</h1>
        <p>Siden, du leder efter, findes ikke.</p>
        <Link to="/" className="not-found-link">
          Gå til forsiden
        </Link>
      </main>
      <Footer />
    </>
  );
}

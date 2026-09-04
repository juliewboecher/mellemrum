import { Link } from "react-router";

function Footer() {
    return (
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-intro">
            <p className="footer-brand" aria-label="Mellemrum">
              mellemrum<span aria-hidden="true">.</span>
            </p>
            <p>Udvalgte kulturoplevelser og nye perspektiver på Aarhus.</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <div className="footer-link-group">
              <h3 className="footer-heading">Udforsk</h3>
              <ul>
                <li><Link to="/">Events</Link></li>
                <li><Link to="/om">Om Mellemrum</Link></li>
              </ul>
            </div>
            <div className="footer-link-group">
              <h3 className="footer-heading">For arrangører</h3>
              <ul>
                <li><Link to="/tilmeldinger">Se tilmeldinger</Link></li>
                <li><a href="mailto:hej@mellemrum.dk">Kontakt os</a></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-meta">© 2026 Mellemrum</p>
          <p>Aarhus, Danmark</p>
        </div>
      </footer>
    );
}

export default Footer;

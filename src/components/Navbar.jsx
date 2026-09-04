import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <nav className="site-nav" aria-label="Hovednavigation">
      <NavLink className="brand" to="/">
        mellemrum<span>.</span>
      </NavLink>
      <div className="nav-links" aria-label="Mellemrum – gå til forsiden">
        <ul>
          <li><NavLink to="/">Events</NavLink></li>
          <li><NavLink to="/tilmeldinger">Se tilmeldinger</NavLink></li>
          <li><NavLink to="/om">Om Mellemrum</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}

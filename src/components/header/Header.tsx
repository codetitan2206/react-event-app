import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="flex items-center justify-between bg-white p-4 shadow">
      <h1 className="text-xl font-bold">Event App</h1>
      <nav className="flex items-center gap-4">
        <ul className="flex gap-4">
          <li>
            <Link to="/">All Events</Link>
          </li>
          <li>
            <Link to="/my-events">My Events</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

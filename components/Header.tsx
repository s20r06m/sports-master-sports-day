import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-title">SM'S SPORTS DAY</div>
        <nav aria-label="Primary navigation" className="site-nav">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/events" className="nav-link">
            Events
          </Link>
          <Link href="/leaderboard" className="nav-link">
            Leaderboard
          </Link>
          <Link href="/login" className="nav-link">
            Login
          </Link>
          <Link href="/admin" className="nav-link">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

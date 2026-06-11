import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Обзор', end: true },
  { to: '/scans', label: 'Сканирования' },
  { to: '/analytics', label: 'Аналитика' },
  { to: '/repositories', label: 'Репозитории' },
  { to: '/assistant', label: 'AI-ассистент' },
];

export function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">CM</span>
          <div>
            <h1>CodeMetrics</h1>
            <p>Метрики Gitea + SonarQube</p>
          </div>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { getAuthorPerformance, getAuthorSummary, getProjectMetrics } from '../api/metrics';
import { ErrorAlert } from '../components/ErrorAlert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { defaultPeriod, toIsoDate } from '../api/client';
import type { AuthorPerformanceDto, AuthorSummaryDto, ProjectMetricsDto } from '../types';

export function AnalyticsPage() {
  const period = defaultPeriod();
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState(period.start.slice(0, 10));
  const [endDate, setEndDate] = useState(period.end.slice(0, 10));

  const [summary, setSummary] = useState<AuthorSummaryDto | null>(null);
  const [performance, setPerformance] = useState<AuthorPerformanceDto | null>(null);
  const [project, setProject] = useState<ProjectMetricsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const loadProject = useCallback(async () => {
    const data = await getProjectMetrics(
      toIsoDate(new Date(startDate)),
      toIsoDate(new Date(endDate)),
    );
    setProject(data);
  }, [startDate, endDate]);

  useEffect(() => {
    void loadProject().catch(() => undefined);
  }, [loadProject]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const start = toIsoDate(new Date(startDate));
      const end = toIsoDate(new Date(endDate));
      const [authorSummary, authorPerformance] = await Promise.all([
        getAuthorSummary(email.trim(), start, end),
        getAuthorPerformance(email.trim(), start, end),
      ]);
      setSummary(authorSummary);
      setPerformance(authorPerformance);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <h2>Аналитика автора</h2>
        <p>Метрики активности и производительности из Gitea через бэкенд.</p>
      </header>

      <form className="panel filters" onSubmit={handleSubmit}>
        <label>
          Email автора
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="author@example.com"
            required
          />
        </label>
        <label>
          Начало периода
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          Конец периода
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Загрузка…' : 'Получить метрики'}
        </button>
      </form>

      {error && <ErrorAlert error={error} />}
      {loading && <LoadingSpinner />}

      {project && (
        <section className="panel">
          <h3>Проект за период</h3>
          <p>
            Коммитов: <strong>{project.totalCommits}</strong> · Строк:{' '}
            <strong>{project.totalChangedLines}</strong> · Репозиториев:{' '}
            <strong>{project.repositoryCount}</strong>
          </p>
        </section>
      )}

      {summary && (
        <section className="panel">
          <h3>Сводка: {summary.author}</h3>
          <p>Средний размер изменения: {summary.averageChangeSize.toFixed(1)} строк</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Неделя</th>
                  <th>Коммиты</th>
                </tr>
              </thead>
              <tbody>
                {summary.weekly.map((w) => (
                  <tr key={`${w.year}-${w.week}`}>
                    <td>
                      {w.from} — {w.to}
                    </td>
                    <td>{w.commitCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {performance && (
        <section className="panel">
          <h3>Производительность</h3>
          <div className="cards-grid">
            <article className="card">
              <h3>Коммиты</h3>
              <p className="metric-value">{performance.speed.commits}</p>
            </article>
            <article className="card">
              <h3>Полезные строки</h3>
              <p className="metric-value">{performance.speed.useful_Lines}</p>
            </article>
          </div>
        </section>
      )}
    </section>
  );
}

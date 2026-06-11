import { useCallback, useEffect, useState } from 'react';
import { getProjectMetrics } from '../api/metrics';
import { getScanSummary } from '../api/sonarqube';
import { config } from '../config';
import { ErrorAlert } from '../components/ErrorAlert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { ProjectMetricsDto, SonarScanSummaryDto } from '../types';

export function DashboardPage() {
  const [projectMetrics, setProjectMetrics] = useState<ProjectMetricsDto | null>(null);
  const [scanSummary, setScanSummary] = useState<SonarScanSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [metrics, scan] = await Promise.all([
        getProjectMetrics(),
        getScanSummary(config.sonarProjectKey, config.defaultBranch).catch(() => null),
      ]);
      setProjectMetrics(metrics);
      setScanSummary(scan);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingSpinner label="Загрузка дашборда…" />;
  if (error) return <ErrorAlert error={error} onRetry={load} />;

  return (
    <section className="page">
      <header className="page-header">
        <h2>Обзор проекта</h2>
        <p>Сводка метрик коммитов и качества кода SonarQube.</p>
      </header>

      <div className="cards-grid">
        <article className="card">
          <h3>Коммиты</h3>
          <p className="metric-value">{projectMetrics?.totalCommits ?? 0}</p>
          <p className="muted">за последние 3 месяца</p>
        </article>
        <article className="card">
          <h3>Изменённые строки</h3>
          <p className="metric-value">{projectMetrics?.totalChangedLines ?? 0}</p>
        </article>
        <article className="card">
          <h3>Репозитории</h3>
          <p className="metric-value">{projectMetrics?.repositoryCount ?? 0}</p>
        </article>
        <article className="card">
          <h3>Quality Gate</h3>
          <p className={`metric-value gate-${(scanSummary?.qualityGateStatus ?? 'unknown').toLowerCase()}`}>
            {scanSummary?.qualityGateStatus ?? 'N/A'}
          </p>
          <p className="muted">SonarQube · {config.sonarProjectKey}</p>
        </article>
      </div>

      {scanSummary && (
        <section className="panel">
          <h3>Метрики SonarQube</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Метрика</th>
                  <th>Значение</th>
                </tr>
              </thead>
              <tbody>
                {scanSummary.measures.map((m) => (
                  <tr key={m.metric}>
                    <td>{m.metric}</td>
                    <td>{m.value ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  );
}

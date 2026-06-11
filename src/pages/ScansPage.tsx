import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getAppConfig,
  getAvailableMetrics,
  getIssues,
  getMeasures,
  getScanSummary,
} from '../api/sonarqube';
import { config } from '../config';
import { ErrorAlert } from '../components/ErrorAlert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type {
  SonarIssue,
  SonarMeasure,
  SonarMetricInfo,
  SonarScanSummaryDto,
} from '../types';

type TabId = 'summary' | 'measures' | 'issues' | 'metrics';

const DEFAULT_METRICS = [
  'coverage',
  'bugs',
  'vulnerabilities',
  'code_smells',
  'sqale_index',
  'ncloc',
];

export function ScansPage() {
  const [projectKey, setProjectKey] = useState(config.sonarProjectKey);
  const [branch, setBranch] = useState(config.defaultBranch);
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(DEFAULT_METRICS);

  const [summary, setSummary] = useState<SonarScanSummaryDto | null>(null);
  const [measures, setMeasures] = useState<SonarMeasure[]>([]);
  const [issues, setIssues] = useState<SonarIssue[]>([]);
  const [availableMetrics, setAvailableMetrics] = useState<SonarMetricInfo[]>([]);
  const [sonarConfigured, setSonarConfigured] = useState<boolean | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const loadSummary = useCallback(async () => {
    const data = await getScanSummary(projectKey, branch || undefined);
    setSummary(data);
  }, [projectKey, branch]);

  const loadMeasures = useCallback(async () => {
    const data = await getMeasures(projectKey, branch || undefined, selectedMetrics);
    setMeasures(data.measures);
  }, [projectKey, branch, selectedMetrics]);

  const loadIssues = useCallback(async () => {
    const data = await getIssues(projectKey, branch || undefined);
    setIssues(data);
  }, [projectKey, branch]);

  const loadAvailableMetrics = useCallback(async () => {
    const data = await getAvailableMetrics();
    setAvailableMetrics(data.metrics);
  }, []);

  const loadActiveTab = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      switch (activeTab) {
        case 'summary':
          await loadSummary();
          break;
        case 'measures':
          await loadMeasures();
          break;
        case 'issues':
          await loadIssues();
          break;
        case 'metrics':
          await loadAvailableMetrics();
          break;
        default:
          break;
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, loadSummary, loadMeasures, loadIssues, loadAvailableMetrics]);

  useEffect(() => {
    getAppConfig()
      .then((cfg) => {
        setProjectKey(cfg.sonarProjectKey);
        setSonarConfigured(cfg.sonarConfigured);
      })
      .catch(() => setSonarConfigured(false));
  }, []);

  useEffect(() => {
    void loadActiveTab();
  }, [loadActiveTab]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void loadActiveTab();
  };

  const severitySummary = useMemo(() => {
    if (!summary) return [];
    return Object.entries(summary.issuesBySeverity).sort(([a], [b]) => a.localeCompare(b));
  }, [summary]);

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'summary', label: 'Сводка' },
    { id: 'measures', label: 'Метрики' },
    { id: 'issues', label: 'Issues' },
    { id: 'metrics', label: 'Справочник метрик' },
  ];

  return (
    <section className="page">
      <header className="page-header">
        <h2>Сканирования SonarQube</h2>
        <p>
          Запросы идут через бэкенд <code>/api/SonarQube/*</code> — не напрямую в SonarQube.
        </p>
      </header>

      {sonarConfigured === false && (
        <div className="alert alert-error" role="alert">
          <strong>SonarQube не настроен</strong>
          <p>
            Backend не получил <code>SONAR_TOKEN</code>. Запустите{' '}
            <code>scripts/init-services.sh</code> и перезапустите backend.
          </p>
        </div>
      )}

      <form className="panel filters" onSubmit={handleSubmit}>
        <label>
          Project Key
          <input
            value={projectKey}
            onChange={(e) => setProjectKey(e.target.value.trim())}
            placeholder="renamshina"
            required
          />
        </label>
        <label>
          Branch
          <input
            value={branch}
            onChange={(e) => setBranch(e.target.value.trim())}
            placeholder="main (оставьте пустым для default)"
          />
        </label>
        {activeTab === 'measures' && (
          <label className="wide">
            Метрики (через запятую)
            <input
              value={selectedMetrics.join(',')}
              onChange={(e) =>
                setSelectedMetrics(
                  e.target.value
                    .split(',')
                    .map((m) => m.trim())
                    .filter(Boolean),
                )
              }
            />
          </label>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Загрузка…' : 'Обновить'}
        </button>
      </form>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <ErrorAlert error={error} onRetry={loadActiveTab} />}
      {loading && !error && <LoadingSpinner />}

      {!loading && !error && activeTab === 'summary' && summary && (
        <div className="cards-grid">
          <article className="card">
            <h3>Quality Gate</h3>
            <p className={`metric-value gate-${summary.qualityGateStatus.toLowerCase()}`}>
              {summary.qualityGateStatus}
            </p>
          </article>
          <article className="card">
            <h3>Открытые issues</h3>
            <p className="metric-value">{summary.openIssuesCount}</p>
          </article>
          {severitySummary.map(([severity, count]) => (
            <article className="card" key={severity}>
              <h3>{severity}</h3>
              <p className="metric-value">{count}</p>
            </article>
          ))}
        </div>
      )}

      {!loading && !error && activeTab === 'summary' && summary && (
        <section className="panel">
          <h3>Measures из сводки</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {summary.measures.map((m) => (
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

      {!loading && !error && activeTab === 'measures' && (
        <section className="panel">
          <h3>Measures</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {measures.map((m) => (
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

      {!loading && !error && activeTab === 'issues' && (
        <section className="panel">
          <h3>Issues ({issues.length})</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Rule</th>
                  <th>Message</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.key}>
                    <td>{issue.severity}</td>
                    <td>{issue.rule}</td>
                    <td>{issue.message}</td>
                    <td>{issue.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {!loading && !error && activeTab === 'metrics' && (
        <section className="panel">
          <h3>Доступные метрики SonarQube ({availableMetrics.length})</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Domain</th>
                </tr>
              </thead>
              <tbody>
                {availableMetrics.slice(0, 100).map((m) => (
                  <tr key={m.key}>
                    <td>{m.key}</td>
                    <td>{m.name}</td>
                    <td>{m.type}</td>
                    <td>{m.domain ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {availableMetrics.length > 100 && (
            <p className="muted">Показаны первые 100 из {availableMetrics.length}</p>
          )}
        </section>
      )}
    </section>
  );
}

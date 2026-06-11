import { useCallback, useEffect, useState } from 'react';
import { getBranches, getCommitsByRepo, getRepositories } from '../api/database';
import { syncFromGitea } from '../api/metrics';
import { ErrorAlert } from '../components/ErrorAlert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { BranchDto, CommitListItemDto, RepositoryDto } from '../types';

export function RepositoriesPage() {
  const [repos, setRepos] = useState<RepositoryDto[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [branches, setBranches] = useState<BranchDto[]>([]);
  const [commits, setCommits] = useState<CommitListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const loadRepos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRepositories();
      setRepos(data);
      if (data.length > 0 && !selectedRepo) {
        setSelectedRepo(data[0].repoName);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedRepo]);

  const loadRepoDetails = useCallback(async (repoName: string) => {
    setError(null);
    try {
      const [branchList, commitList] = await Promise.all([
        getBranches(repoName),
        getCommitsByRepo(repoName),
      ]);
      setBranches(branchList);
      setCommits(commitList);
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    void loadRepos();
  }, [loadRepos]);

  useEffect(() => {
    if (selectedRepo) void loadRepoDetails(selectedRepo);
  }, [selectedRepo, loadRepoDetails]);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    try {
      await syncFromGitea(selectedRepo ?? undefined);
      await loadRepos();
      if (selectedRepo) await loadRepoDetails(selectedRepo);
    } catch (err) {
      setError(err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <LoadingSpinner label="Загрузка репозиториев…" />;

  return (
    <section className="page">
      <header className="page-header">
        <h2>Репозитории</h2>
        <p>Данные из локальной БД бэкенда, синхронизируемой с Gitea.</p>
      </header>

      <div className="panel actions-row">
        <button type="button" className="btn btn-primary" onClick={handleSync} disabled={syncing}>
          {syncing ? 'Синхронизация…' : 'Синхронизировать с Gitea'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={loadRepos}>
          Обновить список
        </button>
      </div>

      {error && <ErrorAlert error={error} onRetry={loadRepos} />}

      <div className="split-layout">
        <section className="panel">
          <h3>Репозитории ({repos.length})</h3>
          <ul className="list">
            {repos.map((repo) => (
              <li key={repo.repoName}>
                <button
                  type="button"
                  className={selectedRepo === repo.repoName ? 'list-item active' : 'list-item'}
                  onClick={() => setSelectedRepo(repo.repoName)}
                >
                  <strong>{repo.repoName}</strong>
                  <span className="muted">{repo.defaultBranch}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {selectedRepo && (
          <section className="panel">
            <h3>{selectedRepo}</h3>
            <h4>Ветки ({branches.length})</h4>
            <ul className="chips">
              {branches.map((b) => (
                <li key={b.branchName}>{b.branchName}</li>
              ))}
            </ul>
            <h4>Последние коммиты</h4>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Hash</th>
                    <th>Автор</th>
                    <th>Сообщение</th>
                    <th>Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {commits.slice(0, 20).map((c) => (
                    <tr key={c.hash}>
                      <td>{c.hash.slice(0, 8)}</td>
                      <td>{c.authorName}</td>
                      <td>{c.message}</td>
                      <td>{new Date(c.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

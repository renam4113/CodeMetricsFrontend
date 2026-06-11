import { FormEvent, useState } from 'react';
import { analyzePerformance, askOllama, chatOllama } from '../api/ollama';
import { config } from '../config';
import { defaultPeriod, toIsoDate } from '../api/client';
import { ErrorAlert } from '../components/ErrorAlert';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function AssistantPage() {
  const period = defaultPeriod();
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState(period.start.slice(0, 10));
  const [endDate, setEndDate] = useState(period.end.slice(0, 10));
  const [includeSonar, setIncludeSonar] = useState(true);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const handleAsk = async (event: FormEvent) => {
    event.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await askOllama({
        text: question.trim(),
        sonarProjectKey: includeSonar ? config.sonarProjectKey : undefined,
        sonarBranch: includeSonar ? config.defaultBranch : undefined,
        metricsAuthorEmail: email.trim() || undefined,
        metricsStartDate: email.trim() ? toIsoDate(new Date(startDate)) : undefined,
        metricsEndDate: email.trim() ? toIsoDate(new Date(endDate)) : undefined,
      });
      setResponse(result.text);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await chatOllama(question.trim());
      setResponse(result.text);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzePerformance({
        email: email.trim(),
        startDate: toIsoDate(new Date(startDate)),
        endDate: toIsoDate(new Date(endDate)),
        sonarProjectKey: includeSonar ? config.sonarProjectKey : undefined,
        sonarBranch: includeSonar ? config.defaultBranch : undefined,
      });
      setResponse(result.comment);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <h2>AI-ассистент (Ollama)</h2>
        <p>Анализ метрик с опциональным контекстом SonarQube.</p>
      </header>

      <form className="panel" onSubmit={handleAsk}>
        <label>
          Вопрос
          <textarea
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Спросите о качестве кода или активности команды"
          />
        </label>

        <div className="filters">
          <label>
            Email автора (опционально)
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Начало
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label>
            Конец
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={includeSonar}
            onChange={(e) => setIncludeSonar(e.target.checked)}
          />
          Включить контекст SonarQube ({config.sonarProjectKey})
        </label>

        <div className="actions-row">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Спросить с контекстом
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleChat} disabled={loading}>
            Простой чат
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleAnalyze} disabled={loading}>
            Анализ производительности
          </button>
        </div>
      </form>

      {loading && <LoadingSpinner label="Ollama обрабатывает запрос…" />}
      {error && <ErrorAlert error={error} />}
      {response && (
        <section className="panel response">
          <h3>Ответ</h3>
          <pre>{response}</pre>
        </section>
      )}
    </section>
  );
}

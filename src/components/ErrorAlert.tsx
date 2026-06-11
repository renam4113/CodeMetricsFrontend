import { ApiError } from '../types';

interface ErrorAlertProps {
  error: unknown;
  onRetry?: () => void;
}

export function ErrorAlert({ error, onRetry }: ErrorAlertProps) {
  const message =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : 'Неизвестная ошибка';

  const status = error instanceof ApiError ? error.status : undefined;

  return (
    <div className="alert alert-error" role="alert">
      <strong>{status ? `Ошибка ${status}` : 'Ошибка'}</strong>
      <p>{message}</p>
      {error instanceof ApiError && error.body?.details && (
        <p className="muted">{error.body.details}</p>
      )}
      {onRetry && (
        <button type="button" className="btn btn-secondary" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  );
}

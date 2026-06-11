export function LoadingSpinner({ label = 'Загрузка…' }: { label?: string }) {
  return (
    <div className="loading" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

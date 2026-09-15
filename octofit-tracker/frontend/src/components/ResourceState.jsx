export function ResourceState({ loading, error, children }) {
  if (loading) return <p className="status-message">Loading data...</p>
  if (error) return <p className="status-message status-error">{error}</p>
  return children
}
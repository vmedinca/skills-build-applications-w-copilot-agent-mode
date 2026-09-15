import { ResourceState } from './ResourceState.jsx'
import { useResource } from './useResource.js'

const leaderboardEndpoint = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
  : ''

function Leaderboard() {
  const { data, loading, error } = useResource('leaderboard', leaderboardEndpoint)

  return <section className="page-section">
    <div className="section-heading"><p className="eyebrow">THE RACE</p><h2>Leaderboard</h2><p>Small consistency compounds into big numbers.</p></div>
    <ResourceState loading={loading} error={error}>
      <div className="leaderboard">{data.map((user, index) => <article className="rank-row" key={user._id || user.id}>
        <span className="rank">{user.rank || index + 1}</span><div><strong>{user.name}</strong><span>{user.team?.name || 'Independent'}</span></div><b>{user.points || 0}<small> points</small></b>
      </article>)}</div>
    </ResourceState>
  </section>
}

export default Leaderboard
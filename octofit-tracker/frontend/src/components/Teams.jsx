import { ResourceState } from './ResourceState.jsx'
import { useResource } from './useResource.js'

const teamsEndpoint = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
  : ''

function Teams() {
  const { data, loading, error } = useResource('teams', teamsEndpoint)

  return <section className="page-section">
    <div className="section-heading"><p className="eyebrow">TOGETHER</p><h2>Teams</h2><p>Find the people turning effort into a shared habit.</p></div>
    <ResourceState loading={loading} error={error}>
      <div className="card-grid">{data.map((team) => <article className="info-card" key={team._id || team.id}><span className="card-kicker">{team.members?.length || 0} members</span><h3>{team.name}</h3><p>{team.description || 'A team without a description yet.'}</p><strong>{team.points || 0} points</strong></article>)}</div>
    </ResourceState>
  </section>
}

export default Teams
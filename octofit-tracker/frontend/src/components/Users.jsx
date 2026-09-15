import { ResourceState } from './ResourceState.jsx'
import { useResource } from './useResource.js'

function Users() {
  const { data, loading, error } = useResource('users')

  return <section className="page-section">
    <div className="section-heading"><p className="eyebrow">THE CREW</p><h2>People</h2><p>See who is showing up and moving forward.</p></div>
    <ResourceState loading={loading} error={error}>
      <div className="card-grid">{data.map((user) => <article className="info-card" key={user._id || user.id}><span className="avatar">{user.name?.slice(0, 1).toUpperCase() || '?'}</span><h3>{user.name}</h3><p>{user.email}</p><strong>{user.points || 0} points</strong></article>)}</div>
    </ResourceState>
  </section>
}

export default Users
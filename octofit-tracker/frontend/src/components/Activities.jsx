import { ResourceState } from './ResourceState.jsx'
import { useResource } from './useResource.js'

function Activities() {
  const { data, loading, error } = useResource('activities')

  return <section className="page-section">
    <div className="section-heading"><p className="eyebrow">MOMENTUM</p><h2>Recent activity</h2><p>Every session adds a little more signal.</p></div>
    <ResourceState loading={loading} error={error}>
      <div className="data-list">{data.map((activity) => <article className="data-row" key={activity._id || activity.id}>
        <div><strong>{activity.type || 'Activity'}</strong><span>{activity.user?.name || 'Unknown athlete'} · {activity.notes || 'No notes'}</span></div>
        <div className="row-metric">{activity.duration} min<small>{activity.points || 0} pts</small></div>
      </article>)}</div>
    </ResourceState>
  </section>
}

export default Activities
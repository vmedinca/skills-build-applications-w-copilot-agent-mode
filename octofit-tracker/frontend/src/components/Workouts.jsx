import { ResourceState } from './ResourceState.jsx'
import { useResource } from './useResource.js'

function Workouts() {
  const { data, loading, error } = useResource('workouts')

  return <section className="page-section">
    <div className="section-heading"><p className="eyebrow">NEXT UP</p><h2>Workouts</h2><p>Pick a session that fits the energy you have today.</p></div>
    <ResourceState loading={loading} error={error}>
      <div className="card-grid">{data.map((workout) => <article className="info-card" key={workout._id || workout.id}><span className="card-kicker">{workout.difficulty} · {workout.duration} min</span><h3>{workout.name}</h3><p>{workout.description}</p><strong>{workout.type}</strong></article>)}</div>
    </ResourceState>
  </section>
}

export default Workouts
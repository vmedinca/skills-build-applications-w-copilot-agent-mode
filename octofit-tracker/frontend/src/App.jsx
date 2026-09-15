import './App.css'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'

function App() {
  return (
    <div className="app-shell">
        <header className="app-header">
          <div>
            <p className="eyebrow">OCTOFIT / FIELD NOTES</p>
            <h1>Move with your team.</h1>
          </div>
          <nav aria-label="Primary navigation" className="app-nav">
            <NavLink to="/users">People</NavLink>
            <NavLink to="/activities">Activity</NavLink>
            <NavLink to="/teams">Teams</NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
            <NavLink to="/workouts">Workouts</NavLink>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/leaderboard" replace />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </main>
    </div>
  )
}

export default App

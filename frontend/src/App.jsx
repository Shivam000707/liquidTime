import { useState } from 'react'
import Landing from './components/Landing'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'
import { getProfile, saveProfile, clearProfile, resetSchedule } from './services/storage'

function App() {
  const [profile, setProfile] = useState(() => getProfile())
  const [view, setView] = useState(() => (getProfile()?.onboarded ? 'dashboard' : 'landing'))

  const completeOnboarding = () => {
    setProfile(getProfile())
    setView('dashboard')
  }

  const handleNameChange = (name) => {
    const updated = saveProfile({ name, onboarded: true })
    setProfile(updated)
  }

  const handleReset = () => {
    clearProfile()
    resetSchedule()
    setProfile(null)
    setView('landing')
  }

  if (view === 'landing') {
    return <Landing onEnter={() => setView('onboarding')} />
  }
  if (view === 'onboarding') {
    return <Onboarding onComplete={completeOnboarding} />
  }
  return (
    <Dashboard
      userName={profile?.name ?? 'there'}
      onNameChange={handleNameChange}
      onReset={handleReset}
    />
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import InvitacionXV from './pages/invitacionDenisse/InvitacionDenisse'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <InvitacionXV />
    </>
  )
}

export default App

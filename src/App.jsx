import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import InvitacionXV from './pages/invitacionDenisse/InvitacionDenisse'
import PhotoController from './pages/invitacionDenisse/Photos/PhotoController/PhotoController'
import PhotoBooth from './pages/invitacionDenisse/Photos/PhotoBooth/PhotoBooth'
import PhotoViewer from './pages/invitacionDenisse/Photos/PhotoViewer/PhotoViewer'
import { BrowserRouter, Routes, Route, Link, HashRouter } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <HashRouter>
    <Routes>
      <Route path="/" element={<InvitacionXV />} />
      <Route path="/photo-controller" element={<PhotoController />} />
      <Route path="/photo-booth" element={<PhotoBooth />} />
      <Route path="/photo-viewer" element={<PhotoViewer />} />
    </Routes>
    </HashRouter>
  )
}

export default App

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ReportPage from './pages/ReportPage'
import MapPage from './pages/MapPage'
import ProfilePage from './pages/ProfilePage'
import ItemDetailPage from './pages/ItemDetailPage'

const AUTH_ROUTES = ['/login', '/signup']

function AppShell() {
  const location = useLocation()
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname)

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />
      </Routes>
      {!isAuthRoute && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

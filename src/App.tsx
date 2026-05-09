import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ReportPage from './pages/ReportPage'
import MapPage from './pages/MapPage'
import ProfilePage from './pages/ProfilePage'
import ItemDetailPage from './pages/ItemDetailPage'
import SearchPage from './pages/SearchPage'
import ChatListPage from './pages/ChatListPage'
import ChatPage from './pages/ChatPage'
import ProtectedRoute from './components/ProtectedRoute'
import ItemsListPage from './pages/ItemsListPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password']

function AppShell() {
  const location = useLocation()
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname)

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/report" element={
          <ProtectedRoute>
            <ReportPage />
          </ProtectedRoute>
        } />
        <Route path="/map" element={<MapPage />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/chats" element={
          <ProtectedRoute>
            <ChatListPage />
          </ProtectedRoute>
        } />
        <Route path="/chat/:id" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
        <Route path="/items/:type" element={
          <ProtectedRoute>
            <ItemsListPage />
          </ProtectedRoute>
        } />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />
      </Routes>
      {!isAuthRoute && !location.pathname.startsWith('/chat/') && <BottomNav />}
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

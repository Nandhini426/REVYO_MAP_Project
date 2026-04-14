import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Homepage from './pages/Homepage.jsx'
import Login from './pages/Login.jsx'

import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'

// Vendor pages
import VendorDashboard from './pages/VendorDashboard.jsx'
import VendorInventory from './pages/VendorInventory.jsx'
import VendorAlerts from './pages/VendorAlerts.jsx'

// Customer pages
import CustomerDashboard from './pages/CustomerDashboard.jsx'
import CustomerMarketplace from './pages/CustomerMarketplace.jsx'
import CustomerCart from './pages/CustomerCart.jsx'
import CustomerOrders from './pages/CustomerOrders.jsx'

// NGO pages
import NgoDashboard from './pages/NgoDashboard.jsx'
import NgoDonations from './pages/NgoDonations.jsx'
import NgoPickups from './pages/NgoPickups.jsx'

// Admin pages
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import AdminTransactions from './pages/AdminTransactions.jsx'
import Analytics from './pages/Analytics.jsx'

import { useAuth } from './context/AuthContext.jsx'
import { useProducts } from './context/ProductContext.jsx'

export default function App() {
  const { user, loading: authLoading } = useAuth()
  const { loading: dataLoading, error: dataError } = useProducts()
  const location = useLocation()

  // Pages without sidebar
  const noSidebarPaths = ['/', '/login']
  const showSidebar = user && !noSidebarPaths.includes(location.pathname)

  if (authLoading) {
    return (
      <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: '#888' }}>Starting up Revyo...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div className={`app-layout ${showSidebar ? 'app-layout--with-sidebar' : ''}`}>
      {showSidebar && <Sidebar />}
      <main className="app-main">
        {dataError && (
          <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderBottom: '1px solid #f87171', textAlign: 'center' }}>
            {dataError}
          </div>
        )}
        {user && dataLoading && !dataError && (
          <div style={{ position: 'fixed', top: '1rem', right: '1rem', background: '#10b981', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 1000, animation: 'pulse 2s infinite' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
            Syncing data...
          </div>
        )}
        <Routes>
          
          {/* Public */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={user ? <Navigate to={`/${user.role}`} replace /> : <Login />} />

          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ── Vendor ── */}
          <Route path="/vendor" element={
            <ProtectedRoute allowedRoles={['vendor']}><VendorDashboard /></ProtectedRoute>
          } />
          <Route path="/vendor/inventory" element={
            <ProtectedRoute allowedRoles={['vendor']}><VendorInventory /></ProtectedRoute>
          } />
          <Route path="/vendor/alerts" element={
            <ProtectedRoute allowedRoles={['vendor']}><VendorAlerts /></ProtectedRoute>
          } />

          {/* ── Customer ── */}
          <Route path="/customer" element={
            <ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>
          } />
          <Route path="/customer/marketplace" element={
            <ProtectedRoute allowedRoles={['customer']}><CustomerMarketplace /></ProtectedRoute>
          } />
          <Route path="/customer/cart" element={
            <ProtectedRoute allowedRoles={['customer']}><CustomerCart /></ProtectedRoute>
          } />
          <Route path="/customer/orders" element={
            <ProtectedRoute allowedRoles={['customer']}><CustomerOrders /></ProtectedRoute>
          } />

          {/* ── NGO ── */}
          <Route path="/ngo" element={
            <ProtectedRoute allowedRoles={['ngo']}><NgoDashboard /></ProtectedRoute>
          } />
          <Route path="/ngo/donations" element={
            <ProtectedRoute allowedRoles={['ngo']}><NgoDonations /></ProtectedRoute>
          } />
          <Route path="/ngo/pickups" element={
            <ProtectedRoute allowedRoles={['ngo']}><NgoPickups /></ProtectedRoute>
          } />

          {/* ── Admin ── */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>
          } />
          <Route path="/admin/transactions" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminTransactions /></ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute allowedRoles={['admin']}><Analytics /></ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

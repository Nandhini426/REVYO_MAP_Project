import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  LayoutDashboard, ShoppingCart, Package, Heart, BarChart3,
  Users, Settings, LogOut, Leaf, ChevronLeft, ChevronRight, Home, Store
} from 'lucide-react'
import { useState } from 'react'

const navItems = {
  vendor: [
    { to: '/vendor', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/vendor/inventory', icon: Package, label: 'Inventory' },
    { to: '/vendor/alerts', icon: Settings, label: 'Expiry Alerts' },
  ],
  customer: [
    { to: '/customer', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/customer/marketplace', icon: Store, label: 'Marketplace' },
    { to: '/customer/cart', icon: ShoppingCart, label: 'My Cart' },
    { to: '/customer/orders', icon: Package, label: 'My Orders' },
  ],
  ngo: [
    { to: '/ngo', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/ngo/donations', icon: Heart, label: 'Available Donations' },
    { to: '/ngo/pickups', icon: Package, label: 'My Pickups' },
  ],
  admin: [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'User Management' },
    { to: '/admin/transactions', icon: Package, label: 'Activity Tracker' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ],
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  if (!user) return null

  const items = navItems[user.role] || []

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`} id="main-sidebar">
      {/* Brand */}
      <div className="sidebar__brand">
        <Leaf className="sidebar__brand-icon" size={collapsed ? 24 : 28} />
        {!collapsed && <span className="sidebar__brand-name">Revyo</span>}
      </div>

      {/* Collapse toggle */}
      <button
        className="sidebar__toggle"
        onClick={() => setCollapsed(c => !c)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        id="sidebar-toggle-btn"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Nav links */}
      <nav className="sidebar__nav">
        <NavLink to="/" end className="sidebar__link" id="nav-home">
          <Home size={20} />
          {!collapsed && <span>Home</span>}
        </NavLink>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className="sidebar__link"
            id={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar" style={{ '--role-hue': user.role === 'admin' ? '265' : user.role === 'vendor' ? '160' : user.role === 'customer' ? '190' : '40' }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="sidebar__user-info">
              <span className="sidebar__username">{user.username}</span>
              <span className="sidebar__userrole">{user.role.toUpperCase()}</span>
            </div>
          )}
        </div>
        <button className="sidebar__logout" onClick={handleLogout} id="logout-btn" title="Logout">
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

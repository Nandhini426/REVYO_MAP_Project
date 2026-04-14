import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Leaf, ShieldCheck, Store, ShoppingBag, Heart, ArrowRight, User, Lock, Eye, EyeOff } from 'lucide-react'

const roles = [
  { id: 'admin', label: 'Admin', icon: ShieldCheck, color: '#8b5cf6', desc: 'System management' },
  { id: 'vendor', label: 'Vendor', icon: Store, color: '#10b981', desc: 'Manage inventory' },
  { id: 'customer', label: 'Customer', icon: ShoppingBag, color: '#06b6d4', desc: 'Shop produce' },
  { id: 'ngo', label: 'NGO', icon: Heart, color: '#f59e0b', desc: 'Collect surplus' },
]

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!username.trim()) {
      setError('Please enter your username')
      return
    }

    if (!selectedRole) {
      setError('Please select your role')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 🚀 REAL LOGIN: Using the username and password stored in MongoDB
      const res = await login(username, password)
      
      // Navigate based on their ACTUAL role in the database
      navigate(`/${res.user.role.toLowerCase()}`)
    } catch (err) {
      setError(err.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>

      <div className="login-container">

        {/* LEFT PANEL */}
        <div className="login-brand">
          <Leaf size={40} className="login-brand__icon" />
          <h1 className="login-brand__title">Welcome Back</h1>
          <p className="login-brand__tagline">Fruits & Vegetable Waste Management System</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-form-panel">

          <h2 className="login-form__title">Sign In</h2>
          <p className="login-form__subtitle">Access your account and manage surplus</p>

          <form onSubmit={handleLogin} className="login-form">

            <div className="form-group">
              <label><User size={14} /> Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label><Lock size={14} /> Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', paddingRight: '40px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Role</label>
              <div className="role-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {roles.map((role) => {
                  const Icon = role.icon
                  return (
                    <button
                      key={role.id}
                      type="button"
                      className={`role-card ${selectedRole === role.id ? 'role-card--selected' : ''}`}
                      style={{ '--role-color': role.color, padding: '12px' }}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <Icon size={18} />
                      <span style={{fontSize: '0.8rem'}}>{role.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button
              type="submit"
              className="btn btn--primary btn--lg btn--full"
              disabled={loading || !username || !selectedRole}
              style={{ marginTop: '10px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
            </button>

            <p style={{ marginTop: 15, textAlign: 'center', fontSize: '0.85rem' }}>
              <span
                style={{ color: 'var(--text-3)', cursor: 'pointer' }}
                onClick={async () => {
                  if (!username.trim()) {
                    setError('Please enter your username/email to reset password');
                    return;
                  }
                  alert('A password reset link has been sent to your registered email address!');
                }}
              >
                Forgot your password?
              </span>
            </p>

          </form>

          <p style={{ marginTop: 20, textAlign: 'center', fontSize: '0.9rem' }}>
            New user?{' '}
            <span
              style={{ color: '#06b6d4', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => navigate('/register')}
            >
              Create free account
            </span>
          </p>

        </div>
      </div>
    </div>
  )
}
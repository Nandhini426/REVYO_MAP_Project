import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Leaf, ShieldCheck, Store, ShoppingBag, Heart, ArrowRight, User, Mail, Lock, Eye, EyeOff, BarChart3 } from 'lucide-react'

const roles = [
  { id: 'admin', label: 'Admin', icon: ShieldCheck, color: '#8b5cf6', desc: 'System management' },
  { id: 'vendor', label: 'Vendor', icon: Store, color: '#10b981', desc: 'Manage inventory' },
  { id: 'customer', label: 'Customer', icon: ShoppingBag, color: '#06b6d4', desc: 'Shop produce' },
  { id: 'ngo', label: 'NGO', icon: Heart, color: '#f59e0b', desc: 'Collect surplus' },
]

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!form.role) {
      setError('Please select a role')
      return
    }

    setLoading(true)
    setError('')

    try {
      await register(form)
      // On success, the AuthContext should handle state, we just navigate
      navigate(`/${form.role}`)
    } catch (err) {
      setError(err.message || 'Registration failed')
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

      <div className="login-container" style={{ maxWidth: 900 }}>

        {/* LEFT PANEL */}
        <div className="login-brand">
          <Leaf size={40} className="login-brand__icon" />
          <h1 className="login-brand__title">Join Revyo</h1>
          <p className="login-brand__tagline">Start your journey towards zero food waste today.</p>
          
          <div style={{ marginTop: 40, opacity: 0.8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <ShieldCheck size={20} color="#10b981" />
              <span>Secure role-based access</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <BarChart3 size={20} color="#06b6d4" />
              <span>Real-time environmental impact</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-form-panel">
          <h2 className="login-form__title">Create Account</h2>
          <p className="login-form__subtitle">Fill in your details to get started</p>

          <form onSubmit={handleRegister} className="login-form">
            
            <div className="form-row">
              <div className="form-group">
                <label><User size={14} /> Username</label>
                <input
                  type="text"
                  placeholder="johndoe"
                  className="form-input"
                  value={form.username}
                  onChange={(e) => setForm({...form, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label><Mail size={14} /> Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="form-input"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label><Lock size={14} /> Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className="form-input"
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  required
                  minLength={6}
                  style={{ width: '100%', paddingRight: '40px' }}
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
              <label>Select Your User Role</label>
              <div className="role-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {roles.map((role) => {
                  const Icon = role.icon
                  return (
                    <button
                      key={role.id}
                      type="button"
                      className={`role-card ${form.role === role.id ? 'role-card--selected' : ''}`}
                      style={{ '--role-color': role.color, padding: '12px' }}
                      onClick={() => setForm({...form, role: role.id})}
                    >
                      <Icon size={18} />
                      <span style={{fontSize: '0.85rem'}}>{role.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button
              type="submit"
              className="btn btn--primary btn--lg btn--full"
              disabled={loading}
              style={{ marginTop: 10 }}
            >
              {loading ? 'Creating Account...' : 'Sign Up Free'} <ArrowRight size={18} />
            </button>
          </form>

          <p style={{ marginTop: 20, textAlign: 'center', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <span
              style={{ color: '#06b6d4', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => navigate('/login')}
            >
              Log In
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
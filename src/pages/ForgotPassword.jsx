import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { Leaf, ArrowLeft, Mail, ShieldCheck } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await authAPI.checkEmail(email)
      setSuccess(true)
    } catch (err) {
      setError(err.message || "Failed to process request.")
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

      <div className="login-container" style={{maxWidth: 500}}>
        <div className="login-form-panel" style={{width: '100%'}}>
          <button 
            className="btn btn--ghost btn--sm" 
            onClick={() => navigate('/login')}
            style={{marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8}}
          >
            <ArrowLeft size={16} /> Back to Login
          </button>

          <div style={{textAlign: 'center', marginBottom: 30}}>
            <Leaf size={40} color="#10b981" style={{margin: '0 auto 15px'}} />
            <h2 className="login-form__title">Reset Password</h2>
            <p className="login-form__subtitle">We'll help you get back into your account</p>
          </div>

          {!success ? (
            <form onSubmit={handleReset} className="login-form">
              <div className="form-group">
                <label><Mail size={14} /> Registered Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && <p className="form-error">{error}</p>}

              <button
                type="submit"
                className="btn btn--primary btn--lg btn--full"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div style={{textAlign: 'center', padding: '20px 0'}}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%', background: 'rgba(16,185,129,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
              }}>
                <ShieldCheck size={30} color="#10b981" />
              </div>
              <h3 style={{marginBottom: 10}}>Check your Email!</h3>
              <p style={{color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: 24}}>
                We've sent a password reset link to <strong>{email}</strong>. (Simulated for Demo)
              </p>
              <button className="btn btn--primary btn--full" onClick={() => navigate('/login')}>
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import ImpactTracker from '../components/ImpactTracker.jsx'
import { Leaf, ArrowRight, ShieldCheck, Store, ShoppingBag, Heart } from 'lucide-react'

const features = [
  { icon: Store, title: 'For Vendors', desc: 'Track inventory, manage expiry, reduce waste, and donate surplus to NGOs automatically.', color: '#10b981' },
  { icon: ShoppingBag, title: 'For Customers', desc: 'Browse fresh produce and grab discounted semi-fresh items before they go to waste.', color: '#06b6d4' },
  { icon: Heart, title: 'For NGOs', desc: 'Receive surplus food donations, schedule pickups, and serve communities in need.', color: '#f59e0b' },
  { icon: ShieldCheck, title: 'For Admins', desc: 'Full system oversight, user management, analytics, and impact tracking.', color: '#8b5cf6' },
]

export default function Homepage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="homepage">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg-orbs">
          <div className="orb orb--1" />
          <div className="orb orb--2" />
          <div className="orb orb--3" />
        </div>
        <div className="hero__content">
          <div className="hero__badge">🌿 Sustainable Food Management</div>
          <h1 className="hero__title">
            Reducing Food Waste,<br />
            <span className="hero__title-accent">One Meal at a Time</span>
          </h1>
          <p className="hero__desc">
            Revyo connects vendors, customers, and NGOs to minimize food waste, reduce CO₂ emissions,
            and feed communities — all on a single intelligent platform.
          </p>
          <div className="hero__actions">
            {user ? (
              <button className="btn btn--primary btn--lg" onClick={() => navigate(`/${user.role}`)} id="hero-go-dashboard">
                Go to Dashboard <ArrowRight size={18} />
              </button>
            ) : (
              <>
                <button className="btn btn--primary btn--lg" onClick={() => navigate('/login')} id="hero-get-started">
                  Get Started <ArrowRight size={18} />
                </button>
                <button className="btn btn--outline btn--lg" onClick={() => navigate('/login')} id="hero-sign-in">
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__illustration">
            <div className="hero__circle hero__circle--outer">
              <div className="hero__circle hero__circle--mid">
                <div className="hero__circle hero__circle--inner">
                  <Leaf size={48} className="hero__leaf-icon" />
                </div>
              </div>
            </div>
            <div className="hero__float-card hero__float-card--1">🍅 Fresh Tomatoes</div>
            <div className="hero__float-card hero__float-card--2">🥬 Donated 20kg</div>
            <div className="hero__float-card hero__float-card--3">📉 -45% Waste</div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <ImpactTracker />

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title">Built for Every Stakeholder</h2>
        <p className="section-subtitle">Each role gets a purpose-built dashboard with only the tools they need.</p>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card" style={{ '--feature-color': f.color }}>
              <div className="feature-card__icon">
                <f.icon size={28} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-card">
          <h2>Ready to Make an Impact?</h2>
          <p>Join Revyo and start turning food waste into community nourishment.</p>
          <button className="btn btn--primary btn--lg" onClick={() => navigate(user ? `/${user.role}` : '/login')} id="cta-join-btn">
            {user ? 'Go to Dashboard' : 'Join Now'} <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  )
}

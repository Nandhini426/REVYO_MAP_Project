import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { MONTHLY_STATS, CATEGORY_DISTRIBUTION, CONDITION_DISTRIBUTION, IMPACT_METRICS } from '../utils/mockData.js'
import ImpactTracker from '../components/ImpactTracker.jsx'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
import { ArrowLeft, TrendingUp, Recycle, Truck, Leaf } from 'lucide-react'

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export default function Analytics() {
  const navigate = useNavigate()

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics & Insights</h1>
          <p className="page-subtitle">System-wide waste management data and environmental impact.</p>
        </div>
        <button className="btn btn--outline" onClick={() => navigate('/admin')} id="back-to-admin">
          <ArrowLeft size={18} /> Back to Admin
        </button>
      </div>

      {/* Impact strip */}
      <ImpactTracker />

      {/* Charts Row */}
      <div className="charts-grid">
        {/* Line Chart — Monthly Trends */}
        <div className="card card--chart card--wide">
          <div className="card__header">
            <h2><TrendingUp size={20} /> Monthly Trends</h2>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={MONTHLY_STATS} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradWaste" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradRescued" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDonated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#1a1d2e', border: '1px solid #2a2e3d', borderRadius: 8, color: '#e8eaf0' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend />
                <Area type="monotone" dataKey="waste" stroke="#ef4444" fill="url(#gradWaste)" strokeWidth={2} name="Waste (kg)" />
                <Area type="monotone" dataKey="rescued" stroke="#10b981" fill="url(#gradRescued)" strokeWidth={2} name="Rescued (kg)" />
                <Area type="monotone" dataKey="donated" stroke="#06b6d4" fill="url(#gradDonated)" strokeWidth={2} name="Donated (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie — Category Distribution */}
        <div className="card card--chart">
          <div className="card__header">
            <h2><Recycle size={20} /> By Category</h2>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#475569' }}
                >
                  {CATEGORY_DISTRIBUTION.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1d2e', border: '1px solid #2a2e3d', borderRadius: 8, color: '#e8eaf0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie — Condition Distribution */}
        <div className="card card--chart">
          <div className="card__header">
            <h2><Truck size={20} /> By Condition</h2>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={CONDITION_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#475569' }}
                >
                  {CONDITION_DISTRIBUTION.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1d2e', border: '1px solid #2a2e3d', borderRadius: 8, color: '#e8eaf0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CO₂ Savings Line */}
        <div className="card card--chart card--wide">
          <div className="card__header">
            <h2><Leaf size={20} /> CO₂ Reduction Trend</h2>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={MONTHLY_STATS} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} unit=" T" />
                <Tooltip
                  contentStyle={{ background: '#1a1d2e', border: '1px solid #2a2e3d', borderRadius: 8, color: '#e8eaf0' }}
                  formatter={(val) => [`${val} T`, 'CO₂ Saved']}
                />
                <Line type="monotone" dataKey="co2Saved" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} activeDot={{ r: 7, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

import AnimatedCounter from './AnimatedCounter'
import { Leaf, Wind, Utensils, TrendingDown } from 'lucide-react'
import { IMPACT_METRICS } from '../utils/mockData'

/**
 * "Food Saved → CO₂ Reduced" impact dashboard strip.
 */
export default function ImpactTracker({ compact = false }) {
  const metrics = [
    {
      icon: Leaf,
      value: IMPACT_METRICS.totalFoodSaved,
      suffix: ' kg',
      label: 'Food Saved',
      color: '#10b981',
      desc: 'Total food rescued from waste',
    },
    {
      icon: Wind,
      value: IMPACT_METRICS.co2Reduced,
      suffix: ' T',
      decimals: 1,
      label: 'CO₂ Reduced',
      color: '#06b6d4',
      desc: 'Carbon emissions prevented',
    },
    {
      icon: Utensils,
      value: IMPACT_METRICS.mealsProvided,
      suffix: '',
      label: 'Meals Provided',
      color: '#f59e0b',
      desc: 'Meals served to communities',
    },
    {
      icon: TrendingDown,
      value: IMPACT_METRICS.wastePrevented,
      suffix: '%',
      label: 'Waste Prevented',
      color: '#8b5cf6',
      desc: 'Reduction from baseline',
    },
  ]

  return (
    <section className={`impact-tracker ${compact ? 'impact-tracker--compact' : ''}`}>
      {!compact && (
        <div className="impact-tracker__header">
          <h2 className="impact-tracker__title">
            <Leaf size={22} /> Waste-to-Impact
          </h2>
          <p className="impact-tracker__subtitle">Real-time environmental impact of our community</p>
        </div>
      )}
      <div className="impact-tracker__grid">
        {metrics.map((m) => (
          <div key={m.label} className="impact-card" style={{ '--impact-color': m.color }}>
            <div className="impact-card__icon-wrap">
              <m.icon size={compact ? 20 : 24} />
            </div>
            <div className="impact-card__body">
              <span className="impact-card__value">
                <AnimatedCounter end={m.value} suffix={m.suffix} decimals={m.decimals || 0} duration={2200} />
              </span>
              <span className="impact-card__label">{m.label}</span>
            </div>
            {!compact && <p className="impact-card__desc">{m.desc}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

'use client';

const features = [
  {
    icon: '🏆',
    title: 'Award-Winning Luxury',
    desc: 'Multiple consecutive years as the world\'s most admired luxury SUV brand.',
  },
  {
    icon: '⚙️',
    title: 'British Engineering',
    desc: 'Handcrafted in Solihull, England with over 75 years of innovation.',
  },
  {
    icon: '🌍',
    title: 'All-Terrain Mastery',
    desc: 'Capable of conquering any terrain while delivering supreme comfort.',
  },
  {
    icon: '🔋',
    title: 'Electrified Future',
    desc: 'Leading the charge with hybrid and fully electric powertrains.',
  },
];

export default function FeaturesGrid() {
  return (
    <div className="grid-4" style={{ marginTop: '2rem' }}>
      {features.map(feature => (
        <div
          key={feature.title}
          className="glass-gold"
          style={{ padding: '2rem', borderRadius: '4px', textAlign: 'center', transition: 'transform 0.3s ease' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: '400', marginBottom: '0.75rem' }}>
            {feature.title}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            {feature.desc}
          </p>
        </div>
      ))}
    </div>
  );
}

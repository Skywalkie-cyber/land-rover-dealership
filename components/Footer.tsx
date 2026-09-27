import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="logo-oval" style={{ width: '40px', height: '40px' }}>
                <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                  <path d="M11 2L13.5 8H20L14.5 12L16.5 18L11 14L5.5 18L7.5 12L2 8H8.5L11 2Z" fill="#C9A84C"/>
                </svg>
              </div>
              <div>
                <span className="logo-text" style={{ fontSize: '1rem' }}>Land Rover</span>
                <span className="logo-sub">Premium Dealership</span>
              </div>
            </div>
            <p className="footer-brand-desc">
              Experience the pinnacle of luxury and capability with Land Rover. 
              Crafting extraordinary vehicles for extraordinary people since 1948.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              {['Instagram', 'Twitter', 'Facebook', 'YouTube'].map(social => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  style={{
                    width: '36px',
                    height: '36px',
                    border: '1px solid var(--border)',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    transition: 'var(--transition)',
                  }}
                  className="footer-social-link"
                >
                  {social.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Models */}
          <div>
            <h3 className="footer-col-title">Models</h3>
            <ul className="footer-links">
              {[
                { href: '/models/range-rover', label: 'Range Rover' },
                { href: '/models/range-rover-sport', label: 'Range Rover Sport' },
                { href: '/models/defender-110', label: 'Defender 110' },
                { href: '/models/range-rover-evoque', label: 'Range Rover Evoque' },
                { href: '/models/discovery', label: 'Discovery' },
                { href: '/models/range-rover-electric', label: 'Range Rover Electric' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="footer-col-title">Services</h3>
            <ul className="footer-links">
              {[
                { href: '/booking', label: 'Book Test Drive' },
                { href: '/configurator', label: 'Car Configurator' },
                { href: '/finance', label: 'Finance Calculator' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/news', label: 'Latest News' },
                { href: '/auth/signin', label: 'My Account' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer-col-title">Dealership</h3>
            <ul className="footer-links">
              <li>
                <span className="footer-link" style={{ color: 'var(--text-secondary)' }}>
                  📍 15 Mayfair Boulevard<br />
                  London, W1K 5AF
                </span>
              </li>
              <li>
                <a href="tel:+442079460958" className="footer-link">📞 +44 20 7946 0958</a>
              </li>
              <li>
                <a href="mailto:info@landrover-dealer.com" className="footer-link">✉️ info@landrover-dealer.com</a>
              </li>
              <li style={{ marginTop: '0.5rem' }}>
                <span className="footer-link" style={{ color: 'var(--text-secondary)' }}>
                  Mon–Fri: 9AM – 7PM<br />
                  Sat: 9AM – 5PM<br />
                  Sun: 11AM – 4PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-gold" />

        <div className="footer-bottom">
          <p className="footer-bottom-text">
            © {new Date().getFullYear()} Land Rover Premium Dealership. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" className="footer-bottom-text" style={{ transition: 'color 0.2s' }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

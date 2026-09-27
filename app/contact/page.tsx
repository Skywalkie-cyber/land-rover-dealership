'use client';

import { useState } from 'react';

const dealers = [
  { name: 'Land Rover Mayfair', address: '15 Mayfair Boulevard, London W1K 5AF', phone: '+44 20 7946 0958', hours: 'Mon–Sat: 9AM–7PM, Sun: 11AM–4PM', lat: 51.507, lng: -0.143 },
  { name: 'Land Rover Knightsbridge', address: '82 Brompton Road, London SW3 1ER', phone: '+44 20 7946 1234', hours: 'Mon–Sat: 9AM–7PM, Sun: 11AM–4PM', lat: 51.499, lng: -0.161 },
  { name: 'Land Rover Chelsea', address: '200 Kings Road, London SW3 5XP', phone: '+44 20 7946 5678', hours: 'Mon–Sat: 9AM–6PM, Sun: Closed', lat: 51.488, lng: -0.164 },
  { name: 'Land Rover Birmingham', address: '45 Broad Street, Birmingham B1 2HF', phone: '+44 121 946 0001', hours: 'Mon–Sat: 9AM–7PM, Sun: 11AM–5PM', lat: 52.479, lng: -1.903 },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedDealer, setSelectedDealer] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="page-header-inner">
            <div className="section-label">Get In Touch</div>
            <h1 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Contact <span>Us</span>
            </h1>
            <p className="section-desc" style={{ marginTop: '1rem' }}>
              Whether you have a question, need guidance, or want to schedule a visit—
              our team is always here to help.
            </p>
          </div>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>

            {/* Contact Form */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 300, marginBottom: '2rem' }}>
                Send us a <span style={{ color: 'var(--gold)' }}>Message</span>
              </h2>

              {success ? (
                <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✉️</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, marginBottom: '0.75rem' }}>
                    Message Received!
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    Thank you for reaching out. Our team will respond to your enquiry within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {error && <div className="alert alert-error">⚠️ {error}</div>}

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="John Smith" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+44 20 7946 0958" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select className="form-select" name="subject" value={form.subject} onChange={handleChange}>
                      <option value="">Select a topic...</option>
                      <option>General Enquiry</option>
                      <option>Test Drive Request</option>
                      <option>Finance Query</option>
                      <option>Vehicle Service</option>
                      <option>Parts & Accessories</option>
                      <option>New Vehicle Purchase</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea className="form-textarea" name="message" value={form.message} onChange={handleChange} placeholder="How can we help you today?" style={{ minHeight: '140px' }} required />
                  </div>

                  <button type="submit" className="btn btn-gold btn-lg" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message →'}
                  </button>
                </form>
              )}
            </div>

            {/* Dealer Info */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 300, marginBottom: '2rem' }}>
                Our <span style={{ color: 'var(--gold)' }}>Showrooms</span>
              </h2>

              {/* Dealer Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {dealers.map((dealer, i) => (
                  <div
                    key={dealer.name}
                    onClick={() => setSelectedDealer(i)}
                    style={{
                      padding: '1.25rem',
                      background: selectedDealer === i ? 'rgba(201,168,76,0.08)' : 'var(--surface-1)',
                      border: `1px solid ${selectedDealer === i ? 'var(--gold)' : 'var(--border)'}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{dealer.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>📍 {dealer.address}</div>
                        {selectedDealer === i && (
                          <>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>📞 {dealer.phone}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>🕐 {dealer.hours}</div>
                          </>
                        )}
                      </div>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: selectedDealer === i ? 'var(--gold)' : 'var(--border)',
                        flexShrink: 0, marginTop: '0.3rem',
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="map-placeholder">
                <div className="map-grid" />
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.75rem', opacity: 0.5 }}>🗺️</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Interactive Map</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{dealers[selectedDealer].address}</p>
                  <a
                    href={`https://maps.google.com/?q=${dealers[selectedDealer].address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: '1rem' }}
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>

              {/* Quick Contact */}
              <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <a
                  href={`tel:${dealers[selectedDealer].phone}`}
                  className="btn btn-outline"
                  style={{ justifyContent: 'center' }}
                >
                  📞 Call Us
                </a>
                <a
                  href={`mailto:info@landrover-dealer.com`}
                  className="btn btn-gold"
                  style={{ justifyContent: 'center' }}
                >
                  ✉️ Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

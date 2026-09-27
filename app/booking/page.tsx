'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Car } from '@/lib/db/schema';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
];

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);
}

function BookingForm() {
  const searchParams = useSearchParams();
  const carIdParam = searchParams.get('car');

  const [cars, setCars] = useState<Car[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    carId: carIdParam || '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });

  useEffect(() => {
    fetch('/api/cars')
      .then(r => r.json())
      .then(data => setCars(data.cars || []));
  }, []);

  const selectedCar = form.carId ? cars.find(c => c.id.toString() === form.carId) : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit booking');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow as min date
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, marginBottom: '1rem' }}>
          Test Drive <span style={{ color: 'var(--gold)' }}>Confirmed</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
          Thank you for booking a test drive with us. Our team will contact you within 24 hours 
          to confirm your appointment details.
        </p>
        <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid var(--border-gold)', borderRadius: '4px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
          <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>Booking Summary</div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}><strong style={{ color: 'var(--text-primary)' }}>Name:</strong> {form.name}</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}><strong style={{ color: 'var(--text-primary)' }}>Date:</strong> {form.preferredDate} at {form.preferredTime}</p>
          {selectedCar && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}><strong style={{ color: 'var(--text-primary)' }}>Vehicle:</strong> {selectedCar.name}</p>}
        </div>
        <Link href="/models" className="btn btn-gold btn-lg">Explore More Models</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Progress Steps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '3rem' }}>
        {[
          { num: 1, label: 'Choose Vehicle' },
          { num: 2, label: 'Your Details' },
          { num: 3, label: 'Date & Time' },
        ].map((s, i) => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 'none' }}
              onClick={() => step > s.num && setStep(s.num)}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: step >= s.num ? 'var(--gold)' : 'var(--surface-2)',
                  border: `2px solid ${step >= s.num ? 'var(--gold)' : 'var(--border)'}`,
                  color: step >= s.num ? 'var(--black)' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: step > s.num ? 'pointer' : 'default',
                  transition: 'all 0.3s ease',
                }}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: step >= s.num ? 'var(--gold)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {s.label}
              </span>
            </div>
            {i < 2 && (
              <div style={{ flex: 1, height: '2px', background: step > s.num ? 'var(--gold)' : 'var(--border)', margin: '0 0.5rem', marginBottom: '1.5rem', transition: 'background 0.3s ease' }} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Step 1: Choose Vehicle */}
      {step === 1 && (
        <div className="animate-fade-up">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 300, marginBottom: '0.5rem' }}>
            Select Your <span style={{ color: 'var(--gold)' }}>Vehicle</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Choose the model you'd like to experience.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {cars.map(car => (
              <div
                key={car.id}
                onClick={() => setForm(prev => ({ ...prev, carId: car.id.toString() }))}
                style={{
                  padding: '1.25rem',
                  background: form.carId === car.id.toString() ? 'rgba(201,168,76,0.1)' : 'var(--surface-1)',
                  border: `1px solid ${form.carId === car.id.toString() ? 'var(--gold)' : 'var(--border)'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
                  {car.category}
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 400, marginBottom: '0.25rem' }}>
                  {car.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {formatPrice(car.price)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-gold btn-lg" onClick={() => setStep(2)}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Personal Details */}
      {step === 2 && (
        <div className="animate-fade-up">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 300, marginBottom: '0.5rem' }}>
            Your <span style={{ color: 'var(--gold)' }}>Details</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Enter your contact information so we can confirm your appointment.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '600px' }}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="John Smith" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+44 20 7946 0958" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Additional Message (Optional)</label>
              <textarea className="form-textarea" name="message" value={form.message} onChange={handleChange} placeholder="Any specific requirements or questions..." style={{ minHeight: '100px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', marginTop: '2rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
            <button
              type="button"
              className="btn btn-gold btn-lg"
              onClick={() => {
                if (!form.name || !form.email || !form.phone) {
                  setError('Please fill in all required fields.');
                  return;
                }
                setError('');
                setStep(3);
              }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Date & Time */}
      {step === 3 && (
        <div className="animate-fade-up">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 300, marginBottom: '0.5rem' }}>
            Choose <span style={{ color: 'var(--gold)' }}>Date & Time</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Select a convenient date and time for your test drive.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div className="form-group">
              <label className="form-label">Preferred Date *</label>
              <input className="form-input" type="date" name="preferredDate" value={form.preferredDate} onChange={handleChange} min={minDateStr} required />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Time *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                {timeSlots.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, preferredTime: time }))}
                    style={{
                      padding: '0.625rem 0.5rem',
                      background: form.preferredTime === time ? 'var(--gold)' : 'var(--surface-2)',
                      border: `1px solid ${form.preferredTime === time ? 'var(--gold)' : 'var(--border)'}`,
                      borderRadius: '2px',
                      color: form.preferredTime === time ? 'var(--black)' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {form.preferredDate && form.preferredTime && (
              <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid var(--border-gold)', borderRadius: '4px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>Booking Summary</div>
                {selectedCar && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Vehicle: <strong style={{ color: 'var(--text-primary)' }}>{selectedCar.name}</strong></p>}
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Date: <strong style={{ color: 'var(--text-primary)' }}>{form.preferredDate}</strong></p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Time: <strong style={{ color: 'var(--text-primary)' }}>{form.preferredTime}</strong></p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Name: <strong style={{ color: 'var(--text-primary)' }}>{form.name}</strong></p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', marginTop: '2rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
            <button
              type="submit"
              className="btn btn-gold btn-lg"
              disabled={loading || !form.preferredDate || !form.preferredTime}
            >
              {loading ? 'Confirming...' : 'Confirm Booking ✓'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export default function BookingPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="page-header-inner">
            <div className="section-label">Experience Land Rover</div>
            <h1 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Book a <span>Test Drive</span>
            </h1>
            <p className="section-desc" style={{ marginTop: '1rem' }}>
              The best way to discover Land Rover is behind the wheel. Book your personal test drive 
              with one of our specialists today.
            </p>
          </div>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem', alignItems: 'start' }}>
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2.5rem' }}>
              <Suspense fallback={<div className="loading-overlay"><div className="loading-spinner" /></div>}>
                <BookingForm />
              </Suspense>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1.75rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, marginBottom: '1.25rem' }}>
                  What to Expect
                </h3>
                {[
                  { icon: '🤝', title: 'Personal Consultation', desc: 'One-on-one time with our Land Rover specialists' },
                  { icon: '🚗', title: 'Guided Test Drive', desc: 'Experience capability on curated routes' },
                  { icon: '⚙️', title: 'Feature Walkthrough', desc: 'Discover every luxury detail' },
                  { icon: '💰', title: 'Finance Discussion', desc: 'Explore flexible payment options' },
                ].map(item => (
                  <div key={item.title} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid var(--border-gold)', borderRadius: '4px', padding: '1.75rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 400, marginBottom: '1rem', color: 'var(--gold)' }}>
                  Contact Our Team
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                  Prefer to speak with someone directly?
                </p>
                <a href="tel:+442079460958" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600, color: 'var(--gold)' }}>
                  📞 +44 20 7946 0958
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

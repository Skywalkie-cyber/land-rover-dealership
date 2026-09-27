'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);
}

const interestRates = {
  'Standard (8.9%)': 8.9,
  'PCP Preferred (6.9%)': 6.9,
  'HP Classic (10.9%)': 10.9,
  'Business Finance (7.5%)': 7.5,
};

export default function FinancePage() {
  const [carPrice, setCarPrice] = useState(10200000);
  const [deposit, setDeposit] = useState(2040000);
  const [term, setTerm] = useState(48);
  const [rate, setRate] = useState(8.9);
  const [rateLabel, setRateLabel] = useState('Standard (8.9%)');

  const principal = carPrice - deposit;
  const monthlyRate = rate / 100 / 12;
  const monthly = monthlyRate === 0
    ? principal / term
    : (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
  const totalCost = monthly * term + deposit;
  const totalInterest = totalCost - carPrice;

  const depositPercent = Math.round((deposit / carPrice) * 100);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="page-header-inner">
            <div className="section-label">Make It Yours</div>
            <h1 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Finance <span>Calculator</span>
            </h1>
            <p className="section-desc" style={{ marginTop: '1rem' }}>
              Explore flexible financing options tailored to your needs. 
              Calculate your monthly payments in seconds.
            </p>
          </div>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '3rem', alignItems: 'start' }}>

            {/* Calculator */}
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 300, marginBottom: '2rem' }}>
                Your Finance <span style={{ color: 'var(--gold)' }}>Options</span>
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Car Price */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label className="form-label">Vehicle Price</label>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gold)' }}>{formatPrice(carPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={2000000}
                    max={20000000}
                    step={100000}
                    value={carPrice}
                    onChange={e => {
                      const val = parseInt(e.target.value);
                      setCarPrice(val);
                      setDeposit(Math.round(val * 0.2));
                    }}
                    style={{ width: '100%', accentColor: 'var(--gold)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    <span>₹20L</span><span>₹2Cr</span>
                  </div>
                </div>

                {/* Deposit */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label className="form-label">Deposit ({depositPercent}%)</label>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gold)' }}>{formatPrice(deposit)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={carPrice * 0.5}
                    step={50000}
                    value={deposit}
                    onChange={e => setDeposit(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--gold)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    <span>₹0</span><span>50% ({formatPrice(carPrice * 0.5)})</span>
                  </div>
                </div>

                {/* Term */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <label className="form-label">Loan Term</label>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gold)' }}>{term} months ({Math.round(term/12)} years)</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {[24, 36, 48, 60, 72].map(t => (
                      <button
                        key={t}
                        onClick={() => setTerm(t)}
                        style={{
                          flex: 1,
                          padding: '0.625rem',
                          background: term === t ? 'var(--gold)' : 'var(--surface-2)',
                          border: `1px solid ${term === t ? 'var(--gold)' : 'var(--border)'}`,
                          borderRadius: '2px',
                          color: term === t ? 'var(--black)' : 'var(--text-secondary)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {t}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: '0.5rem' }}>Finance Type</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {Object.entries(interestRates).map(([label, r]) => (
                      <label
                        key={label}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.875rem 1rem',
                          background: rateLabel === label ? 'rgba(201,168,76,0.08)' : 'var(--surface-2)',
                          border: `1px solid ${rateLabel === label ? 'var(--gold)' : 'var(--border)'}`,
                          borderRadius: '2px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <input
                          type="radio"
                          checked={rateLabel === label}
                          onChange={() => { setRate(r); setRateLabel(label); }}
                          style={{ accentColor: 'var(--gold)' }}
                        />
                        <span style={{ fontSize: '0.875rem', color: rateLabel === label ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: 'calc(var(--nav-height) + 1rem)' }}>
              {/* Monthly Payment */}
              <div className="finance-result">
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Monthly Payment
                </div>
                <div className="finance-monthly">
                  {formatPrice(Math.round(monthly))}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Per month for {term} months at {rate}% APR
                </div>
              </div>

              {/* Breakdown */}
              <div className="finance-breakdown" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <div className="finance-breakdown-item">
                  <div className="finance-breakdown-value">{formatPrice(principal)}</div>
                  <div className="finance-breakdown-label">Amount Financed</div>
                </div>
                <div className="finance-breakdown-item">
                  <div className="finance-breakdown-value">{formatPrice(Math.round(totalInterest))}</div>
                  <div className="finance-breakdown-label">Total Interest</div>
                </div>
                <div className="finance-breakdown-item">
                  <div className="finance-breakdown-value">{formatPrice(Math.round(totalCost))}</div>
                  <div className="finance-breakdown-label">Total Cost</div>
                </div>
                <div className="finance-breakdown-item">
                  <div className="finance-breakdown-value">{rate}%</div>
                  <div className="finance-breakdown-label">Annual Rate (APR)</div>
                </div>
              </div>

              <Link href="/booking" className="btn btn-gold btn-lg" style={{ justifyContent: 'center' }}>
                Book Test Drive
              </Link>
              <Link href="/contact" className="btn btn-outline btn-lg" style={{ justifyContent: 'center' }}>
                Speak to Finance Team
              </Link>

              <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1.25rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  * This calculator provides indicative figures only. Actual rates and terms are subject 
                  to credit approval. Please contact our finance team for a personalised quote. 
                  Finance subject to status. Land Rover Financial Services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import CarCard from '@/components/CarCard';
import type { Car } from '@/lib/db/schema';

const categories = ['All', 'Luxury', 'Sport', 'SUV', 'Off-Road', 'Electric'];

export default function ModelsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setLoading(true);
    fetch('/api/cars')
      .then(r => r.json())
      .then(data => {
        setCars(data.cars || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All'
    ? cars
    : cars.filter(c => c.category === activeCategory);

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <div className="page-header-inner">
            <div className="section-label">Our Collection</div>
            <h1 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Discover Our <span>Models</span>
            </h1>
            <p className="section-desc" style={{ marginTop: '1rem' }}>
              From the iconic Defender to the pinnacle Range Rover—explore the full Land Rover lineup,
              each model a masterpiece of capability and refinement.
            </p>
          </div>
        </div>
      </div>

      <div className="container section-sm">
        {/* Category Filter */}
        <div className="tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {loading ? 'Loading...' : `${filtered.length} model${filtered.length !== 1 ? 's' : ''} available`}
        </div>

        {/* Car Grid */}
        {loading ? (
          <div className="loading-overlay">
            <div className="loading-spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <p>No models found in this category.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

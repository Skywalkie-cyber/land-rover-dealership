'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Car } from '@/lib/db/schema';

const colorMap: Record<string, string> = {
  'Santorini Black': '#1a1a1a',
  'Fuji White': '#f8f8f8',
  'Carpathian Grey': '#6b7280',
  'Portofino Blue': '#1d4ed8',
  'Firenze Red': '#991b1b',
  'Hakuba Silver': '#c0c0c0',
  'Tasman Blue': '#2563eb',
  'Indus Silver': '#a0aec0',
  'Silicon Silver': '#9ca3af',
  'Nolita Grey': '#4a5568',
  'Seoul Pearl Silver': '#d1d5db',
  'Phoenix Orange': '#ea580c',
  'Gondwana Stone': '#92400e',
  'Grasmere Green': '#166534',
  'Sedona Red': '#b91c1c',
  'Arroios Grey': '#374151',
  default: '#888888',
};

const trims = [
  { name: 'S', price: 0, desc: 'Standard' },
  { name: 'SE', price: 250000, desc: 'Enhanced' },
  { name: 'HSE', price: 600000, desc: 'Luxury' },
  { name: 'Autobiography', price: 1200000, desc: 'Ultimate' },
  { name: 'SV', price: 2500000, desc: 'Bespoke' },
];

const accessories = [
  { id: 'panoramic-roof', name: 'Panoramic Roof', price: 120000 },
  { id: 'meridian-audio', name: 'Meridian Surround Sound', price: 180000 },
  { id: 'night-vision', name: 'Night Vision Camera', price: 220000 },
  { id: 'massage-seats', name: 'Massage Seats', price: 150000 },
  { id: 'air-suspension', name: 'Electronic Air Suspension', price: 200000 },
  { id: 'tow-pack', name: 'Towing Pack', price: 80000 },
  { id: 'protection-pack', name: 'Exterior Protection Pack', price: 60000 },
  { id: 'rear-ent', name: 'Rear Seat Entertainment', price: 280000 },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);
}

function ConfiguratorContent() {
  const searchParams = useSearchParams();
  const carSlug = searchParams.get('car');

  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedTrim, setSelectedTrim] = useState(trims[0]);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/cars')
      .then(r => r.json())
      .then(data => {
        const carsData = data.cars || [];
        setCars(carsData);
        if (carSlug) {
          const found = carsData.find((c: Car) => c.slug === carSlug);
          if (found) {
            setSelectedCar(found);
            const colors = Array.isArray(found.colors) ? found.colors : [];
            if (colors.length > 0) setSelectedColor(colors[0]);
          }
        } else if (carsData.length > 0) {
          setSelectedCar(carsData[0]);
          const colors = Array.isArray(carsData[0].colors) ? carsData[0].colors : [];
          if (colors.length > 0) setSelectedColor(colors[0]);
        }
      });
  }, [carSlug]);

  const toggleAccessory = (id: string) => {
    setSelectedAccessories(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const accessoriesTotal = accessories
    .filter(a => selectedAccessories.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);

  const totalPrice = (selectedCar?.price || 0) + selectedTrim.price + accessoriesTotal;

  const colors = selectedCar ? (Array.isArray(selectedCar.colors) ? selectedCar.colors : []) : [];

  return (
    <div className="configurator-layout">
      {/* Configuration Options */}
      <div>
        {/* 1. Select Model */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gold)', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>1</span>
            Select Model
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {cars.map(car => (
              <div
                key={car.id}
                onClick={() => {
                  setSelectedCar(car);
                  const carColors = Array.isArray(car.colors) ? car.colors : [];
                  if (carColors.length > 0) setSelectedColor(carColors[0]);
                }}
                style={{
                  padding: '1rem',
                  background: selectedCar?.id === car.id ? 'rgba(201,168,76,0.1)' : 'var(--surface-1)',
                  border: `1px solid ${selectedCar?.id === car.id ? 'var(--gold)' : 'var(--border)'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{car.category}</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 400 }}>{car.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{formatPrice(car.price)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Select Colour */}
        {selectedCar && colors.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gold)', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>2</span>
              Select Colour
              {selectedColor && <span style={{ fontSize: '1rem', fontWeight: 300, color: 'var(--text-secondary)' }}>— {selectedColor}</span>}
            </h2>
            <div className="color-swatches">
              {colors.map(color => (
                <div
                  key={color}
                  title={color}
                  className={`color-swatch ${selectedColor === color ? 'selected' : ''}`}
                  style={{ background: colorMap[color] || colorMap.default }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. Select Trim */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gold)', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>3</span>
            Select Trim Level
          </h2>
          <div className="trim-options" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {trims.map(trim => (
              <div
                key={trim.name}
                className={`trim-option ${selectedTrim.name === trim.name ? 'selected' : ''}`}
                onClick={() => setSelectedTrim(trim)}
              >
                <div className="trim-option-name">{trim.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{trim.desc}</div>
                <div className="trim-option-price">{trim.price > 0 ? `+${formatPrice(trim.price)}` : 'Base'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Accessories */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gold)', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>4</span>
            Add Accessories
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {accessories.map(acc => {
              const isSelected = selectedAccessories.includes(acc.id);
              return (
                <div
                  key={acc.id}
                  onClick={() => toggleAccessory(acc.id)}
                  style={{
                    padding: '1rem',
                    background: isSelected ? 'rgba(201,168,76,0.08)' : 'var(--surface-1)',
                    border: `1px solid ${isSelected ? 'var(--gold)' : 'var(--border)'}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '2px',
                      border: `2px solid ${isSelected ? 'var(--gold)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--gold)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isSelected && <span style={{ color: 'var(--black)', fontSize: '0.7rem', fontWeight: 700 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.1rem' }}>{acc.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>+{formatPrice(acc.price)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Panel */}
      <div className="config-preview">
        {/* Visual */}
        <div className="config-preview-image">
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, #111 0%, #1a1a1a 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(ellipse at center, ${colorMap[selectedColor] || '#888'}22 0%, transparent 70%)`,
              }}
            />
            {selectedColor && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '0.25rem 0.75rem',
                  background: colorMap[selectedColor] || '#888',
                  color: selectedColor === 'Fuji White' ? '#000' : '#fff',
                  fontSize: '0.7rem',
                  borderRadius: '100px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              >
                {selectedColor}
              </div>
            )}
            {selectedCar?.images && selectedCar.images.length > 0 ? (
              <Image
                src={selectedCar.images[0]}
                alt={selectedCar.name}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <svg viewBox="0 0 500 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '90%', opacity: 0.25, position: 'relative', zIndex: 1 }}>
                <path d="M80 170 C80 170 100 170 130 170 C160 170 175 115 220 100 C265 85 285 85 340 100 C385 115 405 170 425 170 C445 170 460 170 460 170 L460 195 C460 195 440 195 420 200 C400 205 385 210 360 210 C335 210 320 205 295 200 C270 195 240 195 215 200 C190 205 175 210 150 210 C125 210 110 205 90 200 C70 195 60 195 60 195 L60 170 Z" fill="white"/>
                <circle cx="145" cy="205" r="32" fill="white" opacity="0.6"/>
                <circle cx="375" cy="205" r="32" fill="white" opacity="0.6"/>
                <path d="M160 125 L210 90 L310 90 L375 125" stroke="white" strokeWidth="4" fill="none"/>
              </svg>
            )}
          </div>
        </div>

        <div className="config-preview-info">
          {selectedCar && (
            <>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.25rem' }}>
                {selectedCar.category}
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>
                {selectedCar.name}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {selectedTrim.name} Specification
                {selectedColor && ` · ${selectedColor}`}
              </div>

              <div className="config-price-breakdown">
                <div className="price-row">
                  <span>Base Price ({selectedCar.name})</span>
                  <span>{formatPrice(selectedCar.price)}</span>
                </div>
                {selectedTrim.price > 0 && (
                  <div className="price-row">
                    <span>{selectedTrim.name} Trim</span>
                    <span>+{formatPrice(selectedTrim.price)}</span>
                  </div>
                )}
                {accessories.filter(a => selectedAccessories.includes(a.id)).map(acc => (
                  <div key={acc.id} className="price-row">
                    <span style={{ fontSize: '0.8rem' }}>{acc.name}</span>
                    <span>+{formatPrice(acc.price)}</span>
                  </div>
                ))}
                <div className="price-row total">
                  <span>Total Price</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </>
          )}

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href={`/booking?car=${selectedCar?.id || ''}`} className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
              Book Test Drive
            </Link>
            <Link href="/finance" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              Calculate Finance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfiguratorPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="page-header-inner">
            <div className="section-label">Build Your Dream</div>
            <h1 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Car <span>Configurator</span>
            </h1>
            <p className="section-desc" style={{ marginTop: '1rem' }}>
              Personalise your Land Rover exactly the way you want it. Choose your model, colour, 
              trim level, and accessories.
            </p>
          </div>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          <Suspense fallback={<div className="loading-overlay"><div className="loading-spinner" /></div>}>
            <ConfiguratorContent />
          </Suspense>
        </div>
      </section>
    </>
  );
}

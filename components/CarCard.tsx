import Link from 'next/link';
import Image from 'next/image';
import type { Car } from '@/lib/db/schema';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

const categoryColors: Record<string, string> = {
  Luxury: '#C9A84C',
  Sport: '#EF4444',
  'Off-Road': '#22C55E',
  Electric: '#3B82F6',
  SUV: '#A855F7',
};

const carIcons: Record<string, string> = {
  Luxury: '🏆',
  Sport: '⚡',
  'Off-Road': '🏔️',
  Electric: '🔋',
  SUV: '🚙',
};

export default function CarCard({ car }: { car: Car }) {
  const categoryColor = categoryColors[car.category] || 'var(--gold)';
  const categoryIcon = carIcons[car.category] || '🚗';

  return (
    <Link href={`/models/${car.slug}`} style={{ display: 'block' }}>
      <article className="car-card">
        {/* Image */}
        <div className="car-card-image" style={{ position: 'relative' }}>
          {car.images && car.images.length > 0 ? (
            <Image
              src={car.images[0]}
              alt={car.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="car-img-placeholder">
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '5rem', opacity: 0.15, filter: 'grayscale(1)' }}>
                  {categoryIcon}
                </div>
                {/* SVG Car Silhouette */}
                <svg
                  viewBox="0 0 400 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '90%', opacity: 0.12 }}
                >
                  <path d="M60 130 C60 130 80 130 100 130 C120 130 130 90 160 80 C190 70 220 70 260 80 C290 90 310 130 330 130 C350 130 370 130 370 130 L370 150 C370 150 350 150 330 155 C310 160 300 165 280 165 C260 165 250 160 230 155 C210 150 190 150 170 155 C150 160 140 165 120 165 C100 165 90 160 70 155 C50 150 40 150 40 150 L40 130 Z" fill="white"/>
                  <circle cx="110" cy="160" r="25" fill="white" opacity="0.5"/>
                  <circle cx="300" cy="160" r="25" fill="white" opacity="0.5"/>
                  <path d="M130 100 L170 75 L250 75 L300 100" stroke="white" strokeWidth="3" fill="none"/>
                </svg>
              </div>
            </div>
          )}
          {car.featured && (
            <div className="car-card-badge">Featured</div>
          )}
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: car.available ? '#22C55E' : '#EF4444',
              boxShadow: `0 0 8px ${car.available ? '#22C55E' : '#EF4444'}`,
            }}
          />
        </div>

        {/* Body */}
        <div className="car-card-body">
          <div className="car-card-category" style={{ color: categoryColor }}>
            {car.category} · {car.year}
          </div>
          <h3 className="car-card-name">{car.name}</h3>

          {/* Specs */}
          <div className="car-card-spec">
            {car.horsepower && (
              <div className="car-spec-item">
                <span className="car-spec-value">{car.horsepower}</span>
                <span className="car-spec-label">HP</span>
              </div>
            )}
            {car.acceleration && (
              <div className="car-spec-item">
                <span className="car-spec-value">{car.acceleration}s</span>
                <span className="car-spec-label">0-100</span>
              </div>
            )}
            {car.range ? (
              <div className="car-spec-item">
                <span className="car-spec-value">{car.range}km</span>
                <span className="car-spec-label">Range</span>
              </div>
            ) : (
              car.topSpeed && (
                <div className="car-spec-item">
                  <span className="car-spec-value">{car.topSpeed}</span>
                  <span className="car-spec-label">km/h Max</span>
                </div>
              )
            )}
            {car.seating && (
              <div className="car-spec-item">
                <span className="car-spec-value">{car.seating}</span>
                <span className="car-spec-label">Seats</span>
              </div>
            )}
          </div>

          <div className="car-card-footer">
            <div>
              <div className="car-card-price-label">Starting From</div>
              <div className="car-card-price">{formatPrice(car.price)}</div>
            </div>
            <div
              className="btn btn-gold btn-sm"
              style={{ pointerEvents: 'none' }}
            >
              View Details
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

import { db } from '../lib/db';
import { cars, news, users } from '../lib/db/schema';
import { hashPassword } from '../lib/auth';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  await db.insert(users).values({
    name: 'Admin',
    email: 'admin@landrover-dealer.com',
    password: adminPassword,
    role: 'admin',
    phone: '+44 20 7946 0958',
  }).onConflictDoNothing();

  // Seed cars
  await db.insert(cars).values([
    {
      name: 'Range Rover',
      slug: 'range-rover',
      category: 'Luxury',
      price: 10200000,
      description: 'The pinnacle of luxury SUV engineering. The Range Rover combines unparalleled refinement with extraordinary all-terrain capability. Every detail is crafted to perfection, from the premium hand-stitched leather interiors to the advanced air suspension system that delivers a transcendent driving experience.',
      shortDesc: 'The ultimate expression of luxury and capability.',
      engine: '4.4L Twin-Turbo V8',
      horsepower: 530,
      torque: 750,
      acceleration: 4.6,
      topSpeed: 250,
      fuelType: 'Petrol',
      transmission: '8-Speed Automatic',
      seating: 5,
      colors: ['Santorini Black', 'Fuji White', 'Carpathian Grey', 'Portofino Blue', 'Firenze Red'],
      images: ['/images/range-rover-1.jpg'],
      features: ['Air Suspension', 'Meridian Sound System', 'Head-Up Display', 'Night Vision', 'Massage Seats', 'Panoramic Roof', 'Wade Sensing'],
      available: true,
      featured: true,
      year: 2024,
    },
    {
      name: 'Range Rover Sport',
      slug: 'range-rover-sport',
      category: 'Sport',
      price: 8500000,
      description: 'Dynamic performance meets iconic design. The Range Rover Sport is the definitive performance SUV, delivering exhilarating capability both on and off the road. With its driver-focused cockpit and cutting-edge technology, every journey becomes an adventure.',
      shortDesc: 'Exhilarating performance with iconic Land Rover capability.',
      engine: '3.0L Inline-6 Turbo',
      horsepower: 395,
      torque: 550,
      acceleration: 5.8,
      topSpeed: 240,
      fuelType: 'Mild Hybrid',
      transmission: '8-Speed Automatic',
      seating: 5,
      colors: ['Santorini Black', 'Fuji White', 'Hakuba Silver', 'Firenze Red', 'Tasman Blue'],
      images: ['/images/range-rover-sport-1.jpg'],
      features: ['Dynamic Air Suspension', 'Pivi Pro Infotainment', 'Terrain Response 2', 'Remote Start', 'Adaptive Cruise Control'],
      available: true,
      featured: true,
      year: 2024,
    },
    {
      name: 'Range Rover Velar',
      slug: 'range-rover-velar',
      category: 'SUV',
      price: 6800000,
      description: 'Elegant sophistication redefined. The Range Rover Velar bridges the gap between design and technology, with its sleek silhouette concealing remarkable technical innovation. The flush door handles and seamless body lines create a profile that turns heads wherever it goes.',
      shortDesc: 'Where design innovation meets driving pleasure.',
      engine: '2.0L Turbocharged',
      horsepower: 296,
      torque: 400,
      acceleration: 6.4,
      topSpeed: 235,
      fuelType: 'Petrol',
      transmission: '8-Speed Automatic',
      seating: 5,
      colors: ['Fuji White', 'Indus Silver', 'Silicon Silver', 'Nolita Grey', 'Portofino Blue'],
      images: ['/images/velar-1.jpg'],
      features: ['Touch Pro Duo', 'ClearSight Ground View', 'Active Road Noise Cancellation', 'Wireless Charging'],
      available: true,
      featured: false,
      year: 2024,
    },
    {
      name: 'Range Rover Evoque',
      slug: 'range-rover-evoque',
      category: 'SUV',
      price: 4500000,
      description: 'Urban sophistication meets off-road adventure. The Range Rover Evoque brought the Range Rover DNA into a compact, city-friendly package without compromising on capability or style. Its bold silhouette and advanced features make it the perfect companion for modern life.',
      shortDesc: 'Compact luxury with bold attitude.',
      engine: '2.0L Ingenium Turbo',
      horsepower: 246,
      torque: 365,
      acceleration: 7.3,
      topSpeed: 219,
      fuelType: 'Mild Hybrid',
      transmission: '9-Speed Automatic',
      seating: 5,
      colors: ['Fuji White', 'Santorini Black', 'Seoul Pearl Silver', 'Phoenix Orange', 'Tasman Blue'],
      images: ['/images/evoque-1.jpg'],
      features: ['ClearSight Rear View Mirror', 'Urban Windscreen', '3D Surround Camera', 'Activity Key'],
      available: true,
      featured: false,
      year: 2024,
    },
    {
      name: 'Defender 110',
      slug: 'defender-110',
      category: 'Off-Road',
      price: 7200000,
      description: 'The icon reborn. The Land Rover Defender combines legendary off-road capability with modern comfort and technology. Built to conquer the most extreme terrains on earth while remaining perfectly comfortable for daily use. The Defender is not just a vehicle—it is a statement.',
      shortDesc: 'The legend reimagined for the modern world.',
      engine: '3.0L Inline-6 Turbo',
      horsepower: 395,
      torque: 550,
      acceleration: 5.6,
      topSpeed: 209,
      fuelType: 'Mild Hybrid',
      transmission: '8-Speed Automatic',
      seating: 7,
      colors: ['Gondwana Stone', 'Santorini Black', 'Fuji White', 'Grasmere Green', 'Sedona Red'],
      images: ['/images/defender-1.jpg'],
      features: ['Terrain Response 2', 'Low Range Transfer Box', 'Air Suspension', 'Wade Sensing', 'Deployable Side Steps'],
      available: true,
      featured: true,
      year: 2024,
    },
    {
      name: 'Defender 90',
      slug: 'defender-90',
      category: 'Off-Road',
      price: 6200000,
      description: 'The compact icon with the heart of an adventurer. The Defender 90 is the three-door version that stays true to the original spirit of adventure. Shorter in body but just as mighty in character, it is designed for those who want maximum capability in a more agile package.',
      shortDesc: 'Compact and mighty—adventure in its purest form.',
      engine: '2.0L Turbocharged',
      horsepower: 296,
      torque: 400,
      acceleration: 7.0,
      topSpeed: 191,
      fuelType: 'Petrol',
      transmission: '8-Speed Automatic',
      seating: 5,
      colors: ['Fuji White', 'Santorini Black', 'Gondwana Stone', 'Tasman Blue', 'Firenze Red'],
      images: ['/images/defender90-1.jpg'],
      features: ['Terrain Response', 'Electronic Air Suspension', 'Wade Sensing', 'Configurable Terrain Response'],
      available: true,
      featured: false,
      year: 2024,
    },
    {
      name: 'Discovery',
      slug: 'discovery',
      category: 'SUV',
      price: 8900000,
      description: 'Seven-seat luxury adventure. The Land Rover Discovery is the ultimate family SUV, combining three rows of luxurious seating with extraordinary all-terrain capability. Versatile, spacious and packed with innovative technology, it redefines what a family vehicle can be.',
      shortDesc: 'Seven-seat capability for the adventurous family.',
      engine: '3.0L Inline-6 MHEV',
      horsepower: 355,
      torque: 500,
      acceleration: 6.4,
      topSpeed: 225,
      fuelType: 'Mild Hybrid',
      transmission: '8-Speed Automatic',
      seating: 7,
      colors: ['Fuji White', 'Santorini Black', 'Silicon Silver', 'Portofino Blue', 'Firenze Red'],
      images: ['/images/discovery-1.jpg'],
      features: ['All-Terrain Progress Control', 'Electric Power Steering', 'Intelligent Seat Fold', 'ClearSight Ground View'],
      available: true,
      featured: false,
      year: 2024,
    },
    {
      name: 'Range Rover Electric',
      slug: 'range-rover-electric',
      category: 'Electric',
      price: 14500000,
      description: 'The future of luxury, reimagined. The all-electric Range Rover delivers zero-emission capability without compromise. With its state-of-the-art battery technology, the Range Rover Electric offers an extraordinary range while maintaining the trademark silence and refinement the nameplate is famous for.',
      shortDesc: 'Zero-emission luxury without compromise.',
      engine: 'Dual Motor Electric',
      horsepower: 610,
      torque: 920,
      acceleration: 3.9,
      topSpeed: 250,
      range: 430,
      fuelType: 'Electric',
      transmission: 'Single-Speed Automatic',
      seating: 5,
      colors: ['Santorini Black', 'Fuji White', 'Arroios Grey', 'Portofino Blue', 'Firenze Red'],
      images: ['/images/range-rover-electric-1.jpg'],
      features: ['430km Range', 'V2L Capability', 'Wireless Charging', 'Air Suspension', 'Night Vision', 'Active Noise Cancellation'],
      available: true,
      featured: true,
      year: 2024,
    },
  ]).onConflictDoNothing();

  // Seed news articles
  await db.insert(news).values([
    {
      title: 'Range Rover Electric: The Future of Luxury Arrives',
      slug: 'range-rover-electric-future-luxury',
      excerpt: 'Land Rover unveils its most ambitious creation yet—the fully electric Range Rover that promises to redefine what luxury electric vehicles can be.',
      content: `The all-electric Range Rover represents Land Rover's bold step into an electrified future. With 610 horsepower, 920 Nm of torque, and a class-leading 430km range, this vehicle proves that going electric doesn't mean compromising on performance or luxury.

The powertrain features dual electric motors delivering instant torque to all four wheels through Land Rover's refined all-wheel-drive system. Combined with the advanced air suspension system, the ride quality is nothing short of exceptional.

Inside, the electric Range Rover maintains the brand's commitment to luxury with premium materials, the latest Pivi Pro infotainment system, and a serene cabin that takes advantage of the near-silent electric drivetrain.

Land Rover has also introduced Vehicle-to-Load (V2L) technology, allowing owners to power external devices from the vehicle's battery—perfect for off-grid adventures.`,
      category: 'New Models',
      image: '/images/news-electric.jpg',
      published: true,
    },
    {
      title: 'Defender Conquers the Dakar: An Epic Adventure',
      slug: 'defender-dakar-adventure',
      excerpt: 'The Land Rover Defender once again proves its legendary capability by completing the Dakar Rally course in record time.',
      content: `In a testament to Land Rover engineering excellence, a modified Defender 110 recently completed the legendary Dakar Rally course, showcasing the vehicle's extraordinary capability in the most demanding conditions on earth.

The Dakar Rally is widely considered the most challenging off-road race in the world, spanning thousands of kilometers across deserts, mountains, and all manner of extreme terrain. The Defender's performance throughout this grueling event has once again cemented its reputation as the ultimate off-road vehicle.

The engineering team worked tirelessly to prepare the vehicle while keeping it as close to production specification as possible, demonstrating that the capabilities seen in the showroom translate directly to real-world extreme performance.

This achievement builds on a long history of Land Rover vehicles proving themselves in the world's most challenging environments, from Arctic expeditions to African safaris.`,
      category: 'Adventures',
      image: '/images/news-dakar.jpg',
      published: true,
    },
    {
      title: '2024 Range Rover Sport: Performance Elevated',
      slug: '2024-range-rover-sport-performance',
      excerpt: 'The 2024 Range Rover Sport brings significant updates to its already impressive performance lineup, with a new Dynamic Extended Edition.',
      content: `Land Rover has unveiled the 2024 Range Rover Sport Dynamic Extended Edition, featuring a number of significant enhancements that push the boundaries of performance SUV capability.

The most notable addition is the new 4.4-liter twin-turbocharged V8 engine producing 530 horsepower, taking the Sport from 0-100 km/h in just 4.5 seconds. This engine is paired with an enhanced version of the 8-speed automatic gearbox for seamless power delivery.

The 2024 model also introduces new driver assistance technologies, including an enhanced version of Lane Keep Assist with active emergency steering, updated predictive cruise control, and a new 360-degree surround view camera system.

Inside, the cabin has been refreshed with new color combinations and material choices, including a sustainable option using recycled materials without compromising on luxury.`,
      category: 'Updates',
      image: '/images/news-sport.jpg',
      published: true,
    },
    {
      title: 'Sustainable Luxury: Land Rover\'s Green Commitment',
      slug: 'land-rover-sustainability-commitment',
      excerpt: 'Land Rover outlines its ambitious sustainability roadmap, aiming for carbon neutrality by 2039 across all operations.',
      content: `Land Rover has announced a comprehensive sustainability strategy that will see the iconic British brand transform into a net-zero carbon business by 2039. This bold commitment covers everything from vehicle production to the supply chain and dealership operations.

The strategy includes transitioning the entire product lineup to electrified options by 2030, with the first fully electric Range Rover leading the charge in 2024. Land Rover will offer hybrid variants of all models as part of this transition.

Manufacturing facilities will shift entirely to renewable energy sources, with the Solihull plant in the UK already running on 100% renewable electricity. Land Rover is also working with suppliers to dramatically reduce the carbon footprint of materials used in vehicle production.

The brand has also committed to reducing water usage in manufacturing by 50% and eliminating single-use plastics from all operations by 2025.`,
      category: 'Sustainability',
      image: '/images/news-sustainability.jpg',
      published: true,
    },
    {
      title: 'Exploring Scotland in a Defender 110',
      slug: 'scotland-defender-110-adventure',
      excerpt: 'Our team takes the new Defender 110 on an epic journey through the Scottish Highlands, discovering why it remains the ultimate adventure companion.',
      content: `There is no better place to discover the true capability of the Land Rover Defender than the rugged Scottish Highlands. Our team spent a week exploring some of Scotland's most breathtaking—and demanding—landscapes in the new Defender 110.

From the moment we departed Edinburgh, the Defender's commanding presence made itself known. The elevated driving position, combined with the responsive steering and sophisticated suspension, made navigating both urban streets and mountain paths equally effortless.

The highlight of the journey was crossing the infamous Devil's Staircase near Glencoe—a route that would challenge any vehicle. The Defender's Terrain Response 2 system automatically adjusted to the muddy, rocky terrain, while the electronic air suspension maintained a comfortable ride height throughout.

The cabin proved to be a relaxing sanctuary at the end of each challenging day. With premium audio from the Meridian sound system, the latest Pivi Pro navigation keeping us on track, and heated seats warding off the Highland chill, the Defender is as comfortable as it is capable.`,
      category: 'Adventures',
      image: '/images/news-scotland.jpg',
      published: true,
    },
    {
      title: 'Bespoke by Land Rover: Personalisation Without Limits',
      slug: 'bespoke-land-rover-personalisation',
      excerpt: 'The SV Bespoke programme gives customers the ability to create truly unique vehicles with over thousands of possible configurations.',
      content: `Land Rover's Special Vehicle Operations (SVO) has expanded its Bespoke personalisation programme, offering customers an unprecedented level of customisation for their luxury vehicles.

The programme now offers over 40 exclusive exterior colours, including a selection of hand-painted options that can be matched to virtually any shade imaginable. Interior options have also been expanded with new leather grades, wood veneer choices, and unique embroidery options.

For those seeking the ultimate expression of personalisation, the SV Bespoke team works directly with customers to create unique features, from custom tread plates with personal engravings to bespoke picnic sets and camping equipment integrated seamlessly into the vehicle.

Prices for the Bespoke programme vary depending on the chosen options, but the team at our dealership is ready to guide you through the process of creating your perfect Land Rover.`,
      category: 'Features',
      image: '/images/news-bespoke.jpg',
      published: true,
    },
  ]).onConflictDoNothing();

  console.log('✅ Database seeded successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

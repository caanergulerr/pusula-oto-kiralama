const { Client } = require('pg');
const bcrypt = require('bcrypt');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_vI27lUHYtOQz@ep-patient-water-altzgv9e-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

const cars = [
  {
    brand: 'Hyundai',
    model: 'i20',
    year: 2022,
    dailyPrice: 1200,
    totalStock: 1,
    availableStock: 1,
    category: 'hatchback',
    imageUrl: '/cars/490705a0a10a27eaf23e96fbb3d6c1ede.png',
    kmLimit: 300,
    description: 'Ekonomik ve konforlu Hyundai i20 ile şehir içi ve şehirlerarası seyahatlerinizi kolaylaştırın.',
    specs: JSON.stringify({ fuelType: 'Benzin', transmission: 'Manuel', seats: 5 }),
    features: JSON.stringify(['Bluetooth', 'USB', 'Klima']),
  },
  {
    brand: 'Renault',
    model: 'Clio',
    year: 2022,
    dailyPrice: 1100,
    totalStock: 1,
    availableStock: 1,
    category: 'hatchback',
    imageUrl: '/cars/4d3b5e844823826e86b561f0c441b197.png',
    kmLimit: 300,
    description: 'Yakıt tasarruflu ve şık tasarımıyla Renault Clio her yolculukta yanınızda.',
    specs: JSON.stringify({ fuelType: 'Benzin', transmission: 'Manuel', seats: 5 }),
    features: JSON.stringify(['Bluetooth', 'USB', 'Klima']),
  },
  {
    brand: 'Fiat',
    model: 'Egea',
    year: 2023,
    dailyPrice: 1300,
    totalStock: 1,
    availableStock: 1,
    category: 'sedan',
    imageUrl: '/cars/6894b7e0695becab108101ee1268dd314.png',
    kmLimit: 300,
    description: 'Geniş iç mekanı ve konforlu sürüşüyle Fiat Egea Sedan uzun yolculuklar için ideal.',
    specs: JSON.stringify({ fuelType: 'Dizel', transmission: 'Manuel', seats: 5 }),
    features: JSON.stringify(['Bluetooth', 'USB', 'Klima', 'Hız Sabitleyici']),
  },
];

async function run() {
  try {
    await client.connect();
    
    for (const car of cars) {
      const res = await client.query(
        `INSERT INTO cars (id, brand, model, year, "dailyPrice", "totalStock", "availableStock", category, "imageUrl", "kmLimit", description, specs, features, "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
         RETURNING id, brand, model`,
        [car.brand, car.model, car.year, car.dailyPrice, car.totalStock, car.availableStock,
         car.category, car.imageUrl, car.kmLimit, car.description, car.specs, car.features]
      );
      console.log('Eklendi:', res.rows[0]);
    }
    
    console.log('\nTüm araçlar başarıyla eklendi!');
  } catch (err) {
    console.error('Hata:', err.message);
  } finally {
    await client.end();
  }
}

run();

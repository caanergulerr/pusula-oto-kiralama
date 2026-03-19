// SQLite'a direkt araç ekleyen seed scripti
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const cars = [
  {
    brand: 'Hyundai', model: 'i20', year: 2023, dailyPrice: 1200,
    totalStock: 2, availableStock: 2, category: 'hatchback',
    imageUrl: '/cars/hatchback.jpg', kmLimit: 200,
    description: 'Ekonomik ve konforlu şehir aracı.',
    fuelType: 'Benzin', gearType: 'Manuel'
  },
  {
    brand: 'Renault', model: 'Clio', year: 2023, dailyPrice: 1100,
    totalStock: 2, availableStock: 2, category: 'hatchback',
    imageUrl: '/cars/hatchback.jpg', kmLimit: 200,
    description: 'Yakıt tasarruflu, konforlu araç.',
    fuelType: 'Benzin', gearType: 'Otomatik'
  },
  {
    brand: 'Fiat', model: 'Egea', year: 2023, dailyPrice: 1000,
    totalStock: 2, availableStock: 2, category: 'sedan',
    imageUrl: '/cars/sedan.jpg', kmLimit: 200,
    description: 'Geniş bagajlı, ailelere uygun sedan.',
    fuelType: 'Dizel', gearType: 'Manuel'
  },
  {
    brand: 'Toyota', model: 'Corolla', year: 2023, dailyPrice: 1500,
    totalStock: 1, availableStock: 1, category: 'sedan',
    imageUrl: '/cars/sedan.jpg', kmLimit: 300,
    description: 'Güvenilir ve uzun yol konforu.',
    fuelType: 'Hibrit', gearType: 'Otomatik'
  },
  {
    brand: 'Ford', model: 'Kuga', year: 2023, dailyPrice: 2000,
    totalStock: 1, availableStock: 1, category: 'suv',
    imageUrl: '/cars/hero-car.png', kmLimit: 300,
    description: 'Güçlü SUV, her araziye uygun.',
    fuelType: 'Dizel', gearType: 'Otomatik'
  },
  {
    brand: 'Volkswagen', model: 'Transporter', year: 2022, dailyPrice: 2500,
    totalStock: 1, availableStock: 1, category: 'minivan',
    imageUrl: '/cars/minivan.jpg', kmLimit: 400,
    description: 'Geniş minivan, grup seyahatleri için ideal.',
    fuelType: 'Dizel', gearType: 'Manuel'
  },
];

async function seed() {
  for (const car of cars) {
    const id = uuidv4();
    const specs = JSON.stringify({
      fuelType: car.fuelType,
      transmission: car.gearType,
      seats: 5
    });

    await new Promise((res) => {
      db.run(`
        INSERT OR IGNORE INTO cars 
          (id, brand, model, year, "dailyPrice", "totalStock", "availableStock", category, "imageUrl", "kmLimit", description, specs, features, "createdAt", "updatedAt")
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `, [id, car.brand, car.model, car.year, car.dailyPrice, car.totalStock, car.availableStock,
          car.category, car.imageUrl, car.kmLimit, car.description, specs, '[]'],
      function(err) {
        if (err) console.error(`${car.brand} ${car.model} eklenemedi:`, err.message);
        else console.log(`✅ ${car.brand} ${car.model} eklendi`);
        res();
      });
    });
  }

  // Kontrol
  await new Promise((res) => {
    db.all('SELECT id, brand, model, "dailyPrice" FROM cars', [], (err, rows) => {
      console.log('\nSQLite araçlar:', rows);
      res();
    });
  });

  console.log('\n✅ Seed tamamlandı!');
  db.close();
}

seed().catch(e => { console.error(e); db.close(); });

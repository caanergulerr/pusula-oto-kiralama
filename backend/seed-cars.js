
const sql = require('mssql');
const crypto = require('crypto');

async function seedCars() {
    const config = {
        user: 'rentacar_user',
        password: 'RentUser12345',
        server: 'localhost',
        port: parseInt(process.env.DB_PORT || '1433'),
        database: 'RentACar',
        options: {
            encrypt: false,
            trustServerCertificate: true
        }
    };

    const cars = [
        {
            brand: 'Fiat',
            model: 'Egea Cross',
            year: 2024,
            dailyPrice: 1200,
            plateNumber: '34 EGA 001',
            imageUrl: 'https://img.paratic.com/dosya/2021/01/fiat-egea-cross-ozellikleri-fiyati-ne-kadar.jpg',
            specs: { fuel: 'Dizel', gear: 'Otomatik', seats: 5 }
        },
        {
            brand: 'Renault',
            model: 'Clio',
            year: 2023,
            dailyPrice: 1000,
            plateNumber: '34 CLO 002',
            imageUrl: 'https://cdn.motor1.com/images/mgl/6Lq09/s1/2020-renault-clio.jpg',
            specs: { fuel: 'Benzin', gear: 'Otomatik', seats: 5 }
        },
        {
            brand: 'Toyota',
            model: 'Corolla Hybrid',
            year: 2024,
            dailyPrice: 1500,
            plateNumber: '06 COR 003',
            imageUrl: 'https://www.toyota.com.tr/content/dam/toyota/turkey/models/corolla/my23/corolla-gallery-01.jpg',
            specs: { fuel: 'Hibrit', gear: 'Otomatik', seats: 5 }
        },
        {
            brand: 'Renault',
            model: 'Megane',
            year: 2023,
            dailyPrice: 1400,
            plateNumber: '35 MEG 004',
            imageUrl: 'https://cdn.motor1.com/images/mgl/W8w6W/s1/renault-megane-sedan.jpg',
            specs: { fuel: 'Dizel', gear: 'Otomatik', seats: 5 }
        },
        {
            brand: 'Hyundai',
            model: 'i20',
            year: 2024,
            dailyPrice: 1100,
            plateNumber: '34 HYU 005',
            imageUrl: 'https://www.hyundai.com/content/dam/hyundai/tr/tr/models/i20/my24/i20-my24-highlights-kv.jpg',
            specs: { fuel: 'Benzin', gear: 'Otomatik', seats: 5 }
        },
        {
            brand: 'Dacia',
            model: 'Duster',
            year: 2023,
            dailyPrice: 1300,
            plateNumber: '34 DST 006',
            imageUrl: 'https://cdn.motor1.com/images/mgl/mrz1e/s1/dacia-duster-2021.jpg',
            specs: { fuel: 'Dizel', gear: 'Manuel', seats: 5 }
        },
        {
            brand: 'Volkswagen',
            model: 'Passat',
            year: 2022,
            dailyPrice: 2000,
            plateNumber: '34 VW 007',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Volkswagen_Passat_B8_Facelift_2.0_TDI_R-Line_Deep_Black_Pearl_%28front_quarter_view%29.jpg',
            specs: { fuel: 'Dizel', gear: 'Otomatik', seats: 5 }
        },
        {
            brand: 'Peugeot',
            model: '3008',
            year: 2024,
            dailyPrice: 1800,
            plateNumber: '34 PGT 008',
            imageUrl: 'https://www.peugeot.com.tr/content/dam/peugeot/master/b2c/models/3008/my24/peugeot-3008-front-quarter.jpg',
            specs: { fuel: 'Dizel', gear: 'Otomatik', seats: 5 }
        },
        {
            brand: 'Ford',
            model: 'Focus',
            year: 2023,
            dailyPrice: 1400,
            plateNumber: '34 FRD 009',
            imageUrl: 'https://www.ford.com.tr/content/dam/guxeu/tr/vehicle-images/focus/ford-focus-kombi-st-line-x-front-quarter-dynamic.jpg',
            specs: { fuel: 'Benzin', gear: 'Otomatik', seats: 5 }
        },
        {
            brand: 'Honda',
            model: 'Civic',
            year: 2024,
            dailyPrice: 1600,
            plateNumber: '34 HND 010',
            imageUrl: 'https://www.honda.com.tr/assets/img/models/civic/civic-sedan-dis-tasarim-1.jpg',
            specs: { fuel: 'Benzin', gear: 'Otomatik', seats: 5 }
        }
    ];

    try {
        await sql.connect(config);
        console.log("Database connected.");

        for (const car of cars) {
            // Check if plate exists
            const check = await sql.query`SELECT id FROM cars WHERE plateNumber = ${car.plateNumber}`;
            if (check.recordset.length > 0) {
                console.log(`Skipping ${car.brand} ${car.model} (Already exists)`);
                continue;
            }

            const request = new sql.Request();
            request.input('id', sql.NVarChar, crypto.randomUUID());
            request.input('brand', sql.NVarChar, car.brand);
            request.input('model', sql.NVarChar, car.model);
            request.input('year', sql.Int, car.year);
            request.input('plateNumber', sql.NVarChar, car.plateNumber);
            request.input('dailyPrice', sql.Decimal(10, 2), car.dailyPrice);
            request.input('imageUrl', sql.NVarChar, car.imageUrl);
            request.input('specs', sql.NVarChar, JSON.stringify(car.specs));

            await request.query(`
                INSERT INTO cars (id, brand, model, year, plateNumber, dailyPrice, imageUrl, specs, createdAt, updatedAt)
                VALUES (@id, @brand, @model, @year, @plateNumber, @dailyPrice, @imageUrl, @specs, GETDATE(), GETDATE())
            `);
            console.log(`Added: ${car.brand} ${car.model}`);
        }

        console.log("Seeding completed successfully.");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await sql.close();
    }
}

seedCars();

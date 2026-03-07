
const sql = require('mssql');
const crypto = require('crypto');

async function seedSampleCars() {
    const config = {
        user: 'rentacar_user',
        password: 'RentUser12345',
        server: 'localhost',
        port: 1443,
        database: 'RentACar',
        options: {
            encrypt: false,
            trustServerCertificate: true
        }
    };

    const cars = [
        {
            brand: 'Hyundai',
            model: 'i20',
            year: 2024,
            dailyPrice: 1100,
            plateNumber: '23 HYU 001',
            imageUrl: 'https://www.hyundai.com/content/dam/hyundai/tr/tr/models/i20/my24/i20-my24-highlights-kv.jpg',
            specs: JSON.stringify({ fuel: 'Benzin', gear: 'Otomatik', seats: 5, fuelType: 'Benzin', transmission: 'Otomatik' }),
            description: 'Hyundai i20 ile şehir içi seyahatlerinizi konforlu ve ekonomik bir şekilde gerçekleştirin.',
            totalStock: 2,
            availableStock: 2,
        },
        {
            brand: 'Renault',
            model: 'Clio',
            year: 2024,
            dailyPrice: 1000,
            plateNumber: '23 CLO 001',
            imageUrl: 'https://cdn.motor1.com/images/mgl/6Lq09/s1/2020-renault-clio.jpg',
            specs: JSON.stringify({ fuel: 'Benzin', gear: 'Otomatik', seats: 5, fuelType: 'Benzin', transmission: 'Otomatik' }),
            description: 'Renault Clio, şehir içi kullanım için ideal kompakt bir araçtır.',
            totalStock: 2,
            availableStock: 2,
        },
        {
            brand: 'Fiat',
            model: 'Egea',
            year: 2025,
            dailyPrice: 1000,
            plateNumber: '23 EGA 001',
            imageUrl: 'https://img.paratic.com/dosya/2021/01/fiat-egea-cross-ozellikleri-fiyati-ne-kadar.jpg',
            specs: JSON.stringify({ fuel: 'Dizel', gear: 'Manuel', seats: 5, fuelType: 'Dizel', transmission: 'Manuel' }),
            description: 'Fiat Egea, geniş iç mekanı ve güçlü motoruyla uzun yol seyahatlerinde de mükemmel performans sunar.',
            totalStock: 1,
            availableStock: 1,
        },
    ];

    try {
        await sql.connect(config);
        console.log("Database connected.");

        for (const car of cars) {
            // Check if plate exists
            const check = await sql.query`SELECT id FROM cars WHERE plateNumber = ${car.plateNumber}`;
            if (check.recordset.length > 0) {
                console.log(`Skipping ${car.brand} ${car.model} (Already exists with plate ${car.plateNumber})`);
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
            request.input('specs', sql.NVarChar, car.specs);
            request.input('description', sql.NVarChar, car.description);
            request.input('totalStock', sql.Int, car.totalStock);
            request.input('availableStock', sql.Int, car.availableStock);

            await request.query(`
                INSERT INTO cars (id, brand, model, year, plateNumber, dailyPrice, imageUrl, specs, description, totalStock, availableStock, createdAt, updatedAt)
                VALUES (@id, @brand, @model, @year, @plateNumber, @dailyPrice, @imageUrl, @specs, @description, @totalStock, @availableStock, GETDATE(), GETDATE())
            `);
            console.log(`✅ Added: ${car.brand} ${car.model}`);
        }

        console.log("\n✅ Sample cars seeding completed!");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await sql.close();
    }
}

seedSampleCars();

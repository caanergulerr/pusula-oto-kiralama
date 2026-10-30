require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const sql = require('mssql');

async function checkAndFixCarStatus() {
    const config = {
        user: process.env.DB_USER || 'rentacar_user',
        password: process.env.DB_PASS || '',
        server: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '1443'),
        database: process.env.DB_NAME || 'RentACar',
        options: {
            encrypt: false,
            trustServerCertificate: true
        }
    };

    try {
        await sql.connect(config);
        console.log("Database connected.");

        // First, check current status
        const checkResult = await sql.query`SELECT id, brand, model, status FROM cars`;
        console.log("\nCurrent car statuses:");
        checkResult.recordset.forEach(car => {
            console.log(`${car.brand} ${car.model}: ${car.status}`);
        });

        // Update ALL cars to AVAILABLE
        const updateResult = await sql.query`UPDATE cars SET status = 'AVAILABLE'`;

        console.log("\n✅ Update completed!");
        console.log("Rows affected:", updateResult.rowsAffected[0]);

        // Verify the update
        const verifyResult = await sql.query`SELECT id, brand, model, status FROM cars`;
        console.log("\nUpdated car statuses:");
        verifyResult.recordset.forEach(car => {
            console.log(`${car.brand} ${car.model}: ${car.status}`);
        });

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await sql.close();
    }
}

checkAndFixCarStatus();

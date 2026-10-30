require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const sql = require('mssql');

async function fixCarStatus() {
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

        const result = await sql.query`UPDATE cars SET status = 'AVAILABLE' WHERE status != 'AVAILABLE'`;

        console.log("Rows affected:", result.rowsAffected);
        console.log("All cars set to AVAILABLE status.");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await sql.close();
    }
}

fixCarStatus();

const sql = require('mssql');

async function fixCarStatus() {
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

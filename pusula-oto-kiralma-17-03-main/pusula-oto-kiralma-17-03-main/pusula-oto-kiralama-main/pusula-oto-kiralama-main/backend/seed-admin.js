const sql = require('mssql');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function seedAdmin() {
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

    try {
        await sql.connect(config);
        console.log("Database connected.");

        const email = 'admin@example.com';
        const passwordRaw = 'admin123';
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(passwordRaw, salt);

        // Check if user exists
        const check = await sql.query`SELECT id FROM users WHERE email = ${email}`;

        if (check.recordset.length > 0) {
            console.log(`User ${email} already exists. Updating password and role...`);
            const request = new sql.Request();
            request.input('email', sql.NVarChar, email);
            request.input('passwordHash', sql.NVarChar, passwordHash);
            request.input('role', sql.NVarChar, 'ADMIN');

            await request.query(`
                UPDATE users 
                SET password_hash = @passwordHash, role = @role, updated_at = GETDATE()
                WHERE email = @email
            `);
            console.log("Admin updated successfully.");
        } else {
            console.log(`User ${email} does not exist. Creating...`);
            const request = new sql.Request();
            request.input('id', sql.NVarChar, crypto.randomUUID());
            request.input('email', sql.NVarChar, email);
            request.input('passwordHash', sql.NVarChar, passwordHash);
            request.input('fullName', sql.NVarChar, 'System Admin');
            request.input('role', sql.NVarChar, 'ADMIN');
            request.input('phone', sql.NVarChar, '5555555555');

            await request.query(`
                INSERT INTO users (id, email, password_hash, full_name, role, phone, created_at, updated_at)
                VALUES (@id, @email, @passwordHash, @fullName, @role, @phone, GETDATE(), GETDATE())
             `);
            console.log("Admin created successfully.");
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await sql.close();
    }
}

seedAdmin();

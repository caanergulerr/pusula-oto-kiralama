const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_vI27lUHYtOQz@ep-patient-water-altzgv9e-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function run() {
    try {
        await client.connect();

        const hash = '$2b$10$.YeTnYLDYxUxQmP0W36A6OADnUAH7.4tOQ2GnC.K/KTp1HU9lkIE.'; // Pusula2024!

        const res = await client.query(`
      UPDATE users 
      SET password_hash = $1, is_email_verified = true, verification_token = null
      WHERE email = 'caaner.gulerr@gmail.com'
    `, [hash]);

        console.log(`Kullanici guncellendi: ${res.rowCount} kayit etkilendi.`);
    } catch (err) {
        console.error('Veritabani hatasi:', err);
    } finally {
        await client.end();
    }
}

run();

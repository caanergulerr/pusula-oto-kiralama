const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_vI27lUHYtOQz@ep-patient-water-altzgv9e-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function run() {
  try {
    await client.connect();
    
    const res = await client.query(`SELECT id, email, role, is_email_verified FROM users`);
    console.log('Kullanicilar:');
    res.rows.forEach(r => console.log(r));
  } catch (err) {
    console.error('Hata:', err.message);
  } finally {
    await client.end();
  }
}

run();

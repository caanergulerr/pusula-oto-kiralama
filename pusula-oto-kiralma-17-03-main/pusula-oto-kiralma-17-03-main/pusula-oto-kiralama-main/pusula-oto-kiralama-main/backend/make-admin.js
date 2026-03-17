const { Client } = require('pg');
const bcrypt = require('bcrypt');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_vI27lUHYtOQz@ep-patient-water-altzgv9e-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function run() {
  try {
    await client.connect();
    
    // Admin yap ve sifreyi ayarla
    const hash = await bcrypt.hash('Pusula2024!', 10);
    
    const res = await client.query(`
      UPDATE users 
      SET role = 'ADMIN', is_email_verified = true, password_hash = $1
      WHERE email = 'caaner.gulerr@gmail.com'
    `, [hash]);
    
    console.log(`Guncellendi: ${res.rowCount} kayit`);
    
    // Kontrol et
    const check = await client.query(`SELECT email, role, is_email_verified FROM users WHERE email = 'caaner.gulerr@gmail.com'`);
    console.log('Kullanici durumu:', check.rows[0]);
    
  } catch (err) {
    console.error('Hata:', err.message);
  } finally {
    await client.end();
  }
}

run();

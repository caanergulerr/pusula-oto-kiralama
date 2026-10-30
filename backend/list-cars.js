require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await client.connect();
    const res = await client.query(`SELECT id, brand, model, "imageUrl", category FROM cars ORDER BY brand`);
    console.log('Arabalar:');
    res.rows.forEach(r => console.log(JSON.stringify(r)));
  } catch (err) {
    console.error('Hata:', err.message);
  } finally {
    await client.end();
  }
}

run();

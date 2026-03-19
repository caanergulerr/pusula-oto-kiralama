const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

async function run() {
  const hash = await bcrypt.hash('Pusula2024!', 10);
  const id = uuidv4();

  // Admin kullanıcı ekle
  await new Promise((res) => {
    db.run(`
      INSERT OR REPLACE INTO users 
        (id, email, password_hash, full_name, role, phone, is_email_verified, verification_token, password_reset_token, password_reset_expiry, created_at, updated_at)
      VALUES 
        (?, 'caaner.gulerr@gmail.com', ?, 'Admin', 'ADMIN', NULL, 1, NULL, NULL, NULL, datetime('now'), datetime('now'))
    `, [id, hash], function(err) {
      if (err) {
        console.error('INSERT hatası:', err.message);
        // Belki zaten var, güncellemeyi dene
        db.run(`UPDATE users SET password_hash = ?, role = 'ADMIN', is_email_verified = 1 WHERE email = 'caaner.gulerr@gmail.com'`,
          [hash], function(err2) {
            if (err2) console.error('UPDATE hatası:', err2.message);
            else console.log('✅ Admin güncellendi, satır:', this.changes);
            res();
          });
      } else {
        console.log('✅ Admin oluşturuldu! Satır ID:', this.lastID);
        res();
      }
    });
  });

  // Kontrol et
  await new Promise((res) => {
    db.all('SELECT id, email, role, is_email_verified FROM users', [], (err, rows) => {
      console.log('Kullanıcılar:', rows);
      res();
    });
  });

  // Araç sayısı
  await new Promise((res) => {
    db.all('SELECT COUNT(*) as count FROM cars', [], (err, rows) => {
      console.log('Araç sayısı:', rows?.[0]?.count);
      res();
    });
  });

  console.log('\n✅ Bitti!');
  console.log('Email: caaner.gulerr@gmail.com');
  console.log('Şifre: Pusula2024!');
  db.close();
}

run().catch(e => { console.error(e); db.close(); });

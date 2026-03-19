// Bu script sqlite3 modülü kullanır (backend'in asıl bağımlılığı)
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'database.sqlite');
console.log('Veritabanı:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('DB açılamadı:', err.message);
    process.exit(1);
  }
  console.log('✅ Veritabanı açıldı');
});

async function run() {
  // Tabloları listele
  await new Promise((res) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
      if (err) console.error(err);
      else console.log('Tablolar:', rows.map(r => r.name));
      res();
    });
  });

  // Kullanıcıları listele (her iki tablo adını dene)
  const tableName = await new Promise((res) => {
    db.all('SELECT id, email, role FROM "user" LIMIT 5', [], (err, rows) => {
      if (err) {
        db.all('SELECT id, email, role FROM users LIMIT 5', [], (err2, rows2) => {
          if (err2) { console.error('Kullanıcı tablosu bulunamadı'); res(null); }
          else { console.log('Kullanıcılar (users):', rows2); res('users'); }
        });
      } else {
        console.log('Kullanıcılar (user):', rows);
        res('user');
      }
    });
  });

  if (!tableName) {
    console.error('Hiç kullanıcı tablosu bulunamadı!');
    db.close();
    return;
  }

  // Bcrypt hash oluştur
  const hash = await bcrypt.hash('Pusula2024!', 10);
  console.log('\nŞifre hash oluşturuldu');

  // Admin güncelle
  const updateSql = `UPDATE "${tableName}" SET password_hash = ?, role = 'ADMIN', is_email_verified = 1 WHERE email = 'caaner.gulerr@gmail.com'`;
  await new Promise((res) => {
    db.run(updateSql, [hash], function(err) {
      if (err) {
        console.error('Güncelleme hatası:', err.message);
      } else if (this.changes === 0) {
        console.log('Admin bulunamadı, oluşturuluyor...');
        const insertSql = `INSERT INTO "${tableName}" (email, password_hash, role, is_email_verified) VALUES (?, ?, 'ADMIN', 1)`;
        db.run(insertSql, ['caaner.gulerr@gmail.com', hash], function(err2) {
          if (err2) console.error('Oluşturma hatası:', err2.message);
          else console.log('✅ Admin oluşturuldu! ID:', this.lastID);
        });
      } else {
        console.log('✅ Admin güncellendi! Değişen satır:', this.changes);
      }
      res();
    });
  });

  // Araçları say
  await new Promise((res) => {
    db.all('SELECT COUNT(*) as count FROM car', [], (err, rows) => {
      if (err) db.all('SELECT COUNT(*) as count FROM cars', [], (err2, rows2) => {
        if (!err2) console.log('Araç sayısı:', rows2[0]?.count);
        res();
      });
      else { console.log('Araç sayısı:', rows[0]?.count); res(); }
    });
  });

  console.log('\n✅ İşlem tamamlandı!');
  console.log('Email: caaner.gulerr@gmail.com');
  console.log('Şifre: Pusula2024!');

  db.close();
}

run().catch(err => {
  console.error('Hata:', err);
  db.close();
});

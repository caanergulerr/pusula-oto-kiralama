const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'database.sqlite');
console.log('Veritabanı yolu:', dbPath);

const db = new Database(dbPath);

async function fixAdmin() {
  try {
    // Mevcut tabloları listele
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tablolar:', tables.map(t => t.name));

    // Mevcut kullanıcıları gör
    try {
      const users = db.prepare('SELECT id, email, role FROM "user"').all();
      console.log('Mevcut kullanıcılar:', users);
    } catch(e) {
      console.log('user tablosu bulunamadı, deneniyor...');
      const users2 = db.prepare('SELECT id, email, role FROM users').all();
      console.log('Mevcut kullanıcılar:', users2);
    }

    // Şifreyi hashle
    const password = 'Pusula2024!';
    const hash = await bcrypt.hash(password, 10);

    // Admin hesabını güncelle veya oluştur
    let updated = 0;
    try {
      // user tablosu (TypeORM default)
      const result = db.prepare(`
        UPDATE "user" SET 
          password_hash = ?, 
          role = 'ADMIN', 
          is_email_verified = 1
        WHERE email = 'caaner.gulerr@gmail.com'
      `).run(hash);
      updated = result.changes;
      
      if (updated === 0) {
        // Kullanıcı yoksa oluştur
        db.prepare(`
          INSERT INTO "user" (email, password_hash, role, is_email_verified, created_at, updated_at)
          VALUES ('caaner.gulerr@gmail.com', ?, 'ADMIN', 1, datetime('now'), datetime('now'))
        `).run(hash);
        console.log('Yeni admin oluşturuldu!');
      } else {
        console.log('Admin güncellendi!');
      }
    } catch(e) {
      console.error('Hata:', e.message);
      // users tablosu dene
      try {
        const result2 = db.prepare(`
          UPDATE users SET 
            password_hash = ?, 
            role = 'ADMIN', 
            is_email_verified = 1
          WHERE email = 'caaner.gulerr@gmail.com'
        `).run(hash);
        console.log('users tablosu güncellendi:', result2.changes);
      } catch(e2) {
        console.error('users da çalışmadı:', e2.message);
      }
    }

    // Son durumu kontrol et
    try {
      const final = db.prepare('SELECT email, role, is_email_verified FROM "user" WHERE email = ?')
        .get('caaner.gulerr@gmail.com');
      console.log('✅ Final durum:', final);
    } catch(e) {}

    console.log('\n✅ İşlem tamamlandı!');
    console.log('E-posta: caaner.gulerr@gmail.com');
    console.log('Şifre: Pusula2024!');

  } catch (err) {
    console.error('Kritik hata:', err.message);
  } finally {
    db.close();
  }
}

fixAdmin();

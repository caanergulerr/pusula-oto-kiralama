// SQLite'taki araç imageUrl'lerini kontrol et
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'data', 'database.sqlite'));

db.all('SELECT id, brand, model, "imageUrl" FROM cars', [], (err, rows) => {
  if (err) {
    // column name might be camelCase or snake
    db.all('SELECT * FROM cars LIMIT 5', [], (err2, rows2) => {
      if (err2) { console.error(err2.message); db.close(); return; }
      console.log('Tüm sütunlar:', Object.keys(rows2[0] || {}));
      rows2.forEach(r => console.log(r));
      db.close();
    });
    return;
  }
  console.log('Araçlar ve imageUrl:');
  rows.forEach(r => console.log(r));
  db.close();
});

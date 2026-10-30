const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function testUpload() {
    try {
        await ssh.connect({
            host: '156.67.27.14',
            username: 'root',
            password: process.env.VPS_PASSWORD || '',
        });

        async function exec(cmd, cwd) {
            console.log(`\n> [${cwd || '/'}] ${cmd}`);
            const result = await ssh.execCommand(cmd, { cwd });
            if (result.stdout) console.log(result.stdout);
            if (result.stderr) console.error('STDERR:', result.stderr);
            return result;
        }

        const projectDir = '/var/www/pusula-oto';

        // DB'den admin kullanıcıları al
        console.log('=== Admin kullanıcıları ===');
        await exec(`node -e "
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
pool.query('SELECT id, email, role FROM users WHERE role = \\'ADMIN\\' LIMIT 5').then(r => {
    console.log(JSON.stringify(r.rows, null, 2));
    pool.end();
}).catch(e => { console.log('DB HATA:', e.message); pool.end(); });
"`, `${projectDir}/backend`);

        console.log('\n=== JWT ile token üret (bypass) ===');
        const tokenResult = await exec(`node -e "
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
pool.query(\\"SELECT id, email, role FROM users WHERE role = 'ADMIN' LIMIT 1\\").then(r => {
    if (!r.rows[0]) { console.log('ADMIN BULUNAMADI'); pool.end(); return; }
    const user = r.rows[0];
    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET);
    console.log('EMAIL:', user.email);
    console.log('TOKEN:', token);
    pool.end();
}).catch(e => { console.log('HATA:', e.message); pool.end(); });
"`, `${projectDir}/backend`);

        // Token'ı parse et
        const tokenMatch = tokenResult.stdout.match(/TOKEN: (.+)/);
        const token = tokenMatch ? tokenMatch[1].trim() : '';
        console.log('\nToken bulundu mu:', token ? 'EVET' : 'HAYIR, ' + tokenResult.stdout);

        if (token) {
            // Test dosya oluştur
            await exec(`cp /var/www/pusula-oto/frontend/public/uploads/9a8672abe3ea96dc8b3626f37f216d8c.jpg /tmp/test.jpg`);

            console.log('\n=== /upload endpoint testi (backend direkt) ===');
            const r1 = await exec(`curl -s -w "\\nHTTP_STATUS:%{http_code}" \
                -X POST http://localhost:3000/cars/upload \
                -H "Authorization: Bearer ${token}" \
                -F "file=@/tmp/test.jpg;type=image/jpeg"`);
            console.log('Sonuç:', r1.stdout);

            console.log('\n=== /upload-multiple endpoint testi (backend direkt) ===');
            const r2 = await exec(`curl -s -w "\\nHTTP_STATUS:%{http_code}" \
                -X POST http://localhost:3000/cars/upload-multiple \
                -H "Authorization: Bearer ${token}" \
                -F "files=@/tmp/test.jpg;type=image/jpeg"`);
            console.log('Sonuç:', r2.stdout);

            console.log('\n=== Frontend proxy /upload testi ===');
            const r3 = await exec(`curl -s -w "\\nHTTP_STATUS:%{http_code}" \
                -X POST http://localhost:3001/upload \
                -H "Authorization: Bearer ${token}" \
                -F "file=@/tmp/test.jpg;type=image/jpeg"`);
            console.log('Sonuç:', r3.stdout);
        }

        // Nginx config
        console.log('\n=== Nginx config ===');
        await exec(`cat /etc/nginx/sites-enabled/default 2>/dev/null || cat /etc/nginx/sites-enabled/* 2>/dev/null | head -80`);

        ssh.dispose();
    } catch (e) {
        console.error('HATA:', e.message || e);
        if (ssh) ssh.dispose();
    }
}

testUpload();

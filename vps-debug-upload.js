require('dotenv').config({ path: require('path').resolve(__dirname, 'backend/.env') });
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function debugUpload() {
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

        console.log('=== BACKEND SON 100 LOG ===');
        await exec('pm2 logs pusula-backend --lines 100 --nostream');

        console.log('\n=== FRONTEND SON 50 LOG ===');
        await exec('pm2 logs pusula-frontend --lines 50 --nostream');

        console.log('\n=== Backend dist/cars controller var mı? ===');
        await exec(`cat ${projectDir}/backend/dist/cars/cars.controller.js | head -60`);

        console.log('\n=== Backend .env dosyası ===');
        await exec(`cat ${projectDir}/backend/.env`);

        console.log('\n=== uploads klasörü izinleri ===');
        await exec(`ls -la ${projectDir}/frontend/public/`);
        await exec(`ls -la ${projectDir}/frontend/public/uploads/`);

        console.log('\n=== Nginx config upload limiti ===');
        await exec(`grep -r "client_max_body_size" /etc/nginx/ 2>/dev/null || echo "Limit bulunamadı, varsayılan 1MB"`);

        console.log('\n=== cURL ile upload testi (token olmadan - 401 bekliyoruz) ===');
        await exec(`curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/cars/upload`);

        console.log('\n=== next.config rewrites doğrulama ===');
        await exec(`grep -A3 "upload" ${projectDir}/frontend/next.config.ts`);

        ssh.dispose();
    } catch (e) {
        console.error('HATA:', e.message || e);
        if (ssh) ssh.dispose();
    }
}

debugUpload();

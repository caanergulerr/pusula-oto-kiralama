require('dotenv').config({ path: require('path').resolve(__dirname, 'backend/.env') });
const { NodeSSH } = require('node-ssh');
const path = require('path');
const ssh = new NodeSSH();

async function deployFix() {
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

        console.log('=== 1. car-form.tsx VPS\'e gönderiliyor ===');
        await ssh.putFile(
            path.join(__dirname, 'frontend/src/components/admin/car-form.tsx'),
            `${projectDir}/frontend/src/components/admin/car-form.tsx`
        );
        console.log('✓ Gönderildi');

        console.log('\n=== 2. URL değişikliği doğrulama ===');
        await exec(`grep -n "cars/upload" ${projectDir}/frontend/src/components/admin/car-form.tsx`);

        console.log('\n=== 3. PM2 durdur, build al, başlat ===');
        await exec('pm2 stop all');
        await exec('rm -rf .next', `${projectDir}/frontend`);
        console.log('Build başladı...');
        await exec('npm run build 2>&1', `${projectDir}/frontend`);
        await exec('pm2 start all');
        await exec('pm2 list');

        console.log('\n✅ TAMAMLANDI! Artık /api/cars/upload kullanılıyor (tek katmanlı proxy).');
        ssh.dispose();
    } catch (e) {
        console.error('HATA:', e.message || e);
        if (ssh) ssh.dispose();
    }
}

deployFix();

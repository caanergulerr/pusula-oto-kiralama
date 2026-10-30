require('dotenv').config({ path: require('path').resolve(__dirname, 'backend/.env') });
const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');

const ssh = new NodeSSH();

async function fixUploadProxy() {
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

        console.log('=== 1. next.config.ts VPS\'e gönderiliyor ===');
        await ssh.putFile(
            path.join(__dirname, 'frontend/next.config.ts'),
            `${projectDir}/frontend/next.config.ts`
        );
        console.log('✓ next.config.ts gönderildi');

        console.log('\n=== 2. Doğrulama ===');
        await exec(`cat ${projectDir}/frontend/next.config.ts`);

        console.log('\n=== 3. PM2 durduruluyor ===');
        await exec('pm2 stop all');

        console.log('\n=== 4. .next temizleniyor, build alınıyor (2-3 dk) ===');
        await exec('rm -rf .next', `${projectDir}/frontend`);
        await exec('npm run build 2>&1', `${projectDir}/frontend`);

        console.log('\n=== 5. PM2 başlatılıyor ===');
        await exec('pm2 start all');
        await exec('pm2 list');

        console.log('\n✅ TAMAMLANDI! /upload ve /upload-multiple artık backend\'e yönlendiriliyor.');
        ssh.dispose();
    } catch (e) {
        console.error('HATA:', e.message || e);
        if (ssh) ssh.dispose();
    }
}

fixUploadProxy();

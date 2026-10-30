require('dotenv').config({ path: require('path').resolve(__dirname, 'backend/.env') });
const { NodeSSH } = require('node-ssh');
const path = require('path');
const ssh = new NodeSSH();

async function deploySss() {
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
        const frontendSrc = `${projectDir}/frontend/src`;

        // SSS klasörü oluştur
        await exec(`mkdir -p ${frontendSrc}/app/sss`);

        console.log('=== Dosyalar VPS\'e gönderiliyor ===');
        
        const files = [
            ['frontend/src/app/sss/page.tsx',                        `${frontendSrc}/app/sss/page.tsx`],
            ['frontend/src/components/layout/navbar.tsx',            `${frontendSrc}/components/layout/navbar.tsx`],
            ['frontend/src/components/layout/footer.tsx',            `${frontendSrc}/components/layout/footer.tsx`],
        ];

        for (const [local, remote] of files) {
            await ssh.putFile(path.join(__dirname, local), remote);
            console.log(`✓ ${local.split('/').pop()} gönderildi`);
        }

        console.log('\n=== PM2 durdur, build al, başlat ===');
        await exec('pm2 stop all');
        await exec('rm -rf .next', `${projectDir}/frontend`);
        console.log('Build başladı (2-3 dk)...');
        await exec('npm run build 2>&1', `${projectDir}/frontend`);
        await exec('pm2 start all');
        await exec('pm2 list');

        console.log('\n✅ SSS sayfası canlıya alındı!');
        console.log('👉 https://elazigotokiralamapusula.com/sss');
        ssh.dispose();
    } catch (e) {
        console.error('HATA:', e.message || e);
        if (ssh) ssh.dispose();
    }
}

deploySss();

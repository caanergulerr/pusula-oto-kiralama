require('dotenv').config({ path: require('path').resolve(__dirname, 'backend/.env') });
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkLogs() {
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

        console.log('=== FRONTEND Son Hatalar ===');
        await exec('pm2 logs pusula-frontend --lines 50 --nostream');

        console.log('\n=== BACKEND Son Hatalar ===');
        await exec('pm2 logs pusula-backend --lines 50 --nostream');

        console.log('\n=== Upload klasörü kontrolü ===');
        await exec(`ls -la ${projectDir}/frontend/public/uploads 2>/dev/null || echo "uploads klasörü yok!"`);
        await exec(`ls -la ${projectDir}/backend/dist/frontend/public/uploads 2>/dev/null || echo "dist/uploads yok"`);

        console.log('\n=== uploads klasörü izinleri ===');
        await exec(`stat ${projectDir}/frontend/public/ 2>/dev/null || echo "public/ yok"`);

        console.log('\n=== next.config kontrolü ===');
        await exec(`cat ${projectDir}/frontend/next.config.ts 2>/dev/null || cat ${projectDir}/frontend/next.config.js 2>/dev/null`);

        ssh.dispose();
    } catch (e) {
        console.error('HATA:', e.message || e);
        if (ssh) ssh.dispose();
    }
}

checkLogs();

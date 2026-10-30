const { NodeSSH } = require('node-ssh');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'backend/.env') });
const ssh = new NodeSSH();

async function deployApp() {
    try {
        console.log('Sunucuya baglaniliyor...');
        await ssh.connect({
            host: process.env.VPS_HOST || '156.67.27.14',
            username: process.env.VPS_USER || 'root',
            password: process.env.VPS_PASSWORD || '',
        });
        console.log('Baglanti basarili!');

        async function execCommand(cmd, cwd) {
            console.log(`\n> [${cwd || '/'}] ${cmd}`);
            const result = await ssh.execCommand(cmd, { cwd });
            if (result.stdout) console.log(result.stdout);
            if (result.stderr) console.error('STDERR:', result.stderr);
            return result;
        }

        const repoUrl = 'https://github.com/caanergulerr/pusula-oto-kiralama.git';
        const projectDir = '/var/www/pusula-oto';

        console.log('Kodlar Github\'dan çekiliyor...');
        await execCommand(`rm -rf ${projectDir}/*`); 
        await execCommand(`git clone ${repoUrl} .`, projectDir);

        console.log('.env dosyalari olusturuluyor...');
        
        // Backend .env
        const backendEnv = `
DATABASE_URL="${process.env.DATABASE_URL || ''}"
JWT_SECRET="${process.env.JWT_SECRET || ''}"
FRONTEND_URL=${process.env.FRONTEND_URL || 'https://elazigotokiralamapusula.com'}
APP_URL=${process.env.APP_URL || 'https://elazigotokiralamapusula.com'}
NODE_ENV=production
GMAIL_USER=${process.env.GMAIL_USER || 'otokiralamapusula@gmail.com'}
GMAIL_PASS="${process.env.GMAIL_PASS || ''}"
PORT=3000
PAYTR_MERCHANT_ID=${process.env.PAYTR_MERCHANT_ID || ''}
PAYTR_MERCHANT_KEY=${process.env.PAYTR_MERCHANT_KEY || ''}
PAYTR_MERCHANT_SALT=${process.env.PAYTR_MERCHANT_SALT || ''}
PAYTR_TEST_MODE=${process.env.PAYTR_TEST_MODE || '1'}
`.trim();

        await execCommand(`echo '${backendEnv}' > backend/.env`, projectDir);

        // Frontend .env
        const frontendEnv = `
NEXT_PUBLIC_API_URL=https://elazigotokiralamapusula.com/api
NEXT_PUBLIC_APP_URL=https://elazigotokiralamapusula.com
`.trim();

        await execCommand(`echo '${frontendEnv}' > frontend/.env`, projectDir);

        console.log('Backend bagimliliklari yukleniyor ve build ediliyor...');
        await execCommand('npm install', `${projectDir}/backend`);
        await execCommand('npm run build', `${projectDir}/backend`);

        console.log('Backend başlatılıyor...');
        await execCommand('pm2 delete pusula-backend || true');
        await execCommand('pm2 start dist/main.js --name "pusula-backend"', `${projectDir}/backend`);

        console.log('Frontend bagimliliklari yukleniyor ve build ediliyor...');
        await execCommand('npm install', `${projectDir}/frontend`);
        await execCommand('npx next build', `${projectDir}/frontend`);

        console.log('Frontend başlatılıyor...');
        await execCommand('pm2 delete pusula-frontend || true');
        await execCommand('pm2 start node_modules/.bin/next --name "pusula-frontend" -- start -p 3001', `${projectDir}/frontend`);

        console.log('Nginx ve PM2 kaydediliyor...');
        await execCommand('pm2 save');
        await execCommand('systemctl reload nginx');

        console.log('YAYINLAMA TAMAMLANDI!');
        ssh.dispose();
    } catch (e) {
        console.error('Hata olustu:', e);
        if (ssh) ssh.dispose();
    }
}

deployApp();

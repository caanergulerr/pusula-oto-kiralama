const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function deployApp() {
    try {
        console.log('Sunucuya baglaniliyor...');
        await ssh.connect({
            host: '156.67.27.14',
            username: 'root',
            password: 'Y74rQ4yQBEajBm4ZW6q3e3VJrcq',
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
        // Eğer klasör doluysa temizle veya git pull yap, biz ilk kez kuruyoruz diye direkt clone yapabiliriz 
        // ama hata olmaması için varsa siliyoruz (dikkat: sadece ilk kurulumda güvenli)
        await execCommand(`rm -rf ${projectDir}/*`); 
        await execCommand(`git clone ${repoUrl} .`, projectDir);

        console.log('.env dosyalari olusturuluyor...');
        
        // Backend .env
        const backendEnv = `
DATABASE_URL="postgresql://neondb_owner:npg_vI27lUHYtOQz@ep-patient-water-altzgv9e-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="zC6ejFZdG35e7nqtmgpY/V3D3tXkM9KLZIkqqunGVRfv+SLTpmfPxGXYjG8v6NZDEZr4O/nXeTWizgSJ/08AeA=="
FRONTEND_URL=https://elazigotokiralamapusula.com
APP_URL=https://elazigotokiralamapusula.com
NODE_ENV=production
GMAIL_USER=otokiralamapusula@gmail.com
GMAIL_PASS="nqif vtyh upxo lxna"
PORT=3000
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
        await execCommand('npm run build', `${projectDir}/frontend`);

        console.log('Frontend başlatılıyor...');
        await execCommand('pm2 delete pusula-frontend || true');
        await execCommand('pm2 start npm --name "pusula-frontend" -- start', `${projectDir}/frontend`);

        await execCommand('pm2 save');
        await execCommand('pm2 list');

        console.log('Uygulama dagitimi başarıyla tamamlandı!');
        ssh.dispose();
    } catch (e) {
        console.error('Hata olustu:', e);
        if (ssh) ssh.dispose();
    }
}

deployApp();

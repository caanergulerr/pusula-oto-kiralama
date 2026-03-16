const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function hardFixEnv() {
    try {
        await ssh.connect({
            host: '156.67.27.14',
            username: 'root',
            password: 'Y74rQ4yQBEajBm4ZW6q3e3VJrcq',
        });
        
        async function execCommand(cmd, cwd) {
            console.log(`\n> [${cwd || '/'}] ${cmd}`);
            const result = await ssh.execCommand(cmd, { cwd });
            if (result.stdout) console.log(result.stdout);
            if (result.stderr) console.error('STDERR:', result.stderr);
            return result;
        }

        const projectDir = '/var/www/pusula-oto/frontend';

        console.log('--- Tum .env Dosyalari Temizleniyor ---');
        await execCommand('rm -f .env .env.local .env.production .env.development', projectDir);

        console.log('--- Tek Bir Temiz .env Olusturuluyor ---');
        await execCommand('echo "NEXT_PUBLIC_API_URL=/api" > .env', projectDir);
        await execCommand('echo "NEXT_PUBLIC_APP_URL=" >> .env', projectDir);

        console.log('--- Eski Build Siliniyor ---');
        await execCommand('rm -rf .next', projectDir);

        console.log('--- Temiz Build Baslatiliyor ---');
        await execCommand('npx next build', projectDir);

        console.log('--- PM2 Restart ---');
        await execCommand('pm2 restart pusula-frontend');

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

hardFixEnv();

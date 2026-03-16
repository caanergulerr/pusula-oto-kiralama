const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixFrontend() {
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

        const projectDir = '/var/www/pusula-oto';

        console.log('Frontend portu 3001 olarak ayarlanip pm2 ile baslatiliyor...');
        await execCommand('pm2 delete pusula-frontend || true');
        // PORT environment variable'ını PM2 ile veriyoruz
        await execCommand('PORT=3001 pm2 start npm --name "pusula-frontend" -- start', `${projectDir}/frontend`);
        
        await execCommand('pm2 save');
        await execCommand('pm2 list');

        console.log('Nginx yeniden baslatiliyor...');
        await execCommand('systemctl restart nginx');

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

fixFrontend();

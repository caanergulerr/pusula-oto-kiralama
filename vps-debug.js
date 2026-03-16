const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function debugVps() {
    try {
        await ssh.connect({
            host: '156.67.27.14',
            username: 'root',
            password: 'Y74rQ4yQBEajBm4ZW6q3e3VJrcq',
        });
        
        async function execCommand(cmd) {
            console.log(`\n> ${cmd}`);
            const result = await ssh.execCommand(cmd);
            if (result.stdout) console.log(result.stdout);
            if (result.stderr) console.error('STDERR:', result.stderr);
            return result;
        }

        console.log('--- PM2 Durumu ---');
        await execCommand('pm2 list');
        
        console.log('--- PM2 Logları (Son 50 satır) ---');
        await execCommand('pm2 logs --lines 50 --no-daemon'); // No-daemon ile bekleyebilir, o yüzden --lines kullanıp çıkmasını bekleyelim. Hmm execCommand ile sıkıntı olabilir.
        // Alternatif: pm2 list'ten sonra hata varsa flush/restart denenebilir ama loglar kritik.
        
        console.log('--- Port Kullanımı ---');
        await execCommand('netstat -tulpn');

        console.log('--- Frontend .env Kontrolü ---');
        await execCommand('cat /var/www/pusula-oto/frontend/.env');

        console.log('--- Backend .env Kontrolü ---');
        await execCommand('cat /var/www/pusula-oto/backend/.env');

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

debugVps();

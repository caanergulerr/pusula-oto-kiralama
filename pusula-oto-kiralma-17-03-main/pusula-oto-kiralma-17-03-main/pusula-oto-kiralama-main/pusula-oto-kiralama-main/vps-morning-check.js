const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkMorningStatus() {
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

        console.log('--- Auto-SSL Loglari ---');
        await execCommand('cat /root/auto-ssl.log');

        console.log('--- Nginx Mevcut Durum (HTTPS Ayari Gelmis mi?) ---');
        await execCommand('ls -la /etc/nginx/sites-enabled/');
        await execCommand('cat /etc/nginx/sites-available/pusula');

        console.log('--- Sertifika Listesi ---');
        await execCommand('certbot certificates');

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

checkMorningStatus();

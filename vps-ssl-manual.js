const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function runSslManual() {
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

        console.log('--- Manuel SSL Denemesi Baslatiliyor ---');
        await execCommand('certbot --nginx -d elazigotokiralamapusula.com -d www.elazigotokiralamapusula.com --non-interactive --agree-tos --email otokiralamapusula@gmail.com');

        console.log('--- Nginx Restart ---');
        await execCommand('systemctl restart nginx');

        console.log('--- Son Durum Kontrolu ---');
        await execCommand('certbot certificates');

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

runSslManual();

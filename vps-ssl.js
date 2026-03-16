const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function installSsl() {
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

        const domain = 'elazigotokiralamapusula.com';

        console.log('SSL sertifikasi aliniyor (Let\'s Encrypt)...');
        await execCommand(`certbot --nginx -d ${domain} -d www.${domain} --non-interactive --agree-tos --email otokiralamapusula@gmail.com`);

        console.log('Nginx yeniden baslatiliyor...');
        await execCommand('systemctl restart nginx');

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

installSsl();

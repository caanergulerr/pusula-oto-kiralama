const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkNginx() {
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

        console.log('--- Nginx Mevcut Ayar ---');
        await execCommand('cat /etc/nginx/sites-available/pusula');

        console.log('--- Nginx Test API (Dahili Test) ---');
        // Nginx uzerinden (80 portu) API testi
        await execCommand('curl -v http://localhost/api/cars');

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

checkNginx();

const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function deepVerification() {
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

        console.log('--- Nginx Aktif Konfigürasyon ---');
        await execCommand('cat /etc/nginx/sites-enabled/pusula');

        console.log('--- Backend API Testi (Veritabanindan arabalari cekme) ---');
        // Lokaldeki backend'e (localhost:3000) gidip arabalari sayalim
        await execCommand('curl -s http://localhost:3000/cars');

        console.log('--- Backend Loglari (DB Hatasi var mi?) ---');
        await execCommand('pm2 logs pusula-backend --lines 50 --no-daemon & sleep 5 && kill $!');

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

deepVerification();

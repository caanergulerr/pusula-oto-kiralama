const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkNetworking() {
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

        console.log('--- Port Dinleme Kontrolü ---');
        await execCommand('netstat -tulpn | grep LISTEN');

        console.log('--- PM2 Logları (Tekrar) ---');
        await execCommand('pm2 logs pusula-frontend --lines 20 --no-daemon & sleep 5 && kill $!'); // 5 saniye log bekle

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

checkNetworking();

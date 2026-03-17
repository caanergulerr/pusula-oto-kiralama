const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function rebuildFrontend() {
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

        console.log('--- PM2 Durduruluyor ---');
        await execCommand('pm2 stop all');

        console.log('--- Temiz Build Baslatiliyor (.next siliniyor) ---');
        await execCommand('rm -rf .next', `${projectDir}/frontend`);
        // Build komutunu çalıştır (Bu uzun sürebilir, execCommand zaman aşımına uğrayabilir mi?)
        // node-ssh execCommand default timeout yok ama bekleyelim.
        await execCommand('npm run build', `${projectDir}/frontend`);

        console.log('--- Build Sonrasi .next Kontrolü ---');
        await execCommand('ls -la .next', `${projectDir}/frontend`);

        console.log('--- Uygulama Baslatiliyor ---');
        await execCommand('pm2 start all');
        await execCommand('pm2 list');

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

rebuildFrontend();

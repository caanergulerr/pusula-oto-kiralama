const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function deepAudit() {
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

        console.log('--- PM2 Show Frontend ---');
        await execCommand('pm2 show pusula-frontend');

        console.log('--- .next Icerigi ---');
        await execCommand('ls -R .next | head -n 20', `${projectDir}/frontend`);

        console.log('--- Package.json Icerigi ---');
        await execCommand('cat package.json', `${projectDir}/frontend`);

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

deepAudit();

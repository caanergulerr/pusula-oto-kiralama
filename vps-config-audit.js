const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function auditConfig() {
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

        console.log('--- Next Config ---');
        await execCommand('cat next.config.ts', `${projectDir}/frontend`);

        console.log('--- .next Dizin Yapisi (Derinlemesine) ---');
        await execCommand('ls -F .next', `${projectDir}/frontend`);
        await execCommand('ls -F .next/server', `${projectDir}/frontend`);

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

auditConfig();

const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkBuildId() {
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

        console.log('--- BUILD_ID Kontrolü ---');
        await execCommand('ls -la .next/BUILD_ID', `${projectDir}/frontend`);
        await execCommand('cat .next/BUILD_ID', `${projectDir}/frontend`);

        console.log('--- Uygulamayı Yeni Yöntemle Baslat (Direct Next Bin) ---');
        await execCommand('pm2 delete pusula-frontend || true');
        await execCommand('pm2 start node_modules/.bin/next --name "pusula-frontend" -- start -p 3001', `${projectDir}/frontend`);
        
        await execCommand('pm2 save');
        await execCommand('pm2 list');

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

checkBuildId();

const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function pullAndBuild() {
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

        console.log('--- Kodlar Guncelleniyor (Git Pull) ---');
        await execCommand('git pull', projectDir);

        console.log('--- Yeni Build Baslatiliyor ---');
        await execCommand('rm -rf .next', `${projectDir}/frontend`);
        await execCommand('npx next build', `${projectDir}/frontend`);

        console.log('--- Uygulama Yeniden Baslatiliyor ---');
        await execCommand('pm2 delete pusula-frontend || true');
        await execCommand('pm2 start node_modules/.bin/next --name "pusula-frontend" -- start -p 3001', `${projectDir}/frontend`);
        await execCommand('pm2 save');

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

pullAndBuild();

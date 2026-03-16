const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function forceBuild() {
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

        console.log('--- Mevcut Build Siliniyor ---');
        await execCommand('rm -rf .next', `${projectDir}/frontend`);

        console.log('--- Manuel Build Baslatiliyor (npx next build) ---');
        await execCommand('npx next build', `${projectDir}/frontend`);

        console.log('--- Build Sonrasi Dosya Kontrolü ---');
        await execCommand('ls -la .next', `${projectDir}/frontend`);
        await execCommand('cat .next/BUILD_ID || echo "BUILD_ID hala yok!"', `${projectDir}/frontend`);

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

forceBuild();

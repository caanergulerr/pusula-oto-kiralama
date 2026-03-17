const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkData() {
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

        console.log('--- Backend .env Icerigi ---');
        await execCommand('cat /var/www/pusula-oto/backend/.env');

        console.log('--- Arabalari Say (API Check) ---');
        await execCommand('curl -s http://localhost:3000/cars | jq ". | length" || curl -s http://localhost:3000/cars');

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

checkData();

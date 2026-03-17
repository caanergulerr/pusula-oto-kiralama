const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function finalVerify() {
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

        console.log('--- Dahili HTTP Testi (www) ---');
        await execCommand('curl -H "Host: www.elazigotokiralamapusula.com" -I http://localhost');

        console.log('--- Dahili HTTP Testi (root) ---');
        await execCommand('curl -H "Host: elazigotokiralamapusula.com" -I http://localhost');

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

finalVerify();

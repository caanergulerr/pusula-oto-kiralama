const { NodeSSH } = require('node-ssh');

const ssh = new NodeSSH();

async function runDeploy() {
    try {
        console.log('Sunucuya baglaniliyor...');
        await ssh.connect({
            host: '156.67.27.14',
            username: 'root',
            password: 'Y74rQ4yQBEajBm4ZW6q3e3VJrcq',
        });
        console.log('Baglanti basarili!');
        
        async function execCommand(cmd) {
            console.log(`\n> ${cmd}`);
            const result = await ssh.execCommand(cmd);
            if (result.stdout) console.log(result.stdout);
            if (result.stderr) console.error('STDERR:', result.stderr);
            return result;
        }

        console.log('Paketler guncelleniyor...');
        await execCommand('apt update -y');
        
        console.log('Temel paketler kuruluyor (curl, git, nginx)...');
        await execCommand('apt install -y curl git nginx');
        
        console.log('Node.js kuruluyor (Node 20)...');
        await execCommand('curl -fsSL https://deb.nodesource.com/setup_20.x | bash -');
        await execCommand('apt-get install -y nodejs');
        
        console.log('PM2 kuruluyor...');
        await execCommand('npm install -g pm2');
        
        console.log('Git repomuz cekilmek uzere /var/www klasoru hazirlaniyor...');
        await execCommand('mkdir -p /var/www/pusula-oto');
        
        console.log('Surumler:');
        await execCommand('node -v');
        await execCommand('npm -v');
        await execCommand('pm2 -v');
        await execCommand('git --version');
        
        console.log('Ilk asamalar tamamlandi!');
        ssh.dispose();
    } catch (e) {
        console.error('Hata olustu:', e);
        if (ssh) ssh.dispose();
    }
}

runDeploy();

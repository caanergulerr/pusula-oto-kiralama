require('dotenv').config({ path: require('path').resolve(__dirname, 'backend/.env') });
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function getLogs() {
    try {
        await ssh.connect({
            host: '156.67.27.14',
            username: 'root',
            password: process.env.VPS_PASSWORD || '',
        });
        
        async function execCommand(cmd) {
            console.log(`\n> ${cmd}`);
            const result = await ssh.execCommand(cmd);
            if (result.stdout) console.log(result.stdout);
            if (result.stderr) console.error('STDERR:', result.stderr);
            return result;
        }

        console.log('--- PM2 Log Dosyaları ---');
        await execCommand('ls -lh /root/.pm2/logs/');

        console.log('--- Frontend Hata Logu (Son 100 satır) ---');
        await execCommand('tail -n 100 /root/.pm2/logs/pusula-frontend-error.log');

        console.log('--- Frontend Standart Log (Son 50 satır) ---');
        await execCommand('tail -n 50 /root/.pm2/logs/pusula-frontend-out.log');

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

getLogs();

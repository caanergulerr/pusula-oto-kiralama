const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function setupAutoSslAndFavicon() {
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

        console.log('--- Kodlar Cekiliyor (Favicon Fix) ---');
        await execCommand('git pull', projectDir);

        console.log('--- Frontend Rebuild (Favicon icin) ---');
        await execCommand('npx next build', `${projectDir}/frontend`);
        await execCommand('pm2 restart pusula-frontend');

        console.log('--- Auto-SSL Scripti Olusturuluyor ---');
        const autoSslScript = `#!/bin/bash
while true; do
  certbot --nginx -d elazigotokiralamapusula.com -d www.elazigotokiralamapusula.com --non-interactive --agree-tos --email otokiralamapusula@gmail.com
  if [ $? -eq 0 ]; then
    echo "SSL basariyla kuruldu!"
    systemctl restart nginx
    break
  else
    echo "SSL denemesi basarisiz, 20 dakika sonra tekrar denenecek..."
    sleep 1200
  fi
done
`;
        await execCommand(`echo '${autoSslScript}' > /root/auto-ssl.sh`);
        await execCommand('chmod +x /root/auto-ssl.sh');

        console.log('--- Auto-SSL Arka Planda Baslatiliyor ---');
        // Screen veya nohup ile arka planda calistir ki SSH kapandiginda durmasin
        await execCommand('nohup /root/auto-ssl.sh > /root/auto-ssl.log 2>&1 &');

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

setupAutoSslAndFavicon();

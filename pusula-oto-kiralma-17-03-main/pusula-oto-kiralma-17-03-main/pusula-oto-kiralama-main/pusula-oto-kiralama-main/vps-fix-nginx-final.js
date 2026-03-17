const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixNginx() {
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

        const nginxConfig = `server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name elazigotokiralamapusula.com www.elazigotokiralamapusula.com 156.67.27.14;

    # Backend API - Strip /api prefix
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`;

        console.log('--- Nginx Konfigurasyonu Yaziliyor ---');
        await execCommand(`echo '${nginxConfig}' > /etc/nginx/sites-available/pusula`);
        
        console.log('--- Nginx Test ve Restart ---');
        await execCommand('nginx -t');
        await execCommand('systemctl restart nginx');

        console.log('--- API Testi (Yeni Ayar ile) ---');
        await execCommand('curl -v http://localhost/api/cars');

        ssh.dispose();
    } catch (e) {
        console.error(e);
        if (ssh) ssh.dispose();
    }
}

fixNginx();

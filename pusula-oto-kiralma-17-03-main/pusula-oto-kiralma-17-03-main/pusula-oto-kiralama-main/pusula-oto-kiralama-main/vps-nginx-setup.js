const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function setupNginx() {
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

        const domain = 'elazigotokiralamapusula.com';
        const nginxConfig = `
server {
    listen 80;
    server_name ${domain} www.${domain};

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
`.trim();

        console.log('Nginx konfigürasyonu olusturuluyor...');
        await execCommand(`echo '${nginxConfig}' > /etc/nginx/sites-available/pusula`);
        await execCommand('ln -sf /etc/nginx/sites-available/pusula /etc/nginx/sites-enabled/');
        await execCommand('rm -f /etc/nginx/sites-enabled/default');
        
        console.log('Nginx test ediliyor ve yeniden baslatiliyor...');
        await execCommand('nginx -t');
        await execCommand('systemctl restart nginx');

        console.log('Nginx yapilandirmasi tamamlandi!');

        console.log('Certbot (SSL) kurulumu baslatiliyor...');
        await execCommand('apt install -y certbot python3-certbot-nginx');
        // SSL sertifikası alma (Etkileşimli olabilir, o yüzden -n ve --agree-tos kullanıyoruz)
        // Not: Alan adının IP'ye yönlenmiş olması gerekir.
        console.log('SSL sertifikasi aliniyor (Let\'s Encrypt)...');
        await execCommand(`certbot --nginx -d ${domain} -d www.${domain} --non-interactive --agree-tos --email otokiralamapusula@gmail.com`);

        console.log('Islem tamam!');
        ssh.dispose();
    } catch (e) {
        console.error('Hata olustu:', e);
        if (ssh) ssh.dispose();
    }
}

setupNginx();

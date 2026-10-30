require('dotenv').config({ path: require('path').resolve(__dirname, 'backend/.env') });
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixNginxSize() {
    try {
        await ssh.connect({
            host: '156.67.27.14',
            username: 'root',
            password: process.env.VPS_PASSWORD || '',
        });

        async function exec(cmd, cwd) {
            console.log(`\n> [${cwd || '/'}] ${cmd}`);
            const result = await ssh.execCommand(cmd, { cwd });
            if (result.stdout) console.log(result.stdout);
            if (result.stderr) console.error('STDERR:', result.stderr);
            return result;
        }

        console.log('=== 1. /etc/nginx/sites-enabled/pusula içeriği ===');
        const nginxResult = await exec('cat /etc/nginx/sites-enabled/pusula');
        let config = nginxResult.stdout;
        console.log('Config:', config.substring(0, 200));

        console.log('\n=== 2. client_max_body_size ekleniyor ===');
        
        if (config.includes('client_max_body_size')) {
            // Varsa değeri güncelle
            config = config.replace(/client_max_body_size\s+[^;]+;/g, 'client_max_body_size 50m;');
            console.log('Mevcut limit güncellendi.');
        } else {
            // server { bloğunun hemen ardına ekle
            config = config.replace(/server\s*\{/, 'server {\n    client_max_body_size 50m;');
            console.log('Yeni limit eklendi.');
        }

        // Python ile güvenli yaz (heredoc sorunlarını önle)
        const escapedConfig = config.replace(/'/g, "'\\''");
        await exec(`python3 -c "
import sys
config = '''${config}'''
with open('/etc/nginx/sites-enabled/pusula', 'w') as f:
    f.write(config)
print('Yazıldı')
"`);

        // Alternatif yöntem - tee kullan
        await exec(`printf '%s' '${escapedConfig}' > /etc/nginx/sites-enabled/pusula || echo "tee yöntemi"`, '/');

        console.log('\n=== 3. Doğrulama ===');
        await exec('grep -n "client_max_body_size" /etc/nginx/sites-enabled/pusula');
        await exec('grep -n "server {" /etc/nginx/sites-enabled/pusula | head -3');

        console.log('\n=== 4. Nginx test ===');
        const testResult = await exec('nginx -t');
        
        if (testResult.stderr && testResult.stderr.includes('failed')) {
            console.error('❌ Nginx config hatası!');
            await exec('cat /etc/nginx/sites-enabled/pusula | head -20');
            ssh.dispose();
            return;
        }

        console.log('\n=== 5. Nginx reload ===');
        await exec('systemctl reload nginx');
        console.log('✅ Nginx 50MB limitiyle güncellendi!');

        console.log('\n=== 6. Kontrol ===');
        await exec('grep "client_max_body_size" /etc/nginx/sites-enabled/pusula');

        ssh.dispose();
    } catch (e) {
        console.error('HATA:', e.message || e);
        if (ssh) ssh.dispose();
    }
}

fixNginxSize();

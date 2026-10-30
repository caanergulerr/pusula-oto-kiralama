require('dotenv').config({ path: require('path').resolve(__dirname, 'backend/.env') });
const { NodeSSH } = require('node-ssh');
const path = require('path');
const ssh = new NodeSSH();

async function fixUploadSize() {
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

        const projectDir = '/var/www/pusula-oto';

        // ===========================================
        // 1. Nginx - client_max_body_size 50m ekle
        // ===========================================
        console.log('=== 1. Nginx config güncelleniyor ===');
        
        const nginxResult = await exec('cat /etc/nginx/sites-enabled/default');
        let nginxConfig = nginxResult.stdout;

        if (nginxConfig.includes('client_max_body_size')) {
            nginxConfig = nginxConfig.replace(/client_max_body_size\s+[^;]+;/, 'client_max_body_size 50m;');
        } else {
            // İlk "server {" satırından sonra ekle
            nginxConfig = nginxConfig.replace(/^server \{/m, 'server {\n    client_max_body_size 50m;');
        }

        // Heredoc ile yaz
        await ssh.execCommand(`cat > /etc/nginx/sites-enabled/default << 'ENDOFFILE'\n${nginxConfig}\nENDOFFILE`);

        console.log('\n=== 2. Nginx doğrulama ===');
        await exec('grep -n "client_max_body_size" /etc/nginx/sites-enabled/default');

        console.log('\n=== 3. Nginx test & reload ===');
        await exec('nginx -t');
        await exec('systemctl reload nginx');
        console.log('✓ Nginx 50MB limitle güncellendi');

        // ===========================================
        // 2. Backend dosyaları gönder
        // ===========================================
        console.log('\n=== 4. Backend main.ts VPS\'e gönderiliyor ===');
        await ssh.putFile(
            path.join(__dirname, 'backend/src/main.ts'),
            `${projectDir}/backend/src/main.ts`
        );
        console.log('✓ main.ts gönderildi');

        console.log('\n=== 5. cars.controller.ts VPS\'e gönderiliyor ===');
        await ssh.putFile(
            path.join(__dirname, 'backend/src/cars/cars.controller.ts'),
            `${projectDir}/backend/src/cars/cars.controller.ts`
        );
        console.log('✓ cars.controller.ts gönderildi');

        // ===========================================
        // 3. Backend rebuild
        // ===========================================
        console.log('\n=== 6. PM2 durduruluyor ===');
        await exec('pm2 stop all');

        console.log('\n=== 7. Backend derleniyor ===');
        await exec('npm run build 2>&1', `${projectDir}/backend`);

        // ===========================================
        // 4. Frontend rebuild (body-parser yok, değişiklik yok, hızlı)
        // ===========================================
        console.log('\n=== 8. main.ts doğrulama ===');
        await exec(`grep -n "bodyParser\|body-parser\|50mb" ${projectDir}/backend/src/main.ts`);

        console.log('\n=== 9. PM2 başlatılıyor ===');
        await exec('pm2 start all');
        await exec('pm2 list');

        console.log('\n=== 10. Son test - 50MB limit doğrulama ===');
        await exec('grep -n "client_max_body_size" /etc/nginx/sites-enabled/default');
        await exec(`grep -n "50 \\* 1024" ${projectDir}/backend/src/cars/cars.controller.ts`);

        console.log('\n✅ TAMAMLANDI! Artık 50MB\'a kadar fotoğraf yüklenebilir.');
        ssh.dispose();
    } catch (e) {
        console.error('HATA:', e.message || e);
        if (ssh) ssh.dispose();
    }
}

fixUploadSize();

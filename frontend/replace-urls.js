const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('src', function (filePath) {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace API_URL instantiations
        let replaced = content.replace(/process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*'http:\/\/localhost:3000'/g, "'/api'");
        // Actually wait, let's just make sure we replace the http://localhost:3000 string wherever it's used as fallback.
        // Replace: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/...`
        // with: `'/api/auth/...'`
        if (content !== replaced) {
            fs.writeFileSync(filePath, replaced);
            console.log('Updated', filePath);
        }
    }
});

const { exec } = require('child_process');
const fs = require('fs');

console.log('Starting...');
exec('npm run start', (err, stdout, stderr) => {
  fs.writeFileSync('out_utf8.txt', stdout + '\n\n' + stderr);
  console.log('Done writing out_utf8.txt');
});

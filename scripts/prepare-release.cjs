const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const publicDir = path.resolve(__dirname, '..', 'public');
const tempExtractDir = path.join(publicDir, 'temp_extract');
if (fs.existsSync(tempExtractDir)) {
  try {
    fs.rmSync(tempExtractDir, { recursive: true, force: true });
  } catch (e) {
    console.log('Notice: Could not remove old temp_extract:', e.message);
  }
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sourceZip = path.join(os.homedir(), 'Downloads', 'NusaSetup (4).zip');
if (!fs.existsSync(sourceZip)) {
  console.error('Source zip not found at:', sourceZip);
  process.exit(1);
}

const workDir = path.join(os.tmpdir(), 'wisa_pkg_' + Date.now());
fs.mkdirSync(workDir, { recursive: true });

console.log('Extracting from:', sourceZip);
execSync(`tar -xf "${sourceZip}" -C "${workDir}"`);

const sourceExe = path.join(workDir, 'NusaSetup.exe');
const targetExe = path.join(workDir, 'WisaSetup.exe');
if (fs.existsSync(sourceExe)) {
  fs.renameSync(sourceExe, targetExe);
}

console.log('Creating WisaSetup.zip...');
execSync(`tar -acf "${path.join(workDir, 'WisaSetup.zip')}" -C "${workDir}" WisaSetup.exe`);

const destZip = path.join(publicDir, 'WisaSetup.zip');
const destExe = path.join(publicDir, 'WisaSetup.exe');

fs.copyFileSync(path.join(workDir, 'WisaSetup.zip'), destZip);
fs.copyFileSync(targetExe, destExe);

console.log('Cleaning up work dir...');
fs.rmSync(workDir, { recursive: true, force: true });

console.log('Success! Created:');
console.log(' -', destZip, `(${fs.statSync(destZip).size} bytes)`);
console.log(' -', destExe, `(${fs.statSync(destExe).size} bytes)`);

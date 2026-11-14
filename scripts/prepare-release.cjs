const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const installerScript = path.join(rootDir, 'installer', 'WisaSetup.iss');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Locate Inno Setup Compiler
const isccPaths = [
  path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Inno Setup 6', 'ISCC.exe'),
  'C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe',
  'C:\\Program Files\\Inno Setup 6\\ISCC.exe'
];

let isccExe = isccPaths.find(p => fs.existsSync(p));
if (!isccExe) {
  console.error('ISCC.exe not found! Please ensure Inno Setup 6 is installed.');
  process.exit(1);
}

console.log('Compiling WisaSetup.exe with Inno Setup...');
execSync(`"${isccExe}" "${installerScript}"`, { stdio: 'inherit' });

console.log('Packaging into WisaSetup.zip...');
const zipFile = path.join(publicDir, 'WisaSetup.zip');
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}
execSync(`tar -acf "${zipFile}" -C "${publicDir}" WisaSetup.exe`);

console.log('Done! Output files in public/:');
console.log(' - WisaSetup.exe:', fs.statSync(path.join(publicDir, 'WisaSetup.exe')).size, 'bytes');
console.log(' - WisaSetup.zip:', fs.statSync(zipFile).size, 'bytes');

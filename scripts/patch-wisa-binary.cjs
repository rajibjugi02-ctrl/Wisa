const fs = require('fs');
const path = require('path');

const exePath = path.resolve(__dirname, '..', 'wisa.exe');
if (!fs.existsSync(exePath)) {
  console.error('wisa.exe not found at:', exePath);
  process.exit(1);
}

const buf = fs.readFileSync(exePath);
console.log('Original wisa.exe size:', buf.length);

// 1. Strings to insert into .rdata cave (at 0xfca91)
// VA base for .rdata: 0x140000c00
const caveOffset = 0xfca91;
const urlStr = 'rajibjugi02-ctrl.github.io/Wisa'; // 31 chars
const authorStr = 'Rajib'; // 5 chars

const urlVA = 0x140000c00 + caveOffset;
const authorOffset = caveOffset + urlStr.length + 1;
const authorVA = 0x140000c00 + authorOffset;

// Write strings to cave
buf.write(urlStr + '\0', caveOffset, 'utf8');
buf.write(authorStr + '\0', authorOffset, 'utf8');

console.log('Wrote URL to cave at offset 0x' + caveOffset.toString(16), 'VA: 0x' + urlVA.toString(16));
console.log('Wrote Author to cave at offset 0x' + authorOffset.toString(16), 'VA: 0x' + authorVA.toString(16));

// 2. Patch About Table in .rdata
// URL fat pointer: offset 0xdd990
buf.writeBigUInt64LE(BigInt(urlVA), 0xdd990);
buf.writeBigUInt64LE(BigInt(urlStr.length), 0xdd998);

// Author fat pointer: offset 0xdda08, length at 0xdda10
buf.writeBigUInt64LE(BigInt(authorVA), 0xdda08);
buf.writeBigUInt64LE(BigInt(authorStr.length), 0xdda10);

console.log('Patched About Table fat pointers:');
console.log(' - URL pointer:', '0x' + buf.readBigUInt64LE(0xdd990).toString(16), 'len:', buf.readBigUInt64LE(0xdd998));
console.log(' - Author pointer:', '0x' + buf.readBigUInt64LE(0xdda08).toString(16), 'len:', buf.readBigUInt64LE(0xdda10));

// 3. Patch User-Agent / Web request string at 0xe1175
// Original: https://rama2555.github.io/nusa (31 chars)
const userAgentStr = 'https://rajibjugi02.github.io/w'; // 31 chars exact fit
buf.write(userAgentStr, 0xe1175, 'utf8');

// 4. Disable PRO badge drawing in sidebar
// Offset 0x54d17: 0f 84 87 00 00 00 (jz 0x54da4) -> 90 90 90 90 90 90 (NOPs)
console.log('Byte at 0x54d17 before patch:', buf.slice(0x54d17, 0x54d17 + 6).toString('hex'));
if (buf[0x54d17] === 0x0f && buf[0x54d17 + 1] === 0x84) {
  buf.fill(0x90, 0x54d17, 0x54d17 + 6);
  console.log('Patched 0x54d17 with 6 NOPs (PRO badge drawing disabled)');
}

// 5. Save patched binary
fs.writeFileSync(exePath, buf);
console.log('Successfully saved patched wisa.exe!');


import fs from 'fs';
import zlib from 'zlib';

function scanPdf(filePath) {
  console.log('Inspecting PDF:', filePath);
  const buf = fs.readFileSync(filePath);
  console.log('File size:', buf.length);

  // Search for /ToUnicode or /Font or /Text
  const fontMatches = [];
  let pos = 0;
  while (true) {
    const idx = buf.indexOf(Buffer.from('/ToUnicode'), pos);
    if (idx === -1) break;
    fontMatches.push(idx);
    pos = idx + 10;
  }
  console.log('ToUnicode CMaps found:', fontMatches.length);

  // Search for text in streams
  pos = 0;
  let streamCount = 0;
  let decompressedWithText = 0;
  const sampleTexts = [];

  while (pos < buf.length) {
    const sIdx = buf.indexOf(Buffer.from('stream'), pos);
    if (sIdx === -1) break;

    // determine stream data start
    let dataStart = sIdx + 6;
    if (buf[dataStart] === 0x0d && buf[dataStart + 1] === 0x0a) dataStart += 2;
    else if (buf[dataStart] === 0x0a) dataStart += 1;

    const eIdx = buf.indexOf(Buffer.from('endstream'), dataStart);
    if (eIdx === -1) break;

    const streamData = buf.subarray(dataStart, eIdx);
    streamCount++;

    try {
      const decompressed = zlib.inflateSync(streamData);
      const str = decompressed.toString('utf8');
      if (str.includes('Tj') || str.includes('TJ')) {
        decompressedWithText++;
        sampleTexts.push(str);
      }
    } catch (e) {
      // not flate or error
    }

    pos = eIdx + 9;
  }

  console.log(`Total streams: ${streamCount}, Streams with Tj/TJ: ${decompressedWithText}`);
  return sampleTexts;
}

const texts = scanPdf('d:/astrology/REP_adc3da9a4266.pdf');
console.log('Sample texts captured:', texts.length);

// Let's inspect the first few text streams
if (texts.length > 0) {
  for (let i = 0; i < Math.min(texts.length, 5); i++) {
    console.log(`\n=== TEXT STREAM ${i} ===`);
    console.log(texts[i].slice(0, 1000));
  }
}

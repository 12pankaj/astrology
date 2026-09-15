import fs from 'fs';
import zlib from 'zlib';

function extractTextFromPdf(filePath) {
  const data = fs.readFileSync(filePath);
  const textChunks = [];

  // Search for stream ... endstream
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match;
  let count = 0;

  // Search for objects with /Filter /FlateDecode
  const objRegex = /<<[\s\S]*?>>\s*stream\r?\n([\s\S]*?)\r?\nendstream/g;
  
  // Alternative: scan by indices
  let pos = 0;
  while (pos < data.length) {
    const streamStart = data.indexOf(Buffer.from('stream'), pos);
    if (streamStart === -1) break;

    // find start of stream data
    let dataStart = streamStart + 6;
    if (data[dataStart] === 0x0d && data[dataStart + 1] === 0x0a) dataStart += 2;
    else if (data[dataStart] === 0x0a) dataStart += 1;

    const streamEnd = data.indexOf(Buffer.from('endstream'), dataStart);
    if (streamEnd === -1) break;

    const compressed = data.subarray(dataStart, streamEnd);
    try {
      const decompressed = zlib.inflateSync(compressed);
      const str = decompressed.toString('utf8');
      if (str.includes('BT') && str.includes('ET')) {
        // PDF text object
        textChunks.push(str);
      }
    } catch (e) {
      // not flate or raw image
    }

    pos = streamEnd + 9;
    count++;
    if (textChunks.length > 200) break; // enough samples
  }

  return textChunks;
}

const chunks = extractTextFromPdf('d:/astrology/REP_adc3da9a4266.pdf');
console.log(`Extracted ${chunks.length} text streams from PDF.`);

// Print first few meaningful texts
for (let i = 0; i < Math.min(chunks.length, 10); i++) {
  console.log(`--- STREAM ${i} ---`);
  // extract strings in parentheses: (Text) Tj
  const matches = chunks[i].match(/\((.*?)\)\s*Tj/g) || chunks[i].match(/\[(.*?)\]\s*TJ/g);
  if (matches) {
    console.log(matches.slice(0, 30).join(' '));
  } else {
    console.log(chunks[i].slice(0, 300));
  }
}

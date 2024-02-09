const fs = require('fs');
const crypto = require('crypto');

const inputFile = './data/world_university_names.sql';
const outputFile = 'world_universities.json';

const data = [];

const readStream = fs.createReadStream(inputFile, { encoding: 'utf8' });

let buffer = "";

readStream.on('data', (chunk) => {
  buffer += chunk;

  const entries = buffer.split('\n');

  // Process all but the last entry
  for (let i = 0; i < entries.length - 1; i++) {
    const entry = entries[i];
    if (entry.trim() === '=====STOP HERE====') {
      readStream.close();
      return;
    }

    const hexCode = crypto.randomBytes(3).toString('hex');
    const match = /(\d+), (\d+), '(.+)'/.exec(entry);
    if (match && match.length === 4) {
      let [, id, parentId, name] = match;
      name = name.split(",").length > 1 ? name.split(",")[0].replace("'",""):name.replace("'","");
      data.push({
        id: parseInt(id),
        parentId: parseInt(parentId),
        name:name,
        nickname:name.split(" ").length > 1 ? name.split(" ").join("-").replace(",","").toLowerCase() +"-"+ hexCode : name.toLowerCase()+"-"+hexCode,
      });
    }
  }

  // Update buffer with the last incomplete entry
  buffer = entries[entries.length - 1];
});


readStream.on('close', () => {
  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
});

const path = require('path');
const fs = require('fs');


let data = '';
const txtStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
txtStream.on('data', chunk => data+=chunk);
txtStream.on('end', () => console.log(data));
txtStream.on('error', error => console.log('Error', error.message));
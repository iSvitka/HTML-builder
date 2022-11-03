const {stdin, stdout, exit} = process;
const path = require('path');
const fs = require('fs');


fs.writeFile(path.join(__dirname, 'result.txt'), '', err => {
    if(err){
        throw err
    };
});

const resultWriteStream = fs.createWriteStream(path.join(__dirname, 'result.txt'));
stdout.write('Write some text...\n');
stdin.on('data', data => {
    if(data.toString().trim() === 'exit'){
        exit();
    }
    resultWriteStream.write(data);
});

process.on('exit', () => stdout.write('\nBye!\n'));
process.on('SIGINT', () => exit());
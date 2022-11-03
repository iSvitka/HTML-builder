const path = require('path');
const fs = require('fs');


const secretPath = path.join(__dirname, 'secret-folder');
fs.readdir(secretPath, {withFileTypes: true}, (err, files) => {
    if(err) {
        throw err;
    }
    let arrFromFiles = Array.from(files);

    arrFromFiles.forEach(file => {
        if(file.isFile()){
            let fileName = file.name.split('.')[0];
            let fileType = path.extname(file.name).slice(1);
            let fileSize; 
            fs.stat(path.join(secretPath, file.name), (err, stats) => {
                if(err){
                    throw err
                }
                fileSize = (stats.size / 1024).toFixed(3) + ' KB';
                console.log(`${fileName} - ${fileType} - ${fileSize}`);
            });
        }
    })
})